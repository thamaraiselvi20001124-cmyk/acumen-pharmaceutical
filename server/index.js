
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { openDb, initDb } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

// Routes

app.get('/api/jobs', async (req, res) => {
    try {
        const db = await openDb();
        const jobs = await db.all('SELECT * FROM jobs ORDER BY created_at DESC');
        for (let job of jobs) {
            job.files = await db.all('SELECT * FROM files WHERE job_id = ?', job.id);
        }
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/jobs', upload.fields([{ name: 'brandFiles', maxCount: 5 }, { name: 'marketFiles', maxCount: 5 }]), async (req, res) => {
    try {
        const db = await openDb();
        const { title, job_type, brand_name, brand_guidelines } = req.body;

        // Insert job
        const result = await db.run(
            'INSERT INTO jobs (title, job_type, brand_name, brand_guidelines) VALUES (?, ?, ?, ?)',
            [title, job_type, brand_name, brand_guidelines]
        );

        const jobId = result.lastID;
        const jobUniqueId = `JOB${jobId}`;

        // Update unique ID
        await db.run('UPDATE jobs SET job_unique_id = ? WHERE id = ?', [jobUniqueId, jobId]);

        // Handle files
        // brandFiles
        if (req.files && req.files['brandFiles']) {
            for (let file of req.files['brandFiles']) {
                await db.run('INSERT INTO files (job_id, file_type, file_path, file_name) VALUES (?, ?, ?, ?)',
                    [jobId, 'reference', file.filename, file.originalname]);
            }
        }
        // marketFiles
        if (req.files && req.files['marketFiles']) {
            for (let file of req.files['marketFiles']) {
                await db.run('INSERT INTO files (job_id, file_type, file_path, file_name) VALUES (?, ?, ?, ?)',
                    [jobId, 'marketed', file.filename, file.originalname]);
            }
        }

        res.json({ id: jobId, jobUniqueId, message: 'Job created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/jobs/:id/status', async (req, res) => {
    try {
        const db = await openDb();
        const { status } = req.body;
        await db.run('UPDATE jobs SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/jobs/:id/cdr', upload.single('cdrFile'), async (req, res) => {
    try {
        const db = await openDb();
        const jobId = req.params.id;
        if (req.file) {
            await db.run('INSERT INTO files (job_id, file_type, file_path, file_name) VALUES (?, ?, ?, ?)',
                [jobId, 'cdr', req.file.filename, req.file.originalname]);

            // Optionally update status to Completed
            await db.run('UPDATE jobs SET status = ? WHERE id = ?', ['Completed', jobId]);
        }
        res.json({ message: 'CDR uploaded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const db = await openDb();
        const jobId = req.params.id;

        // Delete associated files from database
        await db.run('DELETE FROM files WHERE job_id = ?', [jobId]);

        // Delete the job
        await db.run('DELETE FROM jobs WHERE id = ?', [jobId]);

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Start
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

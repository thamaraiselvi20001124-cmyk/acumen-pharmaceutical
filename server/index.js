
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { openDb, initDb } from './database.js';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public directory
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcqnjidr37',
    api_key: process.env.CLOUDINARY_API_KEY || '114248133699389',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'rNhulaHRjZDelW2huLsXuOPiz3Q'
});

// Use memory storage for temporary file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


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


// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'acumen-pharmaceutical',
                resource_type: 'auto',
                public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

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

        // Handle files - Upload to Cloudinary
        // brandFiles (reference files)
        if (req.files && req.files['brandFiles']) {
            for (let file of req.files['brandFiles']) {
                const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);
                await db.run('INSERT INTO files (job_id, file_type, file_path, file_name) VALUES (?, ?, ?, ?)',
                    [jobId, 'reference', cloudinaryResult.secure_url, file.originalname]);
            }
        }
        // marketFiles (marketing files)
        if (req.files && req.files['marketFiles']) {
            for (let file of req.files['marketFiles']) {
                const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);
                await db.run('INSERT INTO files (job_id, file_type, file_path, file_name) VALUES (?, ?, ?, ?)',
                    [jobId, 'marketed', cloudinaryResult.secure_url, file.originalname]);
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

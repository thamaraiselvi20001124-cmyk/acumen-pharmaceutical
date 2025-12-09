// State Management
let currentUser = null;
let jobs = [];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log('App initialized');
    loadJobs();
    setupFileUploadHandlers();
    setupFormHandler();
    setupModal();
});

// Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Hide previous error
    errorDiv.style.display = 'none';

    // Validate credentials (SECURE - In production, this should be server-side with bcrypt)
    if (username === 'acumen_admin_2025' && password === 'Ac#2025$Pharm@SecAdmin') {
        login('admin');
    } else if (username === 'designer_acumen_2025' && password === 'D3s!gn@Acumen#2025Pvt') {
        login('designer');
    } else {
        // Show error
        errorDiv.textContent = '❌ Invalid username or password. Please try again.';
        errorDiv.style.display = 'block';

        // Shake animation
        const form = document.getElementById('loginForm');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Login - Switch to appropriate portal
function login(role) {
    currentUser = role;
    document.getElementById('loginPage').classList.remove('active');

    if (role === 'admin') {
        document.getElementById('adminPage').classList.add('active');
        loadAdminDashboard();
    } else {
        document.getElementById('designerPage').classList.add('active');
        loadDesignerDashboard();
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('adminPage').classList.remove('active');
    document.getElementById('designerPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');

    // Reset form
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
}

// Admin View Switching
function showAdminView(view) {
    document.querySelectorAll('#adminPage .nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if ((view === 'dashboard' && index === 0) || (view === 'create' && index === 1)) {
            item.classList.add('active');
        }
    });

    document.getElementById('dashboardView').classList.remove('active');
    document.getElementById('createView').classList.remove('active');
    document.getElementById('monthlyView').classList.remove('active');

    if (view === 'dashboard') {
        document.getElementById('dashboardView').classList.add('active');
    } else if (view === 'create') {
        document.getElementById('createView').classList.add('active');
    } else if (view === 'monthly') {
        document.getElementById('monthlyView').classList.add('active');
    }
}

// Load Jobs from Backend
async function loadJobs() {
    try {
        const response = await fetch('http://localhost:3000/api/jobs');
        jobs = await response.json();
        console.log('Loaded jobs:', jobs.length);
        updateStats();
        renderRecentJobs();
        updateDesignerJobList();
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Update Stats
function updateStats() {
    const total = jobs.length;
    const pending = jobs.filter(j => j.status === 'Pending').length;
    const ongoing = jobs.filter(j => j.status === 'Ongoing').length;
    const completed = jobs.filter(j => j.status === 'Completed').length;

    document.getElementById('totalJobs').textContent = total;
    document.getElementById('pendingJobs').textContent = pending;
    document.getElementById('ongoingJobs').textContent = ongoing;
    document.getElementById('completedJobs').textContent = completed;
}

// Render Recent Jobs
function renderRecentJobs() {
    const container = document.getElementById('recentJobsList');

    if (jobs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No jobs yet. Create your first job to get started!</p></div>';
        return;
    }

    const recentJobs = jobs.slice(0, 4);
    container.innerHTML = recentJobs.map(job => `
        <div class="job-card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; font-weight: 700; color: #DC2626;">${job.job_unique_id}</span>
                        <span style="color: #9CA3AF;">•</span>
                        <span style="font-size: 0.875rem; color: #6B7280;">${job.job_type}</span>
                    </div>
                    <h3 style="font-size: 1.125rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem;">${job.title}</h3>
                </div>
                <span class="badge badge-${job.status.toLowerCase()}">${job.status}</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #6B7280; margin-bottom: 0.75rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>Brand: <strong style="color: #111827;">${job.brand_name}</strong></span>
            </div>
            
            <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: #9CA3AF; margin-bottom: 1rem;">
                <span>📅 ${new Date(job.created_at).toLocaleDateString()}</span>
                <span>📎 ${job.files?.length || 0} files</span>
            </div>
            
            <p style="font-size: 0.875rem; color: #6B7280; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${job.brand_guidelines}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #F3F4F6;">
                <button onclick="showJobDetailsModal(${job.id})" style="border: none; background: none; font-size: 0.875rem; font-weight: 500; color: #DC2626; cursor: pointer; transition: color 0.15s;">
                    View Details →
                </button>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editJob(${job.id})" title="Edit Job" style="width: 2rem; height: 2rem; border: none; background: #EFF6FF; color: #2563EB; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;">
                        ✏️
                    </button>
                    ${job.files?.find(f => f.file_type === 'cdr') ? `
                        <a href="http://localhost:3000/uploads/${job.files.find(f => f.file_type === 'cdr').file_path}" download title="Download CDR" style="width: 2rem; height: 2rem; border: none; background: #DCFCE7; color: #16A34A; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.15s;">
                            📥
                        </a>
                    ` : ''}
                    <button onclick="deleteJob(${job.id})" title="Delete Job" style="width: 2rem; height: 2rem; border: none; background: #FEF2F2; color: #DC2626; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s;">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Modal
function setupModal() {
    const modal = document.createElement('div');
    modal.id = 'jobDetailsModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '1000';
    modal.style.overflow = 'auto';

    modal.innerHTML = `
        <div style="max-width: 56rem; margin: 2rem auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div id="modalContent"></div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeJobDetailsModal();
        }
    });
}

// Show Job Details Modal
function showJobDetailsModal(jobId) {
    const job = jobs.find(j => j.id == jobId);
    if (!job) return;

    const modal = document.getElementById('jobDetailsModal');
    const content = document.getElementById('modalContent');

    const referenceFiles = job.files?.filter(f => f.file_type === 'reference') || [];
    const marketedFiles = job.files?.filter(f => f.file_type === 'marketed') || [];
    const cdrFiles = job.files?.filter(f => f.file_type === 'cdr') || [];

    content.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                <div>
                    <span style="font-size: 0.875rem; font-weight: 700; color: #DC2626;">${job.job_unique_id}</span>
                    <h2 style="font-size: 1.875rem; font-weight: 700; margin: 0.5rem 0;">${job.title}</h2>
                    <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.5rem;">
                        <span>Type: <strong>${job.job_type}</strong></span> • 
                        <span>Brand: <strong>${job.brand_name}</strong></span> • 
                        <span>${new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <span class="badge badge-${job.status.toLowerCase()}">${job.status}</span>
                    <button onclick="closeJobDetailsModal()" style="width: 2rem; height: 2rem; border: none; background: #F3F4F6; border-radius: 0.5rem; cursor: pointer; font-size: 1.25rem; color: #6B7280;">×</button>
                </div>
            </div>
            
            <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
                <h3 style="font-weight: 700; margin-bottom: 0.75rem;">Brand Instructions</h3>
                <p style="color: #374151; white-space: pre-wrap; line-height: 1.625;">${job.brand_guidelines}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="font-weight: 700; margin-bottom: 1rem;">Reference Files (${referenceFiles.length})</h3>
                    <div style="space-y: 0.5rem;">
                        ${referenceFiles.length > 0 ? referenceFiles.map(f => `
                            <a href="http://localhost:3000/uploads/${f.file_path}" download style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit; transition: background 0.15s;">
                                <div style="width: 2.5rem; height: 2.5rem; background: #FEF2F2; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    📄
                                </div>
                                <div style="flex: 1; min-width: 0;">
                                    <div style="font-size: 0.875rem; font-weight: 500; color: #111827; overflow: hidden; text-overflow: ellipsis;">${f.file_name}</div>
                                    <div style="font-size: 0.75rem; color: #9CA3AF;">Click to download</div>
                                </div>
                            </a>
                        `).join('') : '<p style="color: #9CA3AF; font-size: 0.875rem;">No reference files</p>'}
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 700; margin-bottom: 1rem;">Marketing Files (${marketedFiles.length})</h3>
                    <div style="space-y: 0.5rem;">
                        ${marketedFiles.length > 0 ? marketedFiles.map(f => `
                            <a href="http://localhost:3000/uploads/${f.file_path}" download style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit; transition: background 0.15s;">
                                <div style="width: 2.5rem; height: 2.5rem; background: #FEF2F2; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    📄
                                </div>
                                <div style="flex: 1; min-width: 0;">
                                    <div style="font-size: 0.875rem; font-weight: 500; color: #111827; overflow: hidden; text-overflow: ellipsis;">${f.file_name}</div>
                                    <div style="font-size: 0.75rem; color: #9CA3AF;">Click to download</div>
                                </div>
                            </a>
                        `).join('') : '<p style="color: #9CA3AF; font-size: 0.875rem;">No marketing files</p>'}
                    </div>
                </div>
            </div>
            
            ${cdrFiles.length > 0 ? `
                <div style="background: #DCFCE7; border: 1px solid #BBF7D0; border-radius: 0.75rem; padding: 1.5rem;">
                    <h3 style="font-weight: 700; color: #166534; margin-bottom: 1rem;">Completed Work (CDR Files)</h3>
                    <div>
                        ${cdrFiles.map(f => `
                            <a href="http://localhost:3000/uploads/${f.file_path}" download style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #16A34A; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.875rem; margin-right: 0.5rem;">
                                📥 Download ${f.file_name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''
        }
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Job Details Modal
function closeJobDetailsModal() {
    const modal = document.getElementById('jobDetailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// File Upload Handlers
function setupFileUploadHandlers() {
    const brandFiles = document.getElementById('brandFiles');
    const marketFiles = document.getElementById('marketFiles');

    if (brandFiles) {
        brandFiles.addEventListener('change', function () {
            document.getElementById('brandFilesCount').textContent = `${this.files.length} files selected`;
        });
    }

    if (marketFiles) {
        marketFiles.addEventListener('change', function () {
            document.getElementById('marketFilesCount').textContent = `${this.files.length} files selected`;
        });
    }
}

// Form Handler
function setupFormHandler() {
    const form = document.getElementById('createJobForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title.value);
        formData.append('job_type', form.job_type.value);
        formData.append('brand_name', form.brand_name.value);
        formData.append('brand_guidelines', form.brand_guidelines.value);

        const brandFiles = document.getElementById('brandFiles').files;
        const marketFiles = document.getElementById('marketFiles').files;

        for (let file of brandFiles) {
            formData.append('brandFiles', file);
        }

        for (let file of marketFiles) {
            formData.append('marketFiles', file);
        }

        try {
            const response = await fetch('http://localhost:3000/api/jobs', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Job created successfully!');
                form.reset();
                document.getElementById('brandFilesCount').textContent = '0 files selected';
                document.getElementById('marketFilesCount').textContent = '0 files selected';
                await loadJobs();
                showAdminView('dashboard');
            } else {
                alert('Error creating job');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating job');
        }
    });
}

// Load Admin Dashboard
function loadAdminDashboard() {
    updateStats();
    renderRecentJobs();
}

// Load Designer Dashboard
function loadDesignerDashboard() {
    updateDesignerJobList();
}

// Update Designer Job List
function updateDesignerJobList() {
    const select = document.getElementById('designerJobSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Select a job...</option>' +
        jobs.map(job => `< option value = "${job.id}" > ${job.job_unique_id} - ${job.title}</option > `).join('');
}

// Load Job Details (Designer View)
async function loadJobDetails(jobId) {
    if (!jobId) {
        document.getElementById('jobDetailsContainer').style.display = 'none';
        return;
    }

    const job = jobs.find(j => j.id == jobId);
    if (!job) return;

    const container = document.getElementById('jobDetailsContainer');
    container.style.display = 'block';

    const referenceFiles = job.files?.filter(f => f.file_type === 'reference') || [];
    const marketedFiles = job.files?.filter(f => f.file_type === 'marketed') || [];

    container.innerHTML = `
    < div style = "margin-bottom: 1.5rem;" >
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <div>
                    <span style="font-size: 0.875rem; font-weight: 700; color: #DC2626;">${job.job_unique_id}</span>
                    <h2 style="font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0;">${job.title}</h2>
                    <div style="font-size: 0.875rem; color: #6B7280;">
                        <span>Brand: <strong>${job.brand_name}</strong></span> • 
                        <span>${new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <span class="badge badge-${job.status.toLowerCase()}">${job.status}</span>
            </div>
            
            <div style="background: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
                <h3 style="font-weight: 700; margin-bottom: 0.75rem;">Brand Instructions</h3>
                <p style="color: #374151; white-space: pre-wrap;">${job.brand_guidelines}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div>
                    <h3 style="font-weight: 700; margin-bottom: 0.75rem;">Reference Files</h3>
                    ${referenceFiles.length > 0 ? referenceFiles.map(f => `
                        <a href="http://localhost:3000/uploads/${f.file_path}" download style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit;">
                            <div style="width: 2.5rem; height: 2.5rem; background: #FEF2F2; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                📄
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 0.875rem; font-weight: 500; color: #111827; overflow: hidden; text-overflow: ellipsis;">${f.file_name}</div>
                            </div>
                        </a>
                    `).join('') : '<p style="color: #9CA3AF; font-size: 0.875rem;">No reference files</p>'}
                </div>
                
                <div>
                    <h3 style="font-weight: 700; margin-bottom: 0.75rem;">Marketing Files</h3>
                    ${marketedFiles.length > 0 ? marketedFiles.map(f => `
                        <a href="http://localhost:3000/uploads/${f.file_path}" download style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit;">
                            <div style="width: 2.5rem; height: 2.5rem; background: #FEF2F2; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                📄
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 0.875rem; font-weight: 500; color: #111827; overflow: hidden; text-overflow: ellipsis;">${f.file_name}</div>
                            </div>
                        </a>
                    `).join('') : '<p style="color: #9CA3AF; font-size: 0.875rem;">No marketing files</p>'}
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #F3F4F6;">
                <h3 style="font-weight: 700; margin-bottom: 1rem;">Actions</h3>
                ${job.status === 'Pending' ? `
                    <button onclick="updateJobStatus(${job.id}, 'Ongoing')" class="btn btn-primary">Start Working</button>
                ` : job.status === 'Ongoing' ? `
                    <div>
                        <input type="file" id="cdrUpload" accept=".cdr" style="margin-bottom: 0.5rem;">
                        <button onclick="uploadCDR(${job.id})" class="btn btn-primary">Submit & Complete</button>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="width: 4rem; height: 4rem; background: #DCFCE7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
                            ✓
                        </div>
                        <p style="font-weight: 600; color: #111827;">Job Completed</p>
                        <p style="font-size: 0.875rem; color: #6B7280;">Great work!</p>
                    </div>
                `}
            </div>
        </div >
    `;
}

// Update Job Status
async function updateJobStatus(jobId, status) {
    try {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            await loadJobs();
            loadJobDetails(jobId);
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Upload CDR
async function uploadCDR(jobId) {
    const fileInput = document.getElementById('cdrUpload');
    if (!fileInput.files.length) {
        alert('Please select a CDR file');
        return;
    }

    const formData = new FormData();
    formData.append('cdrFile', fileInput.files[0]);

    try {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}/cdr`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('File uploaded successfully!');
            await loadJobs();
            loadJobDetails(jobId);
        } else {
            alert('Error uploading file');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading file');
    }
}

// Edit Job
function editJob(jobId) {
    const job = jobs.find(j => j.id == jobId);
    if (!job) return;

    showAdminView('create');

    setTimeout(() => {
        const form = document.getElementById('createJobForm');
        if (form) {
            form.title.value = job.title;
            form.job_type.value = job.job_type;
            form.brand_name.value = job.brand_name;
            form.brand_guidelines.value = job.brand_guidelines;

            form.dataset.editingJobId = jobId;

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Update Job';
            }
        }
    }, 100);
}

// Delete Job - FIXED VERSION
async function deleteJob(jobId) {
    console.log('=== DELETE JOB CALLED ===');
    console.log('Job ID:', jobId);

    const job = jobs.find(j => j.id == jobId);
    console.log('Found job:', job);

    if (!job) {
        console.error('Job not found!');
        alert('Job not found!');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete job "${job.title}"?`);
    console.log('User confirmed:', confirmed);

    if (!confirmed) {
        return;
    }

    console.log('Proceeding with delete...');

    try {
        const url = `http://localhost:3000/api/jobs/${jobId}`;
        console.log('DELETE URL:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log('Delete successful:', data);
            alert('Job deleted successfully!');
            console.log('Reloading jobs...');
            await loadJobs();
            console.log('Jobs reloaded!');
        } else {
            const errorText = await response.text();
            console.error('Delete failed:', response.status, errorText);
            alert(`Error deleting job: ${response.status}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert(`Error: ${error.message}. Is the server running?`);
    }
}

// Designer View Switching
function showDesignerView(view) {
    // Update nav active state
    document.querySelectorAll('#designerPage .nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if ((view === 'tasks' && index === 0) || (view === 'completed' && index === 1)) {
            item.classList.add('active');
        }
    });

    // Show the appropriate view
    document.getElementById('tasksView').classList.remove('active');
    document.getElementById('completedView').classList.remove('active');

    if (view === 'tasks') {
        document.getElementById('tasksView').classList.add('active');
    } else if (view === 'completed') {
        document.getElementById('completedView').classList.add('active');
        loadCompletedTasks();
    }
}

// Load Completed Tasks
function loadCompletedTasks() {
    const completedJobs = jobs.filter(j => j.status === 'Completed');
    const tbody = document.getElementById('completedTasksList');
    const countBadge = document.getElementById('completedCount');

    // Update count badge
    countBadge.textContent = completedJobs.length;

    if (completedJobs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 3rem; text-align: center; color: #9CA3AF;">
                    No completed tasks yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = completedJobs.map((job, index) => `
        <tr style="border-bottom: 1px solid #F3F4F6;">
            <td style="padding: 1rem; font-size: 0.875rem; color: #6B7280;">${index + 1}</td>
            <td style="padding: 1rem;">
                <span style="font-size: 0.875rem; font-weight: 600; color: #DC2626;">${job.job_unique_id}</span>
            </td>
            <td style="padding: 1rem; font-size: 0.875rem; color: #111827; font-weight: 500;">${job.title}</td>
            <td style="padding: 1rem; font-size: 0.875rem; color: #6B7280;">${job.job_type}</td>
            <td style="padding: 1rem; font-size: 0.875rem; color: #6B7280;">${job.brand_name}</td>
            <td style="padding: 1rem; font-size: 0.875rem; color: #6B7280;">${new Date(job.created_at).toLocaleDateString()}</td>
            <td style="padding: 1rem;">
                <span style="background: #DCFCE7; color: #16A34A; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;">
                    ✓ Completed
                </span>
            </td>
        </tr>
    `).join('');
}

// Update Designer Job List Dropdown
function updateDesignerJobList() {
    const select = document.getElementById('designerJobSelect');
    if (!select) return;

    // Keep the default option and add all jobs
    select.innerHTML = '<option value="">Select a job...</option>' +
        jobs.map(job => `
            <option value="${job.id}">${job.job_unique_id} - ${job.title} (${job.status})</option>
        `).join('');
}

// Load Designer Dashboard
function loadDesignerDashboard() {
    updateDesignerJobList();
    loadCompletedTasks();
}

// Show Monthly Jobs
function showMonthlyJobs(monthKey) {
    // monthKey format: "2025-12", "2026-01", etc.
    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    const [year, month] = monthKey.split('-');
    const monthName = monthNames[month];

    // Update title
    document.getElementById('monthlyTitle').textContent = `${monthName} ${year} Jobs`;

    // Filter jobs by month
    const monthlyJobs = jobs.filter(job => {
        const jobDate = new Date(job.created_at);
        const jobMonth = String(jobDate.getMonth() + 1).padStart(2, '0');
        const jobYear = String(jobDate.getFullYear());
        return `${jobYear}-${jobMonth}` === monthKey;
    });

    // Create month-based job IDs (J001, J002, etc.)
    const tbody = document.getElementById('monthlyJobsList');

    if (monthlyJobs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="padding: 3rem; text-align: center; color: #9CA3AF;">
                    No jobs found for ${monthName} ${year}
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = monthlyJobs.map((job, index) => {
            const monthlyJobId = `J${String(index + 1).padStart(3, '0')}`;
            const createdDate = new Date(job.created_at).toLocaleDateString();

            return `
                <tr style="border-bottom: 1px solid #F3F4F6; transition: background 0.15s;" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='white'">
                    <td style="padding: 1rem;">
                        <span style="font-weight: 700; color: #DC2626; font-size: 0.875rem;">${monthlyJobId}</span>
                    </td>
                    <td style="padding: 1rem; font-size: 0.875rem; color: #111827; font-weight: 500;">${job.brand_name}</td>
                    <td style="padding: 1rem;">
                        <span style="display: inline-block; padding: 0.25rem 0.75rem; background: #EFF6FF; color: #1D4ED8; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;">
                            ${job.job_type}
                        </span>
                    </td>
                    <td style="padding: 1rem; font-size: 0.875rem; color: #6B7280;">${createdDate}</td>
                </tr>
            `;
        }).join('');
    }

    // Switch to monthly view
    showAdminView('monthly');
}

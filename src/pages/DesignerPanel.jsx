
import React, { useState, useEffect } from 'react';
import { LogOut, Download, Play, CheckCircle, Clock, Briefcase, Grid3x3, FolderOpen, Settings, Upload } from 'lucide-react';

export default function DesignerPanel({ onLogout }) {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [cdrFile, setCdrFile] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        fetch('http://localhost:3000/api/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                if (data.length > 0) setSelectedJob(data[0]);
            });
    };

    const handleStatusUpdate = async (id, status) => {
        await fetch(`http://localhost:3000/api/jobs/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchJobs();
        if (selectedJob) setSelectedJob({ ...selectedJob, status });
    };

    const handleUpload = async () => {
        if (!cdrFile || !selectedJob) return;
        const data = new FormData();
        data.append('cdrFile', cdrFile);

        try {
            await fetch(`http://localhost:3000/api/jobs/${selectedJob.id}/cdr`, {
                method: 'POST',
                body: data
            });
            alert('File Uploaded Successfully!');
            handleStatusUpdate(selectedJob.id, 'Completed');
            setCdrFile(null);
        } catch (e) { alert('Upload failed'); }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <Briefcase size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">JobFlow</span>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <Grid3x3 size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <FolderOpen size={18} />
                        <span className="text-sm font-medium">All Jobs</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-red-600 text-white rounded-lg">
                        <Briefcase size={18} />
                        <span className="text-sm font-medium">Designer View</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <CheckCircle size={18} />
                        <span className="text-sm font-medium">Completed</span>
                    </a>
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition w-full">
                        <Settings size={18} />
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Designer Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">View assigned jobs, download assets, and upload completed work</p>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Job Selector */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-gray-900 mb-2">Select a Job</h2>
                            <p className="text-sm text-gray-500 mb-4">Choose a job to view details and work on</p>
                            <select
                                className="w-full max-w-md input"
                                value={selectedJob?.id || ''}
                                onChange={(e) => setSelectedJob(jobs.find(j => j.id == e.target.value))}
                            >
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.job_unique_id} - {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedJob && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Job Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="text-sm font-bold text-red-600 mb-1">{selectedJob.job_unique_id}</div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedJob.title}</h2>
                                                <div className="flex gap-6 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Briefcase size={16} className="text-red-500" />
                                                        <span>Brand: <strong className="text-gray-900">{selectedJob.brand_name}</strong></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span>Created: <strong className="text-gray-900">{new Date(selectedJob.created_at).toLocaleDateString()}</strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`badge badge-${selectedJob.status.toLowerCase().replace(' ', '')}`}>
                                                {selectedJob.status}
                                            </span>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="font-bold text-gray-900 mb-3">Brand Instructions</h3>
                                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedJob.brand_guidelines}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-3">Reference Files</h3>
                                                <div className="space-y-2">
                                                    {selectedJob.files?.filter(f => f.file_type === 'reference').map(f => (
                                                        <a key={f.id} href={`http://localhost:3000/uploads/${f.file_path}`} download className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">{f.file_name}</div>
                                                                <div className="text-xs text-gray-500">Jan 15, 2024</div>
                                                            </div>
                                                            <Download size={16} className="text-gray-400 group-hover:text-red-500" />
                                                        </a>
                                                    ))}
                                                    {(!selectedJob.files || !selectedJob.files.some(f => f.file_type === 'reference')) && (
                                                        <p className="text-sm text-gray-400 italic">No reference files</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-3">Marketing Files</h3>
                                                <div className="space-y-2">
                                                    {selectedJob.files?.filter(f => f.file_type === 'marketed').map(f => (
                                                        <a key={f.id} href={`http://localhost:3000/uploads/${f.file_path}`} download className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-900 truncate">{f.file_name}</div>
                                                                <div className="text-xs text-gray-500">Jan 15, 2024</div>
                                                            </div>
                                                            <Download size={16} className="text-gray-400 group-hover:text-red-500" />
                                                        </a>
                                                    ))}
                                                    {(!selectedJob.files || !selectedJob.files.some(f => f.file_type === 'marketed')) && (
                                                        <p className="text-sm text-gray-400 italic">No marketing files</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Sidebar */}
                                <div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                                        <h3 className="font-bold text-gray-900 mb-4">Actions</h3>

                                        {selectedJob.status === 'Pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(selectedJob.id, 'Ongoing')}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-sm mb-4"
                                            >
                                                <Play size={18} />
                                                Start Working
                                            </button>
                                        )}

                                        {selectedJob.status === 'Ongoing' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Completed Work</label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-500 transition cursor-pointer relative">
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setCdrFile(e.target.files[0])} />
                                                        <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                                        <div className="text-xs text-gray-500">
                                                            {cdrFile ? <span className="text-green-600 font-medium">{cdrFile.name}</span> : 'Click to upload CDR file'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleUpload}
                                                    disabled={!cdrFile}
                                                    className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition ${cdrFile ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    <CheckCircle size={18} />
                                                    Submit & Complete
                                                </button>
                                            </div>
                                        )}

                                        {selectedJob.status === 'Completed' && (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <CheckCircle size={32} className="text-green-600" />
                                                </div>
                                                <p className="font-semibold text-gray-900">Job Completed</p>
                                                <p className="text-sm text-gray-500 mt-1">Great work!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

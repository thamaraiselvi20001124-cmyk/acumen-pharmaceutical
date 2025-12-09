
import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Upload, FileText, Trash2, LogOut, Grid3x3, FolderOpen, Briefcase, CheckCircle, Settings, Download, ArrowRight } from 'lucide-react';

export default function AdminPanel({ onLogout }) {
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'create'
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, inprogress: 0, completed: 0 });
    const [loading, setLoading] = useState(false);

    // Job Form State
    const [formData, setFormData] = useState({ title: '', job_type: '', brand_name: '', brand_guidelines: '' });
    const [brandFiles, setBrandFiles] = useState([]);
    const [marketFiles, setMarketFiles] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        fetch('http://localhost:3000/api/jobs')
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setStats({
                    total: data.length,
                    pending: data.filter(j => j.status === 'Pending').length,
                    inprogress: data.filter(j => j.status === 'Ongoing').length,
                    completed: data.filter(j => j.status === 'Completed').length
                });
            });
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        brandFiles.forEach(file => data.append('brandFiles', file));
        marketFiles.forEach(file => data.append('marketFiles', file));

        try {
            await fetch('http://localhost:3000/api/jobs', { method: 'POST', body: data });
            alert('Job Created Successfully!');
            setFormData({ title: '', job_type: '', brand_name: '', brand_guidelines: '' });
            setBrandFiles([]);
            setMarketFiles([]);
            fetchJobs();
            setActiveView('dashboard');
        } catch (err) {
            alert('Error creating job');
        } finally {
            setLoading(false);
        }
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
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition w-full ${activeView === 'dashboard' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Grid3x3 size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveView('create')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition w-full ${activeView === 'create' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Plus size={18} />
                        <span className="text-sm font-medium">Create Job</span>
                    </button>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <FolderOpen size={18} />
                        <span className="text-sm font-medium">All Jobs</span>
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
                <main className="flex-1 overflow-y-auto">
                    {activeView === 'dashboard' ? (
                        <div className="p-8">
                            <div className="max-w-7xl mx-auto">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your jobs.</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveView('create')}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition"
                                    >
                                        <Plus size={18} />
                                        Create Job
                                    </button>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-1">Total Jobs</div>
                                                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                                            </div>
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Layers size={24} className="text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm text-amber-700 mb-1">Pending</div>
                                                <div className="text-3xl font-bold text-amber-900">{stats.pending}</div>
                                            </div>
                                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm text-blue-700 mb-1">In Progress</div>
                                                <div className="text-3xl font-bold text-blue-900">{stats.inprogress}</div>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-sm text-green-700 mb-1">Completed</div>
                                                <div className="text-3xl font-bold text-green-900">{stats.completed}</div>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <CheckCircle size={24} className="text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Jobs */}
                                <div>
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                                            View all
                                            <ArrowRight size={16} />
                                        </a>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {jobs.slice(0, 4).map(job => (
                                            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-bold text-red-600">{job.job_unique_id}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-sm text-gray-600">{job.job_type}</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                                                    </div>
                                                    <span className={`badge badge-${job.status.toLowerCase().replace(' ', '')}`}>
                                                        {job.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <Briefcase size={14} />
                                                    <span>Brand: <strong className="text-gray-900">{job.brand_name}</strong></span>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                    <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                                                    <span>📎 {job.files?.length || 0} files</span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.brand_guidelines}</p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <button className="text-sm font-medium text-gray-900 hover:text-red-600 flex items-center gap-1 transition">
                                                        View Details
                                                        <ArrowRight size={14} />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                                        <Download size={16} className="text-gray-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Create Job Form
                        <div className="p-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
                                    <p className="text-gray-500 mt-1">Fill in the details below to create a new design task</p>
                                </div>

                                <form onSubmit={handleCreateJob} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                                            <input type="text" className="input" placeholder="e.g. Summer Sale Banner" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                                            <select className="input" value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })} required>
                                                <option value="">Select Type</option>
                                                <option value="Logo Design">Logo Design</option>
                                                <option value="Social Media">Social Media</option>
                                                <option value="Packaging">Packaging</option>
                                                <option value="Banner">Banner</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
                                        <input type="text" className="input" placeholder="Brand Name" value={formData.brand_name} onChange={e => setFormData({ ...formData, brand_name: e.target.value })} required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Instructions</label>
                                        <textarea className="input h-32" placeholder="Detailed instructions..." value={formData.brand_guidelines} onChange={e => setFormData({ ...formData, brand_guidelines: e.target.value })} required></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Files</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-500 transition cursor-pointer relative">
                                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setBrandFiles(Array.from(e.target.files))} />
                                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                                <div className="text-sm font-medium text-gray-600">Click to upload</div>
                                                <div className="text-xs text-gray-500 mt-1">{brandFiles.length} files selected</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marketing Files</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-500 transition cursor-pointer relative">
                                                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setMarketFiles(Array.from(e.target.files))} />
                                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                                <div className="text-sm font-medium text-gray-600">Click to upload</div>
                                                <div className="text-xs text-gray-500 mt-1">{marketFiles.length} files selected</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveView('dashboard')} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition">
                                            {loading ? 'Creating...' : 'Create Job'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

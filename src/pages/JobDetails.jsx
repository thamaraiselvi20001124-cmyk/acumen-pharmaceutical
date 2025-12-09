
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Upload, FileText, CheckCircle, Clock } from 'lucide-react';

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cdrFile, setCdrFile] = useState(null);

    const fetchJob = () => {
        fetch(`http://localhost:3000/api/jobs`) // In real app, might implement get by ID endpoint
            .then(res => res.json())
            .then(data => {
                // Using loose comparison for string/number id mismatch
                const found = data.find(j => j.id == id);
                setJob(found);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    const updateStatus = async (newStatus) => {
        try {
            await fetch(`http://localhost:3000/api/jobs/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchJob();
        } catch (e) {
            alert('Error updating status');
        }
    };

    const handleCdrUpload = async () => {
        if (!cdrFile) return;
        const data = new FormData();
        data.append('cdrFile', cdrFile);

        try {
            await fetch(`http://localhost:3000/api/jobs/${id}/cdr`, {
                method: 'POST',
                body: data
            });
            updateStatus('Completed');
            alert('File uploaded and Job marked as Completed!');
            setCdrFile(null); // Clear input
        } catch (e) {
            alert('Upload failed');
        }
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div></div>;
    if (!job) return <div className="p-10 text-center text-red-500">Job not found</div>;

    return (
        <div className="max-w-6xl mx-auto pb-10 fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">#{job.job_unique_id}</span>
                        <span className={`badge badge-${job.status.toLowerCase().replace(' ', '')}`}>{job.status}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
                    <p className="text-xl text-gray-500 mt-2 font-light">{job.brand_name} <span className="text-gray-300 mx-2">|</span> {job.job_type}</p>
                </div>

                <div className="flex gap-3">
                    {job.status === 'Pending' && (
                        <button onClick={() => updateStatus('Ongoing')} className="btn btn-primary bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                            Start Job
                        </button>
                    )}
                    {job.status === 'Ongoing' && (
                        <button onClick={() => updateStatus('Completed')} className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50">
                            Mark Completed
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card glass">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <FileText size={20} className="text-red-500" /> Instructions & Guidelines
                        </h3>
                        <div className="prose text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {job.brand_guidelines}
                        </div>
                    </div>

                    <div className="card glass">
                        <h3 className="text-lg font-bold mb-6">Job Assets</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Reference Files</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {job.files?.filter(f => f.file_type === 'reference').map(f => (
                                        <a key={f.id} href={`http://localhost:3000/uploads/${f.file_path}`} download target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all group bg-white shadow-sm">
                                            <div className="bg-red-50 p-2.5 rounded-lg text-red-500 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                                            <div className="overflow-hidden flex-1">
                                                <div className="truncate font-medium text-sm text-gray-900">{f.file_name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">Reference File</div>
                                            </div>
                                            <Download size={18} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                                        </a>
                                    ))}
                                    {job.files?.filter(f => f.file_type === 'reference').length === 0 && <p className="text-gray-400 italic text-sm pl-2">No reference files uploaded.</p>}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Marketed / Asset Files</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {job.files?.filter(f => f.file_type === 'marketed').map(f => (
                                        <a key={f.id} href={`http://localhost:3000/uploads/${f.file_path}`} download target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all group bg-white shadow-sm">
                                            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                                            <div className="overflow-hidden flex-1">
                                                <div className="truncate font-medium text-sm text-gray-900">{f.file_name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">Asset File</div>
                                            </div>
                                            <Download size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </a>
                                    ))}
                                    {job.files?.filter(f => f.file_type === 'marketed').length === 0 && <p className="text-gray-400 italic text-sm pl-2">No asset files uploaded.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card bg-gray-900 text-white shadow-xl shadow-gray-900/20 border-0">
                        <h3 className="text-lg font-bold mb-2">Designer Workspace</h3>
                        <p className="text-gray-400 text-sm mb-6">Upload the final CDR output file here to complete the job.</p>

                        <div className="space-y-4">
                            <label className="block group cursor-pointer">
                                <span className="text-sm font-medium text-gray-300 mb-2 block">Upload Output (CDR)</span>
                                <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center group-hover:border-gray-400 transition-colors">
                                    <input type="file" onChange={e => setCdrFile(e.target.files[0])} className="hidden" />
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Upload size={20} className="text-gray-500 group-hover:text-white" />
                                        <span className="text-xs text-gray-400 group-hover:text-gray-200">{cdrFile ? cdrFile.name : 'Choose File'}</span>
                                    </div>
                                </div>
                            </label>
                            <button
                                disabled={!cdrFile || job.status === 'Completed'}
                                onClick={handleCdrUpload}
                                className={`w-full btn py-3 ${!cdrFile || job.status === 'Completed' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50'}`}
                            >
                                {job.status === 'Completed' ? 'Job Completed' : 'Submit Output'}
                            </button>
                        </div>
                    </div>

                    {/* Existing Output Files */}
                    {job.files?.some(f => f.file_type === 'cdr') && (
                        <div className="card glass">
                            <h3 className="text-base font-bold mb-3 text-gray-800">Completed Outputs</h3>
                            <div className="space-y-2">
                                {job.files?.filter(f => f.file_type === 'cdr').map(f => (
                                    <a key={f.id} href={`http://localhost:3000/uploads/${f.file_path}`} download target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border border-green-100 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <span className="text-sm font-medium text-green-900 truncate flex-1">{f.file_name}</span>
                                        <Download size={14} className="text-green-700" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card glass">
                        <h3 className="text-base font-bold mb-4">Activity Timeline</h3>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:h-[80%] before:w-0.5 before:bg-gray-200">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 bg-white rounded-full border-2 border-green-500 flex items-center justify-center z-10">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <p className="text-sm font-bold text-gray-800">Job Created</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(job.created_at).toLocaleString()}</p>
                            </div>
                            <div className="relative pl-8">
                                <div className={`absolute left-0 top-1 w-6 h-6 bg-white rounded-full border-2 z-10 flex items-center justify-center ${job.status !== 'Pending' ? 'border-blue-500' : 'border-gray-300'}`}>
                                    {job.status !== 'Pending' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                                <p className={`text-sm font-bold ${job.status !== 'Pending' ? 'text-gray-800' : 'text-gray-400'}`}>Work In Progress</p>
                                <p className="text-xs text-gray-400 mt-1">Designer started working</p>
                            </div>
                            <div className="relative pl-8">
                                <div className={`absolute left-0 top-1 w-6 h-6 bg-white rounded-full border-2 z-10 flex items-center justify-center ${job.status === 'Completed' ? 'border-green-500' : 'border-gray-300'}`}>
                                    {job.status === 'Completed' && <CheckCircle size={12} className="text-green-500" />}
                                </div>
                                <p className={`text-sm font-bold ${job.status === 'Completed' ? 'text-gray-800' : 'text-gray-400'}`}>Completed</p>
                                <p className="text-xs text-gray-400 mt-1">Final output uploaded</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

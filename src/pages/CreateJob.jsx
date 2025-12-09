
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

export default function CreateJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        job_type: '',
        brand_name: '',
        brand_guidelines: ''
    });
    const [brandFiles, setBrandFiles] = useState([]);
    const [marketFiles, setMarketFiles] = useState([]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, setFiles) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('job_type', formData.job_type);
        data.append('brand_name', formData.brand_name);
        data.append('brand_guidelines', formData.brand_guidelines);

        // Append files
        // Note: backend expects field names 'brandFiles' and 'marketFiles'
        brandFiles.forEach(file => data.append('brandFiles', file));
        marketFiles.forEach(file => data.append('marketFiles', file));

        try {
            const res = await fetch('http://localhost:3000/api/jobs', {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                navigate('/jobs');
            } else {
                const err = await res.json();
                alert('Error creating job: ' + (err.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error creating job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold mb-2">Create New Job</h1>
            <p className="text-gray-500 mb-8">Fill in the details below to assign a new task.</p>

            <form onSubmit={handleSubmit} className="card glass p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-gray-700">Job Title</label>
                        <input type="text" name="title" required className="input mt-1" placeholder="e.g. Summer Campaign Banner" onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="text-gray-700">Job Type</label>
                        <select name="job_type" required className="input mt-1" onChange={handleInputChange}>
                            <option value="">Select Type</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Print">Print</option>
                            <option value="Web Design">Web Design</option>
                            <option value="Packaging">Packaging</option>
                            <option value="Illustration">Illustration</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-gray-700">Brand Name</label>
                    <input type="text" name="brand_name" required className="input mt-1" placeholder="e.g. Nike" onChange={handleInputChange} />
                </div>

                <div>
                    <label className="text-gray-700">Brand Guidelines / Instructions</label>
                    <textarea name="brand_guidelines" required className="input mt-1 h-32 resize-none" placeholder="Describe the requirements involved..." onChange={handleInputChange}></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-gray-700 mb-2">Reference Files</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 hover:bg-red-50 transition-all cursor-pointer bg-gray-50 group relative">
                            <input type="file" multiple onChange={(e) => handleFileChange(e, setBrandFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 block">Click to upload</span>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {brandFiles.length ? <span className="text-green-600 font-bold">{brandFiles.length} files selected</span> : "JPG, PNG, PDF up to 10MB"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-700 mb-2">Marketed Files (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer bg-gray-50 group relative">
                            <input type="file" multiple onChange={(e) => handleFileChange(e, setMarketFiles)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 block">Click to upload</span>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {marketFiles.length ? <span className="text-green-600 font-bold">{marketFiles.length} files selected</span> : "Assets for the job"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button type="button" onClick={() => navigate('/')} className="mr-4 btn text-gray-500 hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary text-base px-8 py-3 shadow-lg shadow-red-500/30">
                        {loading ? 'Creating Job...' : 'Publish Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

export default function JobsList() {
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/jobs')
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.error(err));
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesFilter = filter === 'All' || job.status === filter;
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.brand_name.toLowerCase().includes(search.toLowerCase()) ||
            job.job_unique_id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Jobs Repository</h1>
                    <p className="text-gray-500 mt-1">Manage all pending and completed design tasks.</p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    + New Job
                </Link>
            </div>

            <div className="card glass mb-8 p-1 flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search jobs by title, brand or ID..."
                        className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-sm focus:ring-0 focus:outline-none placeholder-gray-400"
                        style={{ outline: 'none' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
                    {['All', 'Pending', 'Ongoing', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === status ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                    <Link key={job.id} to={`/job/${job.id}`} className="card hover:-translate-y-1 transition-all border border-transparent hover:border-red-100 group block relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${job.status === 'Completed' ? 'bg-green-500' : job.status === 'Ongoing' ? 'bg-blue-500' : 'bg-red-400'}`}></div>
                        <div className="flex justify-between items-start mb-4 pl-2">
                            <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">#{job.job_unique_id}</span>
                            <span className={`badge badge-${job.status.toLowerCase().replace(' ', '')}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="pl-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors pr-8">{job.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 font-medium">{job.brand_name}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 pl-2 mt-4">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{job.job_type}</span>
                            <span className="text-xs text-gray-400">{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
            {filteredJobs.length === 0 && <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No jobs found matching your criteria.</p>
                <button onClick={() => { setFilter('All'); setSearch('') }} className="text-red-500 text-sm mt-2 hover:underline">Clear filters</button>
            </div>}
        </div>
    );
}

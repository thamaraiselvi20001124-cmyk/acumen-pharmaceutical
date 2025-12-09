
import React, { useEffect, useState } from 'react';
import { Layers, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, ongoing: 0, completed: 0 });
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/jobs')
            .then(res => res.json())
            .then(data => {
                setStats({
                    total: data.length,
                    pending: data.filter(j => j.status === 'Pending').length,
                    ongoing: data.filter(j => j.status === 'Ongoing').length,
                    completed: data.filter(j => j.status === 'Completed').length
                });
                setRecentJobs(data.slice(0, 5));
            })
            .catch(err => console.error(err));
    }, []);


    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="card flex items-start justify-between p-6">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
                <Icon size={24} style={{ color: color }} />
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="mt-1 text-gray-500">Overview of your design workflow.</p>
                </div>
                <Link to="/create" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                    + New Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Jobs" value={stats.total} icon={Layers} color="#6366f1" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} color="#f97316" />
                <StatCard title="In Progress" value={stats.ongoing} icon={Activity} color="#3b82f6" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="#10b981" />
            </div>

            <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
            <div className="card glass overflow-hidden">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                            <th className="p-4 text-gray-500 font-medium">Job ID</th>
                            <th className="p-4 text-gray-500 font-medium">Brand</th>
                            <th className="p-4 text-gray-500 font-medium">Title</th>
                            <th className="p-4 text-gray-500 font-medium">Status</th>
                            <th className="p-4 text-gray-500 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentJobs.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">No jobs found. Create one to get started.</td></tr>
                        ) : recentJobs.map(job => (
                            <tr key={job.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                <td className="p-4 font-mono text-sm">{job.job_unique_id}</td>
                                <td className="p-4 font-medium">{job.brand_name}</td>
                                <td className="p-4 text-gray-600">{job.title}</td>
                                <td className="p-4">
                                    <span className={`badge badge-${job.status.toLowerCase().replace(' ', '')}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link to={`/job/${job.id}`} className="text-sm font-medium" style={{ color: 'var(--primary)' }}>View Details &rarr;</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

export default function Login({ setUserRole }) {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleLogin = (role) => {
        setUserRole(role);
        if (role === 'admin') navigate('/admin');
        else navigate('/designer');
    };

    return (
        <div className="min-h-screen flex items-center justify-center login-container overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-5xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-3xl blur-xl opacity-75 animate-pulse-slow"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-rose-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                                <span className="text-4xl font-black text-white">A</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 mb-3 tracking-tight">
                        Acumen
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-purple-600" />
                        <p className="text-lg text-gray-600 font-medium">Premium Job Management Portal</p>
                        <Sparkles size={16} className="text-purple-600" />
                    </div>
                </div>

                {/* Portal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Admin Card */}
                    <button
                        onClick={() => handleLogin('admin')}
                        onMouseEnter={() => setHoveredCard('admin')}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="group relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #EC4899 0%, #EF4444 100%)'
                        }}
                    >
                        <div className="relative bg-white rounded-[22px] p-10 h-full">
                            {/* Icon */}
                            <div className="mb-6 inline-flex">
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br from-rose-400 to-red-600 rounded-2xl blur-lg transition-opacity duration-300 ${hoveredCard === 'admin' ? 'opacity-75' : 'opacity-0'}`}></div>
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300 transform group-hover:rotate-3">
                                        <UserCircle2 size={32} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-red-600 transition-all duration-300">
                                Admin Portal
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Create new jobs, manage brand assets, and track overall progress.
                            </p>

                            <div className="flex items-center text-rose-600 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                                <span>Access Dashboard</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-rose-100 to-red-100 rounded-full opacity-50 blur-2xl"></div>
                        </div>
                    </button>

                    {/* Designer Card */}
                    <button
                        onClick={() => handleLogin('designer')}
                        onMouseEnter={() => setHoveredCard('designer')}
                        onMouseLeave={() => setHoveredCard(null)}
                        className="group relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                        }}
                    >
                        <div className="relative bg-white rounded-[22px] p-10 h-full">
                            {/* Icon */}
                            <div className="mb-6 inline-flex">
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg transition-opacity duration-300 ${hoveredCard === 'designer' ? 'opacity-75' : 'opacity-0'}`}></div>
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300 transform group-hover:rotate-3">
                                        <Briefcase size={32} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                Designer Portal
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                View assigned tasks, download assets, and upload completed work.
                            </p>

                            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                                <span>View My Tasks</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-2xl"></div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 font-medium">
                    © 2025 Acumen Inc. • Authorized Access Only
                </p>
            </div>
        </div>
    );
}

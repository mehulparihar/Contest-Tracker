import React, { useEffect } from 'react';
import useContestStore from '../stores/contestStore';
import { useTheme } from '../stores/useTheme';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaLightbulb, FaHistory } from 'react-icons/fa';

const PastPage = () => {
    const { contests, filteredContests, loading, error, fetchContests, filterContests, fetchPastContests } =
        useContestStore();
    const { darkMode } = useTheme();

    useEffect(() => {
        fetchPastContests();
    }, [fetchPastContests]);

    const handleFilterChange = (e) => {
        filterContests(e.target.value);
    };

    const getTimeLeft = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = start - now;
        if (diff <= 0) return 'Completed';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days}d ${hours}h ${minutes}m`;
    };

    const getContestDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
                <div className="text-2xl font-medium text-gray-600 dark:text-gray-300">Loading past contests...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center p-8 max-w-md bg-red-100 dark:bg-red-900/30 rounded-xl">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Contests</h2>
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                        Past Contests
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Review completed coding contests and their solutions to improve your skills
                    </p>
                </motion.div>

                {/* Filter Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filter by Platform
                            </label>
                            <select
                                id="platform"
                                onChange={handleFilterChange}
                                className="block w-full sm:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="All">All Platforms</option>
                                <option value="Codeforces">Codeforces</option>
                                <option value="CodeChef">CodeChef</option>
                                <option value="LeetCode">LeetCode</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {filteredContests.length} {filteredContests.length === 1 ? 'contest' : 'contests'}
                        </div>
                    </div>
                </motion.div>

                {/* Contest List */}
                <div className="grid gap-6">
                    {filteredContests.length > 0 ? (
                        filteredContests.map((contest, index) => (
                            <motion.div
                                key={contest.url}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Platform Logo */}
                                    <div className="flex-shrink-0">
                                        <div className={`p-3 rounded-xl ${contest.platform === 'Codeforces' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                                                        contest.platform === 'CodeChef' ? 'bg-red-100 dark:bg-red-900/30' : 
                                                        'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                                            <img
                                                src={`/${contest.platform.toLowerCase()}.png`}
                                                alt={contest.platform}
                                                className="w-14 h-14 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Contest Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{contest.title}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        contest.platform === 'Codeforces' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                                                        contest.platform === 'CodeChef' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                        {contest.platform}
                                                    </span>
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        Past Contest
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {new Date(contest.startTime).toLocaleString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {new Date(contest.endTime).toLocaleString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {getContestDuration(contest.startTime, contest.endTime)}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {getTimeLeft(contest.startTime)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            <a
                                                href={contest.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                                            >
                                                <FaExternalLinkAlt />
                                                Visit Contest
                                            </a>
                                            {contest.solutionLink && (
                                                <a
                                                    href={contest.solutionLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors duration-200"
                                                >
                                                    <FaLightbulb />
                                                    View Solutions
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No past contests available</h3>
                            <p className="text-gray-500 dark:text-gray-400">Check back later for completed contests</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastPage;
import React, { useEffect, useState } from 'react';
import useContestStore from '../stores/contestStore';
import { userStore } from '../stores/userStore';
import { FaBookmark, FaRegBookmark, FaExternalLinkAlt, FaLightbulb, FaFilter } from 'react-icons/fa';
import { useTheme } from '../stores/useTheme';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BookmarkPage = () => {
  const { contests, filteredContests, loading, error, fetchContests, filterContests, fetchBookmark, bookmarks, toggleBookmark } =
    useContestStore();
  const { user } = userStore();
  const { darkMode } = useTheme();
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (user) fetchBookmark(user._id);
  }, [fetchBookmark, user]);

  const handleFilterChange = (platform) => {
    setSelectedPlatform(platform);
    filterContests(platform);
    setIsFilterOpen(false);
  };

  const handleBookmark = (contestId) => {
    toggleBookmark(contestId);
    toast.success('Bookmark updated', {
      position: 'bottom-center',
      duration: 2000
    });
  };

  const getContestDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const CountdownTimer = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(startTime));

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(startTime));
      }, 1000);
      return () => clearInterval(interval);
    }, [startTime]);

    return <span className="font-mono">{timeLeft}</span>;
  };

  const getTimeLeft = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    if (diff <= 0) return 'LIVE NOW';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
        ></motion.div>
        <div className="text-2xl font-medium text-gray-600 dark:text-gray-300">Loading bookmarks...</div>
      </div>
    </div>
  );

  if (error) return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center justify-center h-screen"
    >
      <div className="text-center p-8 max-w-md bg-red-100 dark:bg-red-900/30 rounded-xl shadow-lg">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Bookmarks</h2>
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={() => user && fetchBookmark(user._id)}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Your Bookmarks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            All your saved coding contests in one place. Never miss an important competition.
          </p>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="sm:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm w-full justify-center"
            >
              <FaFilter />
              <span>Filter ({selectedPlatform})</span>
            </button>

            {/* Desktop Filter */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
              {['All', 'Codeforces', 'CodeChef', 'LeetCode'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleFilterChange(platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPlatform === platform
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {bookmarks?.length || 0} {bookmarks?.length === 1 ? 'bookmark' : 'bookmarks'} saved
            </div>
          </div>

          {/* Mobile Filter Dropdown */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 sm:hidden bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {['All', 'Codeforces', 'CodeChef', 'LeetCode'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleFilterChange(platform)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium ${
                    selectedPlatform === platform
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Bookmarked Contest List */}
        <div className="grid gap-6">
          {bookmarks?.length > 0 ? (
            bookmarks
              .filter(contest => selectedPlatform === 'All' || contest.platform === selectedPlatform)
              .map((contest, index) => (
                <motion.div
                  key={`${contest.url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Platform Logo */}
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-xl ${
                        contest.platform === 'Codeforces' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                        contest.platform === 'CodeChef' ? 'bg-red-100 dark:bg-red-900/30' : 
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <img
                          src={`/${contest.platform.toLowerCase()}.png`}
                          alt={contest.platform}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = '/ch.jpg'; 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Contest Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{contest.name}</h2>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              contest.platform === 'Codeforces' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                              contest.platform === 'CodeChef' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {contest.platform}
                            </span>
                            {new Date(contest.startTime) > new Date() ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                Upcoming
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                Ongoing
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleBookmark(contest._id)}
                          className="flex-shrink-0 text-2xl text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                          aria-label="Remove bookmark"
                        >
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            <FaBookmark />
                          </motion.div>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                          <p className="text-sm text-gray-500 dark:text-gray-400">Time Remaining</p>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            <CountdownTimer startTime={contest.startTime} />
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={contest.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                        >
                          <FaExternalLinkAlt />
                          Visit Contest
                        </motion.a>
                        {contest.solutionLink && (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={contest.solutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors duration-200"
                          >
                            <FaLightbulb />
                            View Solutions
                          </motion.a>
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
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {user ? "No bookmarks yet" : "Sign in to save contests"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {user ? "Start bookmarking contests to see them here" : "Login to bookmark your favorite contests"}
              </p>
              {!user && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/login"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Sign In
                </motion.a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;
import React, { useEffect, useState } from 'react';
import useContestStore from '../stores/contestStore';
import { userStore } from '../stores/userStore';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Bookmark icons

const BookmarkPage = () => {
  const { contests, filteredContests, loading, error, fetchContests, filterContests, fetchBookmark, bookmarks, toggleBookmark } =
    useContestStore();
  const { user } = userStore();

  // Fetch contests on component mount
  useEffect(() => {
    if (user) fetchBookmark(user._id);
  }, [fetchBookmark, user]);

  const handleFilterChange = (e) => {
    filterContests(e.target.value);
  };

  // Function to calculate contest duration
  const getContestDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Component for live countdown timer
  const CountdownTimer = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(startTime));

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft(startTime));
      }, 1000); // Update every second

      return () => clearInterval(interval); // Cleanup interval on unmount
    }, [startTime]);

    return <span>{timeLeft}</span>;
  };

  // Function to calculate time left for the contest
  const getTimeLeft = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading contests...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Bookmarks</h1>

        {/* Filter Dropdown */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Platform
            </label>
            <select
              id="platform"
              onChange={handleFilterChange}
              className="block w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Platforms</option>
              <option value="Codeforces">Codeforces</option>
              <option value="CodeChef">CodeChef</option>
              <option value="LeetCode">LeetCode</option>
            </select>
          </div>
        </div>

        {/* Contest List */}
        <div className="space-y-6">
          {bookmarks?.map((contest) => (
            <div
              key={contest.url}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20"
            >
              <div className="flex items-center space-x-6">
                {/* Platform Logo */}
                <img
                  src={`/${contest.platform.toLowerCase()}.png`}
                  alt={contest.platform}
                  className="w-14 h-14 rounded-lg"
                />
                <div className="flex-1">
                  {/* Contest Name */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{contest.name}</h2>
                  <p className="text-sm text-gray-600 mb-4">{contest.platform}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Starts:</p>
                      <p className="text-md font-medium text-gray-800">
                        {new Date(contest.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ends:</p>
                      <p className="text-md font-medium text-gray-800">
                        {new Date(contest.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration:</p>
                      <p className="text-md font-medium text-gray-800">
                        {getContestDuration(contest.startTime, contest.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Left:</p>
                      <p className="text-md font-medium text-gray-800">
                        <CountdownTimer startTime={contest.startTime} />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(contest._id)}
                  className="text-blue-600 hover:text-blue-800 text-2xl"
                >
                  {bookmarks?.some(b => b._id === contest._id) ? <FaBookmark /> : <FaRegBookmark />}
                </button>

                <div className="flex flex-col space-y-2">
                  <a
                    href={contest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-center"
                  >
                    Visit Contest
                  </a>
                  {contest.solutionLink && (
                    <a
                      href={contest.solutionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 text-center"
                    >
                      View Solution
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarkPage
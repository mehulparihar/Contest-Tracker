import React, { useEffect } from 'react';
import useContestStore from '../stores/contestStore';

const HomePage = () => {
  const { contests, filteredContests, loading, error, fetchContests, filterContests } =
    useContestStore();

  // Fetch contests on component mount
  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  // Handle platform filter change
  const handleFilterChange = (e) => {
    filterContests(e.target.value);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Contests</h1>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
            Filter by Platform
          </label>
          <select
            id="platform"
            onChange={handleFilterChange}
            className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Platforms</option>
            <option value="Codeforces">Codeforces</option>
            <option value="CodeChef">CodeChef</option>
            <option value="LeetCode">LeetCode</option>
          </select>
        </div>

        {/* Contest List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => (
            <div
              key={contest.url}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">{contest.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{contest.platform}</p>
              <p className="text-sm text-gray-600 mt-2">
                Starts: {new Date(contest.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Ends: {new Date(contest.endTime).toLocaleString()}
              </p>
              <a
                href={contest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Visit Contest
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
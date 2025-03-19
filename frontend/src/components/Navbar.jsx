import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userStore } from "../stores/userStore";

const Navbar = () => {
     const {user, checkAuth, logout} = userStore();
     const handleLogout = async () => {
        await logout();
      };
      return (
        <nav className="sticky bg-white shadow-lg fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300"
                >
                  Contest Tracker
                </Link>
              </div>
    
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-8 items-center">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/contests/past"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Past Contests
                </Link>
                {user && (
                  <Link
                    to="/bookmarks"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                  >
                    Bookmarks
                  </Link>
                )}
              </div>
    
              {/* Login/Signup or Logout */}
              <div className="flex items-center space-x-6">
                {user ? (
                  <>
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                    >
                      Login
                    </Link>
                    {/* Signup Button */}
                    <Link
                      to="/signup"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300 shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      );
}

export default Navbar
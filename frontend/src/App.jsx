import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { userStore } from "./stores/userStore";
import Navbar from "./components/Navbar";
import PastPage from "./pages/PastPage";
import BookmarkPage from "./pages/BookmarkPage";
import React, { useEffect } from 'react';
import useContestStore from "./stores/contestStore";
import { Toaster } from "react-hot-toast";


function App() {
  const {user, checkAuth} = userStore();
  const {fetchBookmark} = useContestStore();
  useEffect(() => {
    checkAuth();
    
  }, [checkAuth]);
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={user ? <Navigate to='/' /> : <SignUpPage />} />
        <Route path='/login' element={user ? <Navigate to='/' /> : <LoginPage />} />
        <Route path='/bookmarks' element={user ? <BookmarkPage/> : <LoginPage />} />
        <Route path='/contests/past' element={<PastPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App

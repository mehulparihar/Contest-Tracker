import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { userStore } from "./stores/userStore";
import Navbar from "./components/Navbar";

function App() {
  const {user, checkAuth} = userStore();
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={user ? <Navigate to='/' /> : <SignUpPage />} />
        <Route path='/login' element={user ? <Navigate to='/' /> : <LoginPage />} />
      </Routes>
    </div>
  )
}

export default App

import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from './pages/CreateQuiz';

function App() {
 

  return (
  <div className='App'>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/create-quiz" element={<CreateQuiz />} />

    </Routes>

  </div>
  )
}

export default App

import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from './pages/CreateQuiz';
import QuizDetail from './pages/QuizDetail';

function App() {
 

  return (
  <div className='App'>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/create-quiz" element={<CreateQuiz />} />
    <Route path="/quiz/:userId/:id" element={<QuizDetail />} /> 
    </Routes>

  </div>
  )
}

export default App

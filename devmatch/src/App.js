import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container">

      <div className="main-content">
        <Routes>
       
          <Route path="/chat" element={<ChatPage />} />
        
        </Routes>
      </div>
    </div>
  );
}

export default App;
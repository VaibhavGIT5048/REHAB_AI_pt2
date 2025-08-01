import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Exercise from './pages/Exercise';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Explore from './pages/Explore';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Header />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/exercise" element={<Exercise />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/explore" element={<Explore />} />
                    {/* <Route path="/media" element={<Media />} /> */}
                  </Routes>
                </main>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;

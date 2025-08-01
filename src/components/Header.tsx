import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Camera, BarChart3, User, Zap, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-teal-500 p-2 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">RehabAI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Feed</span>
            </Link>
            
            <Link
              to="/chat"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/chat') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Chat</span>
            </Link>

            <Link
              to="/exercise"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/exercise') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span className="font-medium">Exercise</span>
            </Link>

            <Link
              to="/progress"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/progress') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Progress</span>
            </Link>

            <Link
              to="/media"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/media') 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <Play className="h-5 w-5" />
              <span className="font-medium">Media</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            
            <Link
              to="/profile"
              className={`p-1 rounded-full transition-all duration-200 ${
                isActive('/profile') ? 'ring-2 ring-teal-500' : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <img
                src={user?.user_metadata?.avatar_url || "https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link to="/" className={`p-3 ${isActive('/') ? 'text-teal-600' : 'text-gray-600'}`}>
            <Home className="h-5 w-5" />
          </Link>
          <Link to="/chat" className={`p-3 ${isActive('/chat') ? 'text-teal-600' : 'text-gray-600'}`}>
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link to="/exercise" className={`p-3 ${isActive('/exercise') ? 'text-teal-600' : 'text-gray-600'}`}>
            <Camera className="h-5 w-5" />
          </Link>
          <Link to="/progress" className={`p-3 ${isActive('/progress') ? 'text-teal-600' : 'text-gray-600'}`}>
            <BarChart3 className="h-5 w-5" />
          </Link>
          <Link to="/media" className={`p-3 ${isActive('/media') ? 'text-teal-600' : 'text-gray-600'}`}>
            <Play className="h-5 w-5" />
          </Link>
          <Link to="/profile" className={`p-3 ${isActive('/profile') ? 'text-teal-600' : 'text-gray-600'}`}>
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
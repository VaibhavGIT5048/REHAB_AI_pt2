import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Filter, Search, Plus, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_title: string;
  author_avatar: string;
  author_verified: boolean;
  content: string;
  image_url: string | null;
  likes: number;
  comments: number;
  tags: string[];
  category: 'all' | 'my-doctor' | 'exercise-tips' | 'inspiration';
  created_at: string;
}

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'my-doctor' | 'exercise-tips' | 'inspiration'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadPosts();
    }
  }, [user, activeTab]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('category', activeTab);
      }

      // Filter by user's doctor for "my-doctor" tab
      if (activeTab === 'my-doctor' && userProfile?.preferred_doctor) {
        query = query.eq('author_id', userProfile.preferred_doctor);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);

    // Update post likes count
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
        : post
    ));

    // Update in database
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('posts')
          .update({ likes: post.likes + (isLiked ? -1 : 1) })
          .eq('id', postId);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    { key: 'all', label: 'All Posts', icon: TrendingUp },
    { key: 'my-doctor', label: 'My Doctor', icon: Users },
    { key: 'exercise-tips', label: 'Exercise Tips', icon: Award },
    { key: 'inspiration', label: 'Inspiration', icon: Heart }
  ];

  const stats = [
    { label: 'Following', value: '127' },
    { label: 'Followers', value: '89' },
    { label: 'Posts Liked', value: '234' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="text-center mb-4">
              <img
                src={userProfile?.avatar_url || "https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="font-bold text-gray-900">{userProfile?.name || 'User'}</h3>
              <p className="text-sm text-gray-600">{userProfile?.injury_type ? `${userProfile.injury_type} Recovery` : 'Recovery Journey'}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <Link
                to="/chat"
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-center block"
              >
                Message Doctor
              </Link>
              <Link
                to="/exercise"
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
              >
                Start Exercise
              </Link>
              <Link
                to="/explore"
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
              >
                Find Professionals
              </Link>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Feed</h1>
            <p className="text-gray-600">Stay updated with your recovery community</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, doctors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.key
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">
                  {activeTab === 'my-doctor' 
                    ? 'Your doctor hasn\'t posted anything yet. Check back later!'
                    : 'Try adjusting your search or check back later for new content.'
                  }
                </p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{post.author_name}</h4>
                            {post.author_verified && (
                              <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
                                Verified
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{post.author_title}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
                    
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            likedPosts.has(post.id)
                              ? 'text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                          <Share2 className="h-5 w-5" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                      
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
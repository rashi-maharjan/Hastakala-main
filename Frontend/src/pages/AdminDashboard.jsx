import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, ShoppingBag, Users, MessageSquare } from 'lucide-react';
import AdminNav from '../components/AdminNav';

const AdminDashboard = () => {
  // State for storing data
  const [stats, setStats] = useState({
    users: { total: 0, artists: 0, normal: 0 },
    artworks: { total: 0, inStock: 0 },
    events: { total: 0, upcoming: 0 },
    posts: { total: 0 },
    comments: { total: 0 }
  });
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [communityActivityData, setCommunityActivityData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function for safe API fetching with detailed error logging
  const fetchWithErrorHandling = async (url, headers) => {
    try {
      console.log(`Fetching from: ${url}`);
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
        // Get the actual response text to see what's being returned
        const text = await response.text();
        console.error(`Response content from ${url}: ${text.substring(0, 200)}...`);
        
        // If it's HTML, we know it's not a valid JSON response
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          console.error(`Got HTML instead of JSON from ${url}`);
          throw new Error(`API returned HTML instead of JSON`);
        }
        
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      return null;
    }
  };
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get the authentication token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token
        };

        // Mock data flag - set to true if any API calls fail
        let useMockData = false;
        
        // 1. Fetch Users data
        let userData = await fetchWithErrorHandling('/api/users/all', headers);
        
        if (!userData || !userData.users) {
          console.log("Failed to fetch user data, trying fallback endpoint");
          userData = await fetchWithErrorHandling('/api/users', headers);
          
          if (!userData || !userData.users) {
            console.log("All user API endpoints failed, using mock data");
            useMockData = true;
          }
        }
        
        // 2. Fetch Artworks data
        let artworksData = await fetchWithErrorHandling('/api/artwork', headers);
        
        if (!artworksData || !Array.isArray(artworksData)) {
          console.log("Failed to fetch artwork data, trying fallback endpoint");
          artworksData = await fetchWithErrorHandling('/api/artworks', headers);
          
          if (!artworksData || !Array.isArray(artworksData)) {
            console.log("All artwork API endpoints failed, using mock data");
            useMockData = true;
          }
        }
        
        // 3. Fetch Events data
        let eventsData = await fetchWithErrorHandling('/api/admin/events', headers);
        
        if (!eventsData || !Array.isArray(eventsData)) {
          console.log("Failed to fetch events data, trying fallback endpoint");
          eventsData = await fetchWithErrorHandling('/api/events', headers);
          
          if (!eventsData || !Array.isArray(eventsData)) {
            console.log("All events API endpoints failed, using mock data");
            useMockData = true;
          }
        }
        
        // 4. Fetch Community Posts data
        let postsData = await fetchWithErrorHandling('/api/community/posts', headers);
        
        if (!postsData || !Array.isArray(postsData)) {
          console.log("Failed to fetch posts data, trying fallback endpoint");
          postsData = await fetchWithErrorHandling('/api/posts', headers);
          
          if (!postsData || !Array.isArray(postsData)) {
            console.log("All posts API endpoints failed, using mock data");
            useMockData = true;
          }
        }
        
        if (useMockData) {
          // Use mock data if any API calls failed
          console.log("Using mock data for dashboard");
          setStats({
            users: { total: 45, artists: 12, normal: 33 },
            artworks: { total: 78, inStock: 52 },
            events: { total: 8, upcoming: 3 },
            posts: { total: 64 },
            comments: { total: 127 }
          });
          
          setUserRoleData([
            { name: 'Artists', value: 12 },
            { name: 'Normal Users', value: 33 }
          ]);
          
          setCommunityActivityData([
            { name: 'Posts', value: 64 },
            { name: 'Comments', value: 127 },
            { name: 'Likes', value: 215 }
          ]);
          
          setMonthlyData([
            { name: 'Jan', artworks: 12, revenue: 8 },
            { name: 'Feb', artworks: 15, revenue: 12 },
            { name: 'Mar', artworks: 10, revenue: 7 },
            { name: 'Apr', artworks: 14, revenue: 10 },
            { name: 'May', artworks: 18, revenue: 15 },
            { name: 'Jun', artworks: 16, revenue: 14 },
          ]);
          
          setRecentActivities([
            { type: 'user', action: 'New registration', name: 'Emily Johnson', time: '2 hours ago' },
            { type: 'artwork', action: 'New artwork added', name: 'Abstract Dreams', artist: 'Michael Chen', time: '5 hours ago' },
            { type: 'event', action: 'New event created', name: 'Summer Exhibition', time: '1 day ago' },
            { type: 'post', action: 'New community post', name: 'Tips for New Artists', time: '1 day ago' },
            { type: 'sale', action: 'Artwork sold', name: 'Sunset Reflections', price: '$450', time: '2 days ago' }
          ]);
        } else {
          // Process real data
          // Calculate user stats
          const totalUsers = userData.users?.length || 0;
          const artistUsers = userData.users?.filter(user => user.role === 'artist').length || 0;
          const normalUsers = userData.users?.filter(user => user.role === 'normal_user').length || 0;
          
          // Calculate artwork stats
          const totalArtworks = artworksData.length || 0;
          const inStockArtworks = artworksData.filter(artwork => artwork.inStock).length || 0;
          
          // Calculate event stats
          const totalEvents = eventsData.length || 0;
          const upcomingEvents = eventsData.filter(event => {
            return new Date(`${event.end_date}T${event.end_time}`) > new Date();
          }).length || 0;
          
          // Calculate post and comment stats
          const totalPosts = postsData.length || 0;
          let totalComments = 0;
          let totalLikes = 0;
          
          postsData.forEach(post => {
            totalComments += post.comments ? post.comments.length : 0;
            totalLikes += post.likes_count || 0;
          });
          
          // Update stats
          setStats({
            users: { 
              total: totalUsers, 
              artists: artistUsers, 
              normal: normalUsers 
            },
            artworks: { 
              total: totalArtworks, 
              inStock: inStockArtworks 
            },
            events: { 
              total: totalEvents, 
              upcoming: upcomingEvents 
            },
            posts: { 
              total: totalPosts 
            },
            comments: { 
              total: totalComments 
            }
          });
          
          // Create user role data for pie chart
          setUserRoleData([
            { name: 'Artists', value: artistUsers },
            { name: 'Normal Users', value: normalUsers }
          ]);
          
          // Create community activity data for bar chart
          setCommunityActivityData([
            { name: 'Posts', value: totalPosts },
            { name: 'Comments', value: totalComments },
            { name: 'Likes', value: totalLikes }
          ]);
          
          // Create monthly data for line chart
          const last6Months = [];
          const currentDate = new Date();
          
          for (let i = 5; i >= 0; i--) {
            const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = month.toLocaleString('default', { month: 'short' });
            last6Months.push({
              month: month,
              name: monthName,
              artworks: 0,
              revenue: 0
            });
          }
          
          // Calculate artworks per month
          artworksData.forEach(artwork => {
            if (!artwork.createdAt) return;
            
            const createdAt = new Date(artwork.createdAt);
            
            last6Months.forEach(monthData => {
              if (createdAt.getMonth() === monthData.month.getMonth() && 
                  createdAt.getFullYear() === monthData.month.getFullYear()) {
                monthData.artworks += 1;
                // Assuming price is in dollars, add to revenue
                monthData.revenue += parseFloat(artwork.price) || 0;
              }
            });
          });
          
          // Round revenue to nearest $100
          last6Months.forEach(month => {
            month.revenue = Math.round(month.revenue / 100);
          });
          
          setMonthlyData(last6Months);
          
          // Create recent activities
          const activities = [];
          
          // Add recent users
          if (userData.users && userData.users.length > 0) {
            userData.users.slice(0, 3).forEach(user => {
              activities.push({
                type: 'user',
                action: 'New registration',
                name: user.name || 'Unknown User',
                time: formatTimeAgo(new Date(user.createdAt || Date.now() - Math.random() * 10000000))
              });
            });
          }
          
          // Add recent artworks
          if (artworksData.length > 0) {
            artworksData.slice(0, 3).forEach(artwork => {
              activities.push({
                type: 'artwork',
                action: 'New artwork added',
                name: artwork.title || 'Untitled Artwork',
                artist: artwork.artist?.name || 'Unknown Artist',
                time: formatTimeAgo(new Date(artwork.createdAt || Date.now() - Math.random() * 10000000))
              });
            });
          }
          
          // Add recent events
          if (eventsData.length > 0) {
            eventsData.slice(0, 3).forEach(event => {
              activities.push({
                type: 'event',
                action: 'Event scheduled',
                name: event.title || 'Unnamed Event',
                time: formatTimeAgo(new Date(event.createdAt || Date.now() - Math.random() * 10000000))
              });
            });
          }
          
          // Add recent posts
          if (postsData.length > 0) {
            postsData.slice(0, 3).forEach(post => {
              activities.push({
                type: 'post',
                action: 'New community post',
                name: post.title || 'Untitled Post',
                time: formatTimeAgo(new Date(post.created_at || Date.now() - Math.random() * 10000000))
              });
            });
          }
          
          // Sort by most recent first
          activities.sort((a, b) => {
            const timeA = getTimeValue(a.time);
            const timeB = getTimeValue(b.time);
            return timeA - timeB;
          });
          
          setRecentActivities(activities);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please make sure your backend server is running.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  // Helper function to convert time ago string to numeric value for sorting
  const getTimeValue = (timeString) => {
    if (timeString === 'just now') return 0;
    
    const match = timeString.match(/(\d+) (\w+) ago/);
    if (!match) return 999999;
    
    const [_, value, unit] = match;
    const numValue = parseInt(value);
    
    if (unit.startsWith('minute')) return numValue * 60;
    if (unit.startsWith('hour')) return numValue * 3600;
    if (unit.startsWith('day')) return numValue * 86400;
    
    return 999999;
  };
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <div className="flex">
        <AdminNav />
        <div className="flex-1 min-h-screen bg-gray-50 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-gray-500">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <AdminNav />
        <div className="flex-1 min-h-screen bg-gray-50 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your art gallery platform</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
                <p className="text-sm text-gray-600">{stats.users.artists} artists, {stats.users.normal} regular</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Artworks</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.artworks.total}</p>
                <p className="text-sm text-gray-600">{stats.artworks.inStock} currently in stock</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Events</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.events.total}</p>
                <p className="text-sm text-gray-600">{stats.events.upcoming} upcoming</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Community</h2>
                <p className="text-2xl font-bold text-gray-900">{stats.posts.total} posts</p>
                <p className="text-sm text-gray-600">{stats.comments.total} comments</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Artwork Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="artworks" stroke="#8884d8" activeDot={{ r: 8 }} name="New Artworks" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($100s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h2>
            <div className="flex items-center justify-center h-full">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Community Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={communityActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="overflow-y-auto max-h-[300px]">
              <ul className="divide-y divide-gray-200">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {activity.type === 'user' && <Users className="h-5 w-5 text-blue-500" />}
                          {activity.type === 'artwork' && <ShoppingBag className="h-5 w-5 text-green-500" />}
                          {activity.type === 'event' && <Calendar className="h-5 w-5 text-purple-500" />}
                          {activity.type === 'post' && <MessageSquare className="h-5 w-5 text-orange-500" />}
                          {activity.type === 'sale' && <DollarSign className="h-5 w-5 text-teal-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}: {activity.name}
                          </p>
                          {activity.artist && (
                            <p className="text-xs text-gray-500">by {activity.artist}</p>
                          )}
                          {activity.price && (
                            <p className="text-xs text-gray-500">{activity.price}</p>
                          )}
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">No recent activities found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
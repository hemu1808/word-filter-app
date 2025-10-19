import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Clock,
  Target,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Globe,
  Heart,
  Eye,
  MessageSquare,
  Share2,
  Download,
  Settings,
  Bell,
  Search,
  Filter,
  SortAsc,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  Bookmark,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  ExternalLink,
  Copy,
  Save,
  Upload,
  Image,
  FileText,
  Video,
  Music,
  Camera,
  Mic,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Database,
  Cloud,
  Wifi,
  Bluetooth,
  Battery,
  WifiOff,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh
} from 'lucide-react';

interface DashboardProps {
  wordStats: any;
  onNavigate: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ wordStats, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: '🎉 Great job! You learned 5 new words today!', time: '2 min ago' },
    { id: 2, type: 'info', message: '🌟 New fun words are available to explore!', time: '1 hour ago' },
    { id: 3, type: 'warning', message: '💡 Keep learning! You\'re doing amazing!', time: '3 hours ago' }
  ]);

  const tabs = [
    { id: 'overview', label: '🏠 Home', icon: Home },
    { id: 'analytics', label: '📊 Progress', icon: BarChart3 },
    { id: 'words', label: '📚 My Words', icon: BookOpen },
    { id: 'users', label: '👥 Friends', icon: Users },
    { id: 'settings', label: '⚙️ Settings', icon: Settings }
  ];

  const quickStats = [
    { label: 'Total Words', value: wordStats?.total_words || 0, icon: BookOpen, color: 'text-blue-600', change: '+12%' },
    { label: 'Fun Words', value: '2,456', icon: Star, color: 'text-yellow-600', change: '+8%' },
    { label: 'New Words', value: '89', icon: Star, color: 'text-purple-600', change: '+15%' },
    { label: 'Learning Level', value: 'Expert', icon: Award, color: 'text-green-600', change: '+5%' }
  ];

  const recentActivity = [
    { action: 'Learned new word', word: 'serendipity', user: 'Alex', time: '2 min ago', icon: Plus },
    { action: 'Discovered word', word: 'ephemeral', user: 'Sam', time: '5 min ago', icon: Edit },
    { action: 'Explored word', word: 'luminous', user: 'Maya', time: '8 min ago', icon: Search },
    { action: 'Shared word', word: 'sparkle', user: 'Jake', time: '12 min ago', icon: Share2 },
    { action: 'New friend joined', word: 'Welcome!', user: 'Emma', time: '15 min ago', icon: User }
  ];

  const trendingWords = [
    { word: 'serendipity', searches: 156, trend: 'up', change: '+23%' },
    { word: 'ephemeral', searches: 134, trend: 'up', change: '+18%' },
    { word: 'luminous', searches: 98, trend: 'down', change: '-5%' },
    { word: 'resilience', searches: 87, trend: 'up', change: '+12%' },
    { word: 'harmony', searches: 76, trend: 'up', change: '+8%' }
  ];

  const wordOfTheDay = {
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    pronunciation: '/ˌserənˈdipədē/',
    example: 'A fortunate stroke of serendipity brought the old friends together.',
    etymology: 'From Persian "serendip" (Sri Lanka) + English suffix',
    synonyms: ['chance', 'fortune', 'luck', 'coincidence']
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-4 space-y-4"
    >
      {/* Header with Tabs */}
      <motion.div variants={itemVariants} className="dashboard-widget">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">🌟 Word Adventure Hub 🌟</h1>
            <p className="text-gray-600">Explore, learn, and have fun with words! 🎉</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} className="responsive-grid-sm">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="dashboard-widget"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word of the Day */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="dashboard-widget">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">🌟 Today's Amazing Word! 🌟</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                >
                  {wordOfTheDay.word[0]}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{wordOfTheDay.word}</h3>
                  <p className="text-gray-600">{wordOfTheDay.pronunciation}</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{wordOfTheDay.definition}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Example:</p>
                <p className="text-gray-800 italic">"{wordOfTheDay.example}"</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {wordOfTheDay.synonyms.map((synonym, index) => (
                  <motion.span
                    key={synonym}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {synonym}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trending Words */}
        <motion.div variants={itemVariants}>
          <div className="dashboard-widget">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">🔥 Popular Words! 🔥</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {trendingWords.map((item, index) => (
                <motion.div
                  key={item.word}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.word}</p>
                      <p className="text-sm text-gray-600">{item.searches} searches</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </span>
                    {item.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="dashboard-widget">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">🎯 What's Happening! 🎯</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <Activity className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 bg-white rounded-full shadow-sm">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                  {activity.word !== 'Welcome!' && (
                    <span className="font-medium text-blue-600"> "{activity.word}"</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants} className="dashboard-widget">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">🔔 Good News! 🔔</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`notification ${notification.type}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="dashboard-widget">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🎮 Fun Actions! 🎮</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '➕ Add Word', icon: Plus, color: 'bg-blue-500' },
            { label: '🔍 Search', icon: Search, color: 'bg-green-500' },
            { label: '📥 Save', icon: Download, color: 'bg-purple-500' },
            { label: '⚙️ Settings', icon: Settings, color: 'bg-orange-500' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-3 rounded-full ${action.color} text-white`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

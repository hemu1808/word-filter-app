import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Menu, Search, Sparkles, TrendingUp, Award, ChevronRight, 
  CheckCircle, ArrowRight, Zap, BookOpen, Target, Puzzle 
} from 'lucide-react';
import { wordService } from './services/WordService';
import type { SearchResult, WordStats } from './types/WordTypes';
import WordSearch from './components/WordSearch';
import AdvancedSearch from './components/AdvancedSearch';
import BrowseWords from './components/BrowseWords';
import PuzzleSolver from './components/PuzzleSolver';
import WordResults from './components/WordResults';

const App: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced' | 'puzzle' | 'browse' | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [wordStats, setWordStats] = useState<WordStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    fetchWordStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchWordStats = async () => {
    setIsLoadingStats(true);
    try {
      const stats = await wordService.getWordStats();
      setWordStats(stats);
    } catch (err) {
      console.error('Failed to fetch word stats:', err);
      setError('Failed to load word statistics.');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSearch = async (query: string, filters?: any) => {
    setIsSearching(true);
    setError(null);
    try {
      let result: SearchResult;
      
      if (searchMode === 'basic') {
        result = await wordService.searchBasicWord(query);
      } else if (searchMode === 'advanced') {
        const filteredWords = await wordService.getFilteredWords(filters);
        result = { 
          query, 
          found: filteredWords.length > 0, 
          word: filteredWords[0] || null,
          filteredWords 
        };
      } else if (searchMode === 'browse') {
        const wordsByLength = await wordService.getWordsByLength(parseInt(query));
        result = {
          query,
          found: wordsByLength.words.length > 0,
          word: wordsByLength.words[0] || null,
          filteredWords: wordsByLength.words
        };
      } else {
        const interactiveWords = await wordService.getInteractiveWords(parseInt(query), filters?.pattern || '');
        result = {
          query,
          found: interactiveWords.length > 0,
          word: interactiveWords[0] || null,
          filteredWords: interactiveWords
        };
      }
      
      setSearchResult(result);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.detail || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddWord = async (word: string) => {
    try {
      const response = await wordService.addWordWithValidation(word);
      if (response.success) {
        // Success feedback handled in WordResults component
        fetchWordStats();
      }
      return response;
    } catch (err: any) {
      console.error('Failed to add word:', err);
      throw err;
    }
  };

  const handleExploreWord = (word: string) => {
    console.log('Exploring word:', word);
    handleSearch(word);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      emoji: '🔍',
      title: 'Smart Search',
      description: 'AI-powered search with intelligent suggestions and real-time validation.',
      action: () => setSearchMode('basic'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Target className="w-8 h-8" />,
      emoji: '🎯',
      title: 'Advanced Filters',
      description: 'Filter words by length, pattern, and advanced criteria for precise results.',
      action: () => setSearchMode('advanced'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      emoji: '📚',
      title: 'Browse by Length',
      description: 'Explore words organized by length for systematic vocabulary building.',
      action: () => setSearchMode('browse'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Puzzle className="w-8 h-8" />,
      emoji: '🧩',
      title: 'Word Puzzles',
      description: 'Solve interactive puzzles and games to enhance your word skills.',
      action: () => setSearchMode('puzzle'),
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Modern Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`nav-modern ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => scrollToSection('home')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Word Explorer
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all"
                >
                  {item}
                </motion.button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchMode('basic')}
                className="btn-modern"
              >
                <Zap className="w-4 h-4" />
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    {item}
                  </motion.button>
                ))}
                <div className="pt-4 border-t border-gray-200 flex items-center space-x-3">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                  <button
                    onClick={() => {
                      setSearchMode('basic');
                      setIsMenuOpen(false);
                    }}
                    className="btn-modern flex-1"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="modern-hero pt-20">
        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">AI-Powered Word Discovery</span>
              <Award className="w-4 h-4 text-yellow-300" />
            </motion.div>

            {/* AI Agent Illustration */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
              className="ai-agent mb-8"
            >
              <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl"
                >
                  🤖
                </motion.div>
              </div>
            </motion.div>

            <h1 className="hero-title">
              Discover Words with
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400"
              >
                AI-Powered Intelligence
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="hero-subtitle text-center mx-auto"
            >
              Explore over <span className="font-bold text-yellow-300">{isLoadingStats ? '...' : wordStats?.total_words?.toLocaleString() || '400,000+'}</span> words with our advanced AI-powered search engine. 
              Find the perfect word for any occasion with intelligent suggestions and real-time validation.
            </motion.p>

            {/* Stats Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="stats-container mb-12"
            >
              {isLoadingStats ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="skeleton skeleton-title mx-auto mb-2"></div>
                      <div className="skeleton skeleton-text w-20 mx-auto"></div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="text-center"
                  >
                    <div className="stat-value">{wordStats?.total_words?.toLocaleString() || '416K'}</div>
                    <div className="stat-label">Total Words</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring" }}
                    className="text-center"
                  >
                    <div className="stat-value">{wordStats?.avg_length?.toFixed(1) || '9.2'}</div>
                    <div className="stat-label">Avg Length</div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: "spring" }}
                    className="text-center"
                  >
                    <div className="stat-value">{wordStats?.max_length || '20'}</div>
                    <div className="stat-label">Max Length</div>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                onClick={() => setSearchMode('basic')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-modern text-lg px-8 py-4 flex items-center space-x-2 shadow-2xl"
              >
                <Search className="w-5 h-5" />
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('features')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold backdrop-blur-sm"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['📚', '✨', '🎯', '💡', '🚀', '⭐'].map((emoji, index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [0, -30, 0],
                x: [0, Math.sin(index) * 20, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 8 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
              className="absolute text-4xl"
              style={{
                top: `${20 + index * 15}%`,
                left: `${10 + index * 15}%`,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #635BFF 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 mb-6"
            >
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-semibold">Powerful Features</span>
            </motion.div>
            <h2 className="section-title text-gray-900 mb-6">
              Everything You Need for Word Discovery
            </h2>
            <p className="section-subtitle">
              Our AI-powered platform offers advanced tools to help you find, explore, and understand words like never before.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={feature.action}
                whileHover={{ y: -8 }}
                className="feature-card flex-1 min-w-0 max-w-xs group cursor-pointer"
              >
                <div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="feature-card-icon mb-4"
                  >
                    {feature.emoji}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  <span>Try it now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-2 mb-6"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 text-sm font-semibold">Simple Pricing</span>
            </motion.div>
            <h2 className="section-title text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="section-subtitle">
              Start free and upgrade as you grow. All plans include our core word discovery features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                features: [
                  'Basic word search',
                  'Up to 100 searches/day',
                  'Community support',
                  'Basic word definitions',
                  'Mobile app access'
                ],
                cta: 'Get Started',
                featured: false
              },
              {
                name: 'Pro',
                price: '$9',
                period: 'month',
                features: [
                  'Advanced search filters',
                  'Unlimited searches',
                  'Priority support',
                  'Word analytics',
                  'Export capabilities',
                  'API access',
                  'Custom collections'
                ],
                cta: 'Start Pro Trial',
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'contact us',
                features: [
                  'Everything in Pro',
                  'Custom integrations',
                  'Dedicated support',
                  'Advanced analytics',
                  'White-label options',
                  'SLA guarantee',
                  'Training & onboarding'
                ],
                cta: 'Contact Sales',
                featured: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: plan.featured ? 'white' : 'inherit' }}>
                    {plan.name}
                  </h3>
                  <div className="text-5xl font-bold mb-2" style={{ color: plan.featured ? 'white' : 'inherit' }}>
                    {plan.price}
                    {plan.price !== 'Custom' && plan.price !== 'Free' && (
                      <span className="text-lg font-normal opacity-70">/{plan.period}</span>
                    )}
                  </div>
                  {plan.price === 'Custom' && (
                    <div className="text-lg opacity-70">{plan.period}</div>
                  )}
                  {plan.price === 'Free' && (
                    <div className="text-lg opacity-70">{plan.period}</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <CheckCircle 
                        className="w-5 h-5 mr-3 flex-shrink-0" 
                        style={{ color: plan.featured ? '#00E599' : '#10B981' }}
                      />
                      <span style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={plan.featured ? 'btn-modern w-full bg-white text-blue-600 hover:bg-gray-50' : 'btn-modern w-full'}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-title text-gray-900 mb-6">
              About Word Explorer
            </h2>
            <p className="section-subtitle">
              We're passionate about making word discovery accessible, intelligent, and enjoyable for everyone.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Word Explorer was born from the belief that language is the foundation of human communication. 
                Our AI-powered platform helps users discover, understand, and master words through intelligent 
                search, advanced filtering, and interactive learning experiences.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                With over 400,000 words in our database and advanced AI algorithms, we're making vocabulary 
                building accessible to students, writers, professionals, and word enthusiasts worldwide.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-elevated text-center p-6"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">400K+</div>
                  <div className="text-gray-600 font-medium">Words Available</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-elevated text-center p-6"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600 font-medium">Uptime</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="glass-card-modern p-12 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl mb-6"
                >
                  🚀
                </motion.div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Innovation First</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We continuously innovate to provide the best word discovery experience, 
                  leveraging cutting-edge AI and user feedback to improve our platform.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="section-title text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="section-subtitle">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="contact-form">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-input"
                />
              </div>
              <div className="mb-6">
                <select className="form-input">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Business Partnership</option>
                  <option>Feature Request</option>
                </select>
              </div>
              <div className="mb-6">
                <textarea
                  placeholder="Your Message"
                  rows={6}
                  className="form-input resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-modern w-full text-lg"
              >
                Send Message
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Word Explorer</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Discover words with AI-powered intelligence. 
                The future of vocabulary building is here.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Word Explorer. All rights reserved. Built with ❤️ and AI.</p>
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      <AnimatePresence mode="wait">
        {searchMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={() => setSearchMode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card-modern p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900">
                  {searchMode === 'basic' && '🔍 Basic Word Search'}
                  {searchMode === 'advanced' && '🎯 Advanced Search'}
                  {searchMode === 'browse' && '📚 Browse Words by Length'}
                  {searchMode === 'puzzle' && '🧩 Word Puzzles'}
                </h3>
                <motion.button
                  onClick={() => setSearchMode(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              {searchMode === 'basic' && (
                <WordSearch onSearch={handleSearch} isSearching={isSearching} />
              )}
              {searchMode === 'advanced' && (
                <AdvancedSearch onSearch={handleSearch} isSearching={isSearching} />
              )}
              {searchMode === 'browse' && (
                <BrowseWords onSearch={handleSearch} isSearching={isSearching} />
              )}
              {searchMode === 'puzzle' && (
                <PuzzleSolver onSearch={handleSearch} isSearching={isSearching} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Modal */}
      <AnimatePresence mode="wait">
        {searchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] p-4"
            onClick={() => setSearchResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card-modern p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSearchResult(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>
              <WordResults
                result={searchResult}
                onAddWord={handleAddWord}
                onExploreWord={handleExploreWord}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-[400] max-w-md"
          >
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5" />
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1 hover:bg-red-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-2xl z-50 hover:bg-blue-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6 transform -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

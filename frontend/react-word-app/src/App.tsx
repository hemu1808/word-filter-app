import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Search, Zap, Users, Award, ChevronRight, Star, CheckCircle, ArrowRight } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchWordStats = async () => {
    try {
      const stats = await wordService.getWordStats();
      setWordStats(stats);
    } catch (err) {
      console.error('Failed to fetch word stats:', err);
      setError('Failed to load word statistics.');
    }
  };

  const handleSearch = async (query: string, filters?: any) => {
    setIsSearching(true);
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
        alert(`Word "${word}" ${response.was_new ? 'added' : 'already exists'}!`);
        fetchWordStats();
      } else {
        alert(`Failed to add word: ${response.message}`);
      }
      return response;
    } catch (err: any) {
      console.error('Failed to add word:', err);
      alert(`Error adding word: ${err.response?.data?.detail || 'An unexpected error occurred.'}`);
      throw err;
    }
  };

  const handleExploreWord = (word: string) => {
    console.log('Exploring word:', word);
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="nav-modern fixed top-0 left-0 right-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-modern">
                Word<span className="text-blue-500">★</span>Explorer
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className="btn-modern">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                <button
                  onClick={() => scrollToSection('home')}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Contact
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <button className="btn-modern w-full">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="modern-hero min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* AI Agent Illustration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="ai-agent mb-8"
            >
              <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-6xl">🤖</div>
              </div>
            </motion.div>

            <h1 className="hero-title text-white mb-6">
              Discover Words with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                AI-Powered Intelligence
              </span>
            </h1>
            
            <p className="hero-subtitle text-center mx-auto mb-8">
              Explore over <span className="font-bold text-yellow-300">{wordStats?.total_words?.toLocaleString() || '400,000+'}</span> words with our advanced AI-powered search engine. 
              Find the perfect word for any occasion with intelligent suggestions and real-time validation.
            </p>

            {/* Stats Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center items-center space-x-8 mb-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{wordStats?.total_words?.toLocaleString() || '416K'}</div>
                <div className="text-blue-200">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{wordStats?.avg_length?.toFixed(1) || '9.2'}</div>
                <div className="text-blue-200">Avg Length</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{wordStats?.max_length || '20'}</div>
                <div className="text-blue-200">Max Length</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => setSearchMode('basic')}
                className="btn-modern text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-4xl opacity-20"
          >
            📚
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 text-4xl opacity-20"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-20 text-4xl opacity-20"
          >
            🎯
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-gray-900 mb-4">
              Powerful Features for Word Discovery
            </h2>
            <p className="section-subtitle">
              Our AI-powered platform offers advanced tools to help you find, explore, and understand words like never before.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 max-w-6xl mx-auto">
            {[
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'AI-powered search with intelligent suggestions and real-time validation.',
                action: () => setSearchMode('basic')
              },
              {
                icon: '🎯',
                title: 'Advanced Filters',
                description: 'Filter words by length, pattern, and advanced criteria for precise results.',
                action: () => setSearchMode('advanced')
              },
              {
                icon: '📚',
                title: 'Browse by Length',
                description: 'Explore words organized by length for systematic vocabulary building.',
                action: () => setSearchMode('browse')
              },
              {
                icon: '🧩',
                title: 'Word Puzzles',
                description: 'Solve interactive puzzles and games to enhance your word skills.',
                action: () => setSearchMode('puzzle')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={feature.action}
                className="feature-card cursor-pointer flex-1 min-w-0 max-w-xs"
              >
                <div className="text-3xl mb-3 text-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center mb-3">{feature.description}</p>
                <div className="flex items-center justify-center text-blue-600 font-medium text-sm">
                  <span>Try it now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="section-subtitle">
              Choose the plan that fits your needs. All plans include our core word discovery features.
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
                  'Basic word definitions'
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
                  'API access'
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
                  'SLA guarantee'
                ],
                cta: 'Contact Sales',
                featured: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {plan.price}
                    {plan.price !== 'Custom' && <span className="text-lg text-gray-500">/{plan.period}</span>}
                  </div>
                  {plan.price === 'Custom' && (
                    <div className="text-lg text-gray-500">{plan.period}</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full btn-modern">
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-gray-900 mb-4">
              About Word Explorer
            </h2>
            <p className="section-subtitle">
              We're passionate about making word discovery accessible, intelligent, and enjoyable for everyone.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Word Explorer was born from the belief that language is the foundation of human communication. 
                Our AI-powered platform helps users discover, understand, and master words through intelligent 
                search, advanced filtering, and interactive learning experiences.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With over 400,000 words in our database and advanced AI algorithms, we're making vocabulary 
                building accessible to students, writers, professionals, and word enthusiasts worldwide.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">400K+</div>
                  <div className="text-gray-600">Words Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card-modern p-8">
                <div className="text-6xl mb-4 text-center">🚀</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">Innovation First</h4>
                <p className="text-gray-600 text-center">
                  We continuously innovate to provide the best word discovery experience, 
                  leveraging cutting-edge AI and user feedback to improve our platform.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="section-subtitle">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
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
                <select className="form-input w-full">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Business Partnership</option>
                  <option>Feature Request</option>
                </select>
              </div>
              <div className="mb-6">
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="form-input w-full resize-none"
                />
              </div>
              <button className="btn-modern w-full">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Word Explorer</span>
              </div>
              <p className="text-gray-400">
                Discover words with AI-powered intelligence. 
                The future of vocabulary building is here.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Word Explorer. All rights reserved.</p>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card-modern p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {searchMode === 'basic' && 'Basic Word Search'}
                  {searchMode === 'advanced' && 'Advanced Search'}
                  {searchMode === 'browse' && 'Browse Words by Length'}
                  {searchMode === 'puzzle' && 'Word Puzzles'}
                </h3>
                <button
                  onClick={() => setSearchMode(null)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card-modern p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <WordResults
                result={searchResult}
                onAddWord={handleAddWord}
                onExploreWord={handleExploreWord}
              />
              <button
                onClick={() => setSearchResult(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50"
          >
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
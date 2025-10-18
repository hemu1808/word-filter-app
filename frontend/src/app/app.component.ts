import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate, query, stagger, animateChild, group } from '@angular/animations';
import { WordService, BasicSearchResult, AddWordResponse } from './services/word.service';
import { WordFilter, WordStats } from './models/word.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.02)' })),
      transition('default <=> hovered', animate('200ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Word Explorer';
  
  // Basic search properties
  searchWord = '';
  searchResult: BasicSearchResult | null = null;
  isSearching = false;
  searchError = '';

  // Word stats and UI
  wordStats: WordStats | null = null;
  performanceStats: any = null;
  performanceStatsVisible = false;

  // Kid-friendly quick suggestions
  quickSuggestions = [
    'butterfly', 'rainbow', 'adventure', 'magic', 'dinosaur', 
    'unicorn', 'treasure', 'mystery', 'friendship', 'courage'
  ];

  // Advanced filter properties (kept for compatibility)
  filterForm: FormGroup;
  words: string[] = [];
  loading = false;
  error = '';

  // Interactive tab properties (kept for compatibility)
  interactiveWordLength: number | null = null;
  letterBoxes: string[] = [];
  interactiveWords: string[] = [];
  interactiveLoading = false;
  interactiveError = '';
  
  // Puzzle solver properties (kept for compatibility)
  puzzleLength: number = 5;
  puzzlePattern: string = '';

  // Browse by length properties
  browseLength: number = 5;
  browseWords: string[] = [];
  browseLoading = false;
  browseError = '';

  // Theme properties
  isDarkMode = false;

  // Legacy properties (kept for compatibility)
  searchMode: 'basic' | 'advanced' | 'puzzle' | 'browse' = 'basic';
  statsPanelExpanded = false;
  searchToggleExpanded = false;
  puzzleToggleExpanded = false;
  puzzlePanelExpanded = false;
  hoveredCard: string | null = null;
  tickerItems: string[] = [];
  currentTickerIndex = 0;

  constructor(
    private fb: FormBuilder,
    private wordService: WordService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      contains: [''],
      starts_with: [''],
      ends_with: [''],
      min_length: [''],
      max_length: [''],
      exact_length: [''],
      limit: [100]
    });
  }

  ngOnInit() {
    this.loadWordStats();
    this.searchWords(); // Load initial words
    this.startTicker();
  }

  // New kid-friendly methods
  setSearchMode(mode: 'basic' | 'advanced' | 'puzzle' | 'browse') {
    this.searchMode = mode;
    this.showNotification(`Switched to ${mode} mode`, 'info');
  }

  onSearchInput() {
    // Clear previous results when typing
    if (this.searchResult) {
      this.searchResult = null;
    }
    if (this.searchError) {
      this.searchError = '';
    }
  }

  loadWordStats() {
    console.log('Loading word stats...'); // Debug
    this.wordService.getWordStats().subscribe({
      next: (stats) => {
        console.log('Word stats loaded:', stats); // Debug
        this.wordStats = stats;
        this.updateTickerItems();
      },
      error: (error) => {
        console.error('Error loading word stats:', error);
        this.error = 'Failed to load word statistics';
        this.showNotification('Failed to load word statistics', 'error');
      }
    });
  }

  updateTickerItems() {
    if (this.wordStats) {
      this.tickerItems = [
        `📚 ${this.wordStats.total_words.toLocaleString()} Total Words`,
        `📏 Length Range: ${this.wordStats.min_length}-${this.wordStats.max_length} letters`,
        `📊 Average Length: ${this.wordStats.avg_length} letters`,
        `🎯 Database Status: Active`,
        `✨ Oxford Dictionary: Integrated`,
        `🔍 Search Modes: Basic & Advanced & Puzzle`,
        `🧩 Puzzle Solver: Available`,
        `💡 Live Updates: Enabled`,
        `⚡ Real-time Search`,
        `🌟 Material Design UI`
      ];
    }
  }

  startTicker() {
    // Ticker now uses CSS animation, no interval needed
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  searchWords() {
    this.loading = true;
    this.error = '';
    
    const filterValues = this.filterForm.value;
    const filter: WordFilter = {};

    // Only add non-empty values to the filter
    Object.keys(filterValues).forEach(key => {
      const value = filterValues[key];
      if (value !== null && value !== '' && value !== undefined) {
        filter[key as keyof WordFilter] = value;
      }
    });

    this.wordService.getFilteredWords(filter).subscribe({
      next: (words) => {
        this.words = words;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching words:', error);
        this.error = 'Failed to search words. Make sure the backend is running.';
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.patchValue({ limit: 100 });
    this.searchWords();
  }

  onFilterChange() {
    // Auto-search when filters change
    this.searchWords();
  }


  // Interactive tab methods
  onWordLengthChange() {
    if (this.interactiveWordLength && this.interactiveWordLength > 0) {
      this.letterBoxes = new Array(this.interactiveWordLength).fill('');
      this.interactiveWords = [];
      this.interactiveError = '';
    } else {
      this.letterBoxes = [];
    }
  }

  // Puzzle solver methods
  onPuzzleLengthChange() {
    if (this.puzzleLength && this.puzzleLength > 0) {
      this.letterBoxes = new Array(this.puzzleLength).fill('');
      this.interactiveWords = [];
      this.interactiveError = '';
    } else {
      this.letterBoxes = [];
    }
  }

  onPuzzlePatternChange() {
    // Update letter boxes based on pattern
    if (this.puzzlePattern && this.puzzleLength) {
      this.letterBoxes = this.puzzlePattern.split('').slice(0, this.puzzleLength);
      // Pad with empty strings if pattern is shorter than length
      while (this.letterBoxes.length < this.puzzleLength) {
        this.letterBoxes.push('');
      }
    }
  }

  getPatternPlaceholder(): string {
    if (this.puzzleLength && this.puzzleLength > 0) {
      return '?'.repeat(this.puzzleLength);
    }
    return '?????';
  }


  updateLetter(index: number, event: any) {
    const inputValue = event.target.value;
    
    // Clean the input: only letters, single character, lowercase for backend
    let cleanValue = inputValue.replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    // Ensure only one character
    if (cleanValue.length > 1) {
      cleanValue = cleanValue.charAt(0);
    }
    
    // Update the specific index in the array
    this.letterBoxes[index] = cleanValue;
    
    // Force the input to show the correct value immediately
    event.target.value = cleanValue.toUpperCase();
  }

  findMatchingWords() {
    // Use puzzleLength for puzzle solver
    const wordLength = this.puzzleLength || this.interactiveWordLength;
    
    if (!wordLength || this.letterBoxes.length === 0) {
      this.interactiveError = 'Please enter a word length first.';
      this.showNotification('Please enter a word length first.', 'error');
      return;
    }

    this.interactiveLoading = true;
    this.interactiveError = '';

    // Create pattern for the interactive search
    const pattern = this.letterBoxes.map(letter => letter || '?').join('');
    
    this.wordService.getInteractiveWords(wordLength, pattern).subscribe({
      next: (words) => {
        this.interactiveWords = words;
        this.interactiveLoading = false;
        if (words.length === 0) {
          this.interactiveError = 'No words found matching your pattern.';
          this.showNotification('No words found matching your pattern.', 'info');
        } else {
          this.showNotification(`Found ${words.length} matching word${words.length === 1 ? '' : 's'}!`, 'success');
        }
      },
      error: (error) => {
        console.error('Error finding interactive words:', error);
        this.interactiveError = 'Failed to find words. Make sure the backend is running.';
        this.interactiveLoading = false;
        this.showNotification('Failed to find words. Check backend connection.', 'error');
      }
    });
  }

  clearInteractive() {
    this.interactiveWordLength = null;
    this.puzzleLength = 5;
    this.puzzlePattern = '';
    this.letterBoxes = [];
    this.interactiveWords = [];
    this.interactiveError = '';
    this.interactiveLoading = false;
    this.showNotification('Puzzle solver cleared', 'info');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  // New tracking method for words
  trackByWord(index: number, word: string): string {
    return word;
  }

  getCurrentPattern(): string {
    return this.letterBoxes.map(l => l || '?').join('').toUpperCase();
  }

  // Highlight position functionality for better UX
  highlightPosition(index: number) {
    // Add visual highlighting logic if needed
    console.log(`Highlighting position ${index + 1}`);
  }

  unhighlightPosition(index: number) {
    // Remove visual highlighting logic if needed
    console.log(`Unhighlighting position ${index + 1}`);
  }

  // Random example functionality
  randomizePattern() {
    if (!this.puzzleLength || this.puzzleLength <= 0) {
      this.puzzleLength = 5;
    }

    // Generate a random pattern with some known letters
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const pattern = Array.from({ length: this.puzzleLength }, (_, i) => {
      // 30% chance of having a known letter, 70% chance of being unknown
      return Math.random() < 0.3 ? letters[Math.floor(Math.random() * letters.length)] : '?';
    }).join('');

    this.puzzlePattern = pattern;
    this.onPuzzlePatternChange();
    this.interactiveError = '';
    this.showNotification('Random pattern generated!', 'info');
  }

  copyWordToClipboard(word: string) {
    navigator.clipboard.writeText(word).then(() => {
      console.log('Word copied to clipboard:', word);
      this.showNotification(`"${word}" copied to clipboard!`, 'success');
    }).catch(() => {
      console.error('Failed to copy word to clipboard');
      this.showNotification('Failed to copy to clipboard', 'error');
    });
  }

  exploreWord(word: string) {
    // Switch to basic search mode and search for the word
    this.searchMode = 'basic';
    this.searchWord = word;
    this.searchWordBasic();
    this.showNotification(`Searching for "${word}"...`, 'info');
    
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  playPronunciation(audioUrl: string) {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => {
        console.error('Error playing pronunciation:', error);
      });
    }
  }

  // Stats panel methods - now hover-based
  toggleStatsPanel() {
    this.statsPanelExpanded = !this.statsPanelExpanded;
  }

  expandStatsPanel() {
    this.statsPanelExpanded = true;
    // Reload stats when panel opens
    this.loadWordStats();
  }

  collapseStatsPanel() {
    this.statsPanelExpanded = false;
  }

  // Basic search methods

  searchWordBasic() {
    if (!this.searchWord || this.searchWord.trim() === '') {
      return;
    }

    this.isSearching = true;
    this.searchError = '';
    this.searchResult = null;

    this.wordService.searchBasicWord(this.searchWord.trim()).subscribe({
      next: (result) => {
        this.searchResult = result;
        console.log('Search result:', result); // Debug log
        if (result.oxford) {
          console.log('Oxford data:', result.oxford); // Debug log
          console.log('Synonyms:', result.oxford.synonyms); // Debug synonyms
        }
        this.isSearching = false;
        if (result.oxford || result.inCollection) {
          this.showNotification(`Found details for "${result.word}"!`, 'success');
        } else {
          this.showNotification(`No Oxford details found for "${result.word}".`, 'info');
        }
      },
      error: (error) => {
        this.searchError = 'Error searching for word: ' + error.message;
        this.isSearching = false;
        this.showNotification('Error searching for word. Check backend connection.', 'error');
      }
    });
  }

  addWordToCollection(word: string) {
    if (!word || word.trim() === '') {
      return;
    }

    console.log('Adding word to collection:', word); // Debug
    this.wordService.addWordWithValidation(word.trim()).subscribe({
      next: (response) => {
        console.log('Add word response:', response); // Debug
        if (response.success) {
          // Update the search result to reflect the word is now in collection
          if (this.searchResult) {
            this.searchResult.inCollection = true;
          }
          
          // Show appropriate message based on whether it was new
          if (response.was_new) {
            this.showNotification(`"${word}" added to your collection! (New word)`, 'success');
          } else {
            this.showNotification(`"${word}" was already in your collection.`, 'info');
          }
          
          // Reload word stats to reflect the new word count immediately
          console.log('Reloading stats after adding word...'); // Debug
          this.loadWordStats();
        } else {
          this.searchError = response.message;
          this.showNotification(response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error adding word:', error); // Debug
        this.searchError = 'Error adding word to collection: ' + error.message;
        this.showNotification('Error adding word to collection', 'error');
      }
    });
  }

  onSearchModeChange() {
    // Clear search results when switching modes
    this.searchResult = null;
    this.searchError = '';
    this.searchWord = '';
    this.showNotification(`Switched to ${this.searchMode === 'basic' ? 'Basic' : this.searchMode === 'advanced' ? 'Advanced' : 'Puzzle'} mode.`, 'info');
  }

  // Search toggle methods
  toggleSearchMode() {
    if (this.searchMode === 'basic') {
      this.searchMode = 'advanced';
    } else if (this.searchMode === 'advanced') {
      this.searchMode = 'basic';
    } else {
      // If in puzzle mode, go to basic
      this.searchMode = 'basic';
    }
    this.onSearchModeChange();
  }

  expandSearchToggle() {
    this.searchToggleExpanded = true;
  }

  collapseSearchToggle() {
    this.searchToggleExpanded = false;
  }

  // Puzzle toggle methods
  togglePuzzlePanel() {
    if (this.searchMode === 'puzzle') {
      this.searchMode = 'basic';
      this.showNotification('Switched to Basic Search', 'info');
    } else {
      this.searchMode = 'puzzle';
      this.showNotification('Puzzle Solver activated', 'info');
    }
  }

  expandPuzzleToggle() {
    this.puzzleToggleExpanded = true;
  }

  collapsePuzzleToggle() {
    this.puzzleToggleExpanded = false;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.showNotification(
      `Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`,
      'info'
    );
  }

  // Performance stats methods
  togglePerformanceStats() {
    this.performanceStatsVisible = !this.performanceStatsVisible;
    if (this.performanceStatsVisible && !this.performanceStats) {
      this.loadPerformanceStats();
    }
  }

  loadPerformanceStats() {
    this.wordService.getPerformanceStats().subscribe({
      next: (stats) => {
        this.performanceStats = stats;
      },
      error: (error) => {
        console.error('Error loading performance stats:', error);
        this.showNotification('Failed to load performance stats', 'error');
      }
    });
  }

  // Browse by length methods
  onBrowseLengthChange() {
    if (this.browseLength && this.browseLength > 0) {
      this.browseWords = [];
      this.browseError = '';
    }
  }

  loadWordsByLength() {
    if (!this.browseLength || this.browseLength <= 0) {
      this.browseError = 'Please enter a valid word length.';
      this.showNotification('Please enter a valid word length.', 'error');
      return;
    }

    this.browseLoading = true;
    this.browseError = '';

    this.wordService.getWordsByLength(this.browseLength).subscribe({
      next: (response) => {
        this.browseWords = response.words;
        this.browseLoading = false;
        this.showNotification(`Found ${response.words.length} words of length ${this.browseLength}!`, 'success');
      },
      error: (error) => {
        console.error('Error loading words by length:', error);
        this.browseError = 'Failed to load words. Make sure the backend is running.';
        this.browseLoading = false;
        this.showNotification('Failed to load words. Check backend connection.', 'error');
      }
    });
  }

  clearBrowse() {
    this.browseLength = 5;
    this.browseWords = [];
    this.browseError = '';
    this.browseLoading = false;
    this.showNotification('Browse cleared', 'info');
  }

  setHoveredCard(cardId: string | null) {
    this.hoveredCard = cardId;
  }

  getCardState(cardId: string): string {
    return this.hoveredCard === cardId ? 'hovered' : 'default';
  }
}

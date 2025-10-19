import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  WordStats,
  WordFilter,
  SearchResult,
  AddWordResponse,
  PerformanceStats,
  InteractiveSearchParams,
  WordsByLengthResponse,
  WordServiceConfig
} from '../types/WordTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export class WordService {
  private api: AxiosInstance;
  private config: WordServiceConfig;

  constructor(config: WordServiceConfig = { baseURL: API_BASE_URL }) {
    this.config = config;

    this.api = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  }

  /**
   * Get word statistics
   */
  async getWordStats(): Promise<WordStats> {
    try {
      const response: AxiosResponse<WordStats> = await this.api.get('/words/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to load word statistics: ${error.message}`);
    }
  }

  /**
   * Search for a basic word with Oxford data
   */
  async searchBasicWord(word: string): Promise<SearchResult> {
    try {
      const response: AxiosResponse<SearchResult> = await this.api.get('/words/search-basic', {
        params: { word: word.trim() }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Word "${word}" not found in our database`);
      }
      throw new Error(`Failed to search for word: ${error.message}`);
    }
  }

  /**
   * Get filtered words based on criteria
   */
  async getFilteredWords(filter: WordFilter): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response: AxiosResponse<string[]> = await this.api.get(`/words?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get filtered words: ${error.message}`);
    }
  }

  /**
   * Add a word to the collection with validation
   */
  async addWordWithValidation(word: string): Promise<AddWordResponse> {
    try {
      const response: AxiosResponse<AddWordResponse> = await this.api.post('/words/add-validated', {
        word: word.trim()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Failed to add word to collection: ${error.message}`);
    }
  }

  /**
   * Get interactive words based on pattern
   */
  async getInteractiveWords(wordLength: number, pattern: string): Promise<string[]> {
    try {
      const response: AxiosResponse<string[]> = await this.api.get('/words/interactive', {
        params: { length: wordLength, pattern }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get interactive words: ${error.message}`);
    }
  }

  /**
   * Get words by specific length
   */
  async getWordsByLength(length: number): Promise<WordsByLengthResponse> {
    try {
      const response: AxiosResponse<WordsByLengthResponse> = await this.api.get(`/words/by-length/${length}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get words by length: ${error.message}`);
    }
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(): Promise<PerformanceStats> {
    try {
      const response: AxiosResponse<PerformanceStats> = await this.api.get('/performance/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to load performance statistics: ${error.message}`);
    }
  }

  /**
   * Validate a word using Oxford Dictionary
   */
  async validateWord(word: string): Promise<SearchResult> {
    try {
      const response: AxiosResponse<SearchResult> = await this.api.post('/words/validate', {
        word: word.trim()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to validate word: ${error.message}`);
    }
  }

  /**
   * Get health status of the API
   */
  async getHealthStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error(`API health check failed: ${error.message}`);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): WordServiceConfig {
    return { ...this.config };
  }
}

// Create a default instance
export const wordService = new WordService();

// Export types for convenience
export type { WordStats, WordFilter, SearchResult, AddWordResponse, PerformanceStats };

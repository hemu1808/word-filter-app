# 🔗 Backend Integration Guide

This guide explains how to integrate the new React frontend with the existing FastAPI backend.

## 🚀 Quick Start

1. **Start the FastAPI Backend**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8001
   ```

2. **Start the React Frontend**
   ```bash
   cd frontend/react-word-app
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the React app root:

```env
VITE_API_BASE_URL=http://localhost:8001
VITE_APP_NAME=Word Explorer
VITE_ENABLE_ANALYTICS=false
```

### CORS Configuration
Ensure your FastAPI backend has CORS enabled for the React frontend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📡 API Integration

### WordService Configuration
The `WordService` class handles all API communication:

```typescript
// Default configuration
const wordService = new WordService({
  baseUrl: 'http://localhost:8001',
  timeout: 10000,
  retries: 3
});

// Custom configuration
const wordService = new WordService({
  baseUrl: process.env.VITE_API_BASE_URL,
  timeout: 15000,
  retries: 5
});
```

### API Endpoints Mapping

| React Component | API Endpoint | Method | Description |
|----------------|--------------|--------|-------------|
| WordSearch | `/words/search/{word}` | GET | Basic word search with Oxford data |
| AdvancedSearch | `/words` | GET | Advanced filtering with query parameters |
| PuzzleSolver | `/words/interactive` | POST | Pattern-based word search |
| BrowseWords | `/words/length/{length}` | GET | Words by specific length |
| PerformanceStats | `/performance/stats` | GET | System performance metrics |
| WordStats | `/words/stats` | GET | Word database statistics |

### Error Handling

The WordService includes comprehensive error handling:

```typescript
try {
  const result = await wordService.searchBasicWord('example');
  // Handle success
} catch (error) {
  // Error is automatically formatted with user-friendly messages
  console.error(error.message);
}
```

## 🎨 UI Integration Features

### Dynamic Dialog Sizing
The app automatically adjusts dialog sizes based on content:

```typescript
const getDialogSize = (content: string, type: 'word' | 'results' | 'search') => {
  const length = content.length;
  
  if (type === 'word') {
    if (length <= 5) return 'dialog-sm';
    if (length <= 10) return 'dialog-md';
    if (length <= 15) return 'dialog-lg';
    return 'dialog-xl';
  }
  
  return 'dialog-responsive';
};
```

### Responsive Design
All components are fully responsive:

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content adapts to screen size */}
</div>
```

### Theme Integration
Dark/light mode with system preference detection:

```typescript
const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
  }
}, []);
```

## 🔄 Data Flow

### Search Flow
1. User enters search term
2. React component calls WordService
3. WordService makes HTTP request to FastAPI
4. FastAPI processes request and returns data
5. React component updates UI with results
6. Animations and transitions provide feedback

### State Management
- **Local State**: Component-level state with React hooks
- **API State**: Managed by WordService with caching
- **Theme State**: Global theme with localStorage persistence
- **Performance State**: Real-time performance monitoring

## 🎭 Animation Integration

### Framer Motion Variants
```typescript
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};
```

### Loading States
```typescript
{isSearching && (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className="loading-spinner"
  />
)}
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
const WordResults = lazy(() => import('./components/WordResults'));
const AdvancedSearch = lazy(() => import('./components/AdvancedSearch'));
```

### API Caching
```typescript
// WordService includes automatic retry and caching
const wordService = new WordService({
  baseUrl: 'http://localhost:8001',
  timeout: 10000,
  retries: 3
});
```

### Bundle Optimization
- Tree shaking removes unused code
- Dynamic imports for code splitting
- Optimized images and assets
- Gzip compression for production

## 🔧 Development Tools

### Hot Reload
Vite provides instant hot module replacement:
- Changes reflect immediately
- State preservation during development
- Fast build times

### TypeScript Integration
Full type safety with the backend:
```typescript
interface SearchResult {
  word: string;
  inCollection: boolean;
  oxford?: OxfordData;
}
```

### Debugging
- React DevTools integration
- Network request monitoring
- Performance profiling
- Error boundary implementation

## 📱 Mobile Integration

### Touch Interactions
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="touch-friendly-button"
>
  Search
</motion.button>
```

### Responsive Breakpoints
```css
/* Mobile first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## 🔒 Security Considerations

### API Security
- HTTPS in production
- CORS configuration
- Input validation
- Rate limiting

### Frontend Security
- XSS prevention
- CSRF protection
- Secure storage
- Content Security Policy

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Configuration
```env
# Production
VITE_API_BASE_URL=https://api.yourapp.com
VITE_APP_NAME=Word Explorer
VITE_ENABLE_ANALYTICS=true
```

## 🧪 Testing Integration

### API Testing
```typescript
// Mock API responses for testing
const mockWordService = {
  searchBasicWord: jest.fn().mockResolvedValue(mockSearchResult),
  getWordStats: jest.fn().mockResolvedValue(mockWordStats)
};
```

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import WordSearch from './WordSearch';

test('renders search input', () => {
  render(<WordSearch onSearch={jest.fn()} isSearching={false} />);
  expect(screen.getByPlaceholderText(/type a word/i)).toBeInTheDocument();
});
```

## 📊 Monitoring & Analytics

### Performance Monitoring
- Real-time performance stats
- Bundle size analysis
- API response times
- User interaction tracking

### Error Tracking
- Automatic error reporting
- User feedback collection
- Performance metrics
- Usage analytics

---

**Ready to explore words with style! 🎨✨**

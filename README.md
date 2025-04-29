# Countries Explorer

A modern React application for exploring country data using the [REST Countries API](https://restcountries.com/).

## Features

- Browse countries with pagination
- View detailed country information
- Mark countries as favorites
- Responsive design for all devices
- Error handling and loading states
- Test-driven development (TDD) approach

## Tech Stack

- React 18
- TypeScript
- Vite
- Vitest for testing
- React Testing Library
- React Icons for UI icons
- MSW (Mock Service Worker) for API mocking in tests

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Testing

The project follows a Test-Driven Development (TDD) approach:

1. Write failing tests
2. Implement features to make tests pass
3. Refactor while keeping tests green

Tests are written using Vitest and React Testing Library, focusing on:

- Component rendering
- User interactions
- Error states
- Loading states
- Data fetching

## Tradeoffs

### Technical Decisions

- **Inline Styling vs CSS Framework**: Chose inline styling for simplicity and quick development, but this makes styling less maintainable and consistent
- **Local Storage for Favorites**: Using localStorage for persistence is simple but doesn't sync across devices
- **Client-side Pagination**: Implemented pagination on the frontend for simplicity, but this means loading all countries at once
- **Minimal State Management**: Using React's built-in state management keeps the app simple but could become unwieldy with more features
- **No Search/Filtering**: Prioritized core features over search functionality to meet time constraints

### Testing Approach

- **MSW for API Mocking**: Provides realistic API testing but requires maintenance of mock handlers
- **Component-level Testing**: Focused on component tests for reliability, but lacks end-to-end testing
- **TDD Process**: Strict TDD approach ensured quality but slowed initial development

### Performance Considerations

- **No Virtualization**: Simple list rendering works for current dataset but would need optimization for larger lists
- **No Caching**: Each page load fetches fresh data, which could be optimized with caching
- **No Code Splitting**: Single bundle approach is simpler but could benefit from code splitting for larger features

## Future Improvements

With more time, the following enhancements could be made:

### UI/UX

- Implement a styling library (e.g., Tailwind CSS) for more consistent and maintainable styling
- Add a search input for filtering countries by name
- Implement advanced filtering options (by region, population range, etc.)
- Add sorting capabilities for the country list
- Improve mobile responsiveness with a dedicated mobile layout

### Features

- Add country comparison functionality
- Implement a map view using a mapping library
- Add more detailed country information (e.g., historical data, current events)
- Implement user authentication to persist favorites across devices
- Add sharing functionality for country details

### Technical

- Implement proper state management (e.g., Redux, Zustand) for complex state
- Add end-to-end testing with Cypress or Playwright
- Implement proper error boundaries
- Add performance optimizations (e.g., virtualization for long lists)
- Add proper TypeScript types for all API responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Implement features
5. Submit a pull request

## License

MIT

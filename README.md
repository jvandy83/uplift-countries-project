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

## Project Structure

```
src/
  ├── components/     # React components
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  └── App.tsx        # Main application component
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Implement features
5. Submit a pull request

## License

MIT

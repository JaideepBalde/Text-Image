import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ImageGenerator from './components/ImageGenerator';

function App() {
  return (
    <ErrorBoundary>
      <ImageGenerator />
    </ErrorBoundary>
  );
}

export default App;
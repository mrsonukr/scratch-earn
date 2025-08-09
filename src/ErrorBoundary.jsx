import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error and redirect to Google
    console.error('Error caught by boundary:', error, errorInfo);
    window.location.href = 'https://www.google.com';
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return null; // This will cause a redirect to Google
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

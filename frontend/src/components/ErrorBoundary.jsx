import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center text-3xl mb-6">
            ⚠️
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-4">Something went wrong.</h1>
          <p className="text-text-secondary font-medium mb-8 max-w-md">
            An unexpected error occurred in the application. Please reload the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary px-8 py-3 text-lg font-bold shadow-sm hover:-translate-y-1 transition-transform"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

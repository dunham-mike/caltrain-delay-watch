import React, { Component } from 'react';

// Modeled on: https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    // componentDidCatch(error, errorInfo) {
    //   // You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
    // }
  
    render() {
        if (this.state.hasError) {
            // Rendering custom fallback UI
            return (
                <div className="has-text-centered has-text-white is-size-4">
                    Something went wrong! Please refresh the page.
                </div>
            );
        }
    
        return this.props.children; 
    }
  }

  export default ErrorBoundary;
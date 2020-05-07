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
                <div style={{ position: 'absolute', left: '0', top: '0', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="box" style={{ maxWidth: '600px' }}>
                        <p className="title has-text-primary has-text-centered">
                            Caltrain Delay Watch is having trouble right now...
                        </p>
                        <p className="subtitle has-text-primary has-text-centered" style={{ marginTop: '0.75rem' }}>
                            Please check your internet connection and refresh the page.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
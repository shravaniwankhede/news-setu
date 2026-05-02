import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, resetKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState(prev => ({ hasError: false, resetKey: prev.resetKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <h2>Something went wrong.</h2>
          <p>An unexpected error occurred. Please try again.</p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid currentColor',
              background: 'transparent',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}

export default ErrorBoundary;

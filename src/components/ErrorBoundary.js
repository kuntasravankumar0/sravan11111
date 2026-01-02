import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🚨 Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="error-btn primary"
              >
                Reload Page
              </button>
              
              <button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="error-btn secondary"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const errorBoundaryStyles = `
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fff5f5, #fed7d7);
}

.error-boundary-content {
  max-width: 500px;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #fed7d7;
}

.error-boundary-content h2 {
  color: #e53e3e;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 700;
}

.error-boundary-content p {
  color: #4a5568;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.error-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 120px;
}

.error-btn.primary {
  background: #e53e3e;
  color: white;
}

.error-btn.primary:hover {
  background: #c53030;
  transform: translateY(-2px);
}

.error-btn.secondary {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.error-btn.secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.error-details {
  margin-top: 20px;
  text-align: left;
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 12px;
}

.error-stack {
  background: #1a202c;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .error-boundary {
    padding: 20px 16px;
  }
  
  .error-boundary-content {
    padding: 24px;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-btn {
    width: 100%;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = errorBoundaryStyles;
  document.head.appendChild(styleSheet);
}
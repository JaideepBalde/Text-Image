import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 max-w-lg w-full text-center shadow-2xl">
            <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              We encountered an unexpected error while generating your image. 
              Don't worry, this happens sometimes with AI models. Your data is safe.
            </p>
            
            {this.state.error && (
              <div className="bg-black/20 rounded-lg p-4 mb-6 text-left border border-red-500/30">
                <h3 className="text-red-300 font-semibold mb-2">Error Details:</h3>
                <p className="text-red-200 font-mono text-sm break-words">
                  {this.state.error.message}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-red-300 cursor-pointer text-sm">
                      Stack Trace (Development)
                    </summary>
                    <pre className="text-xs text-red-200 mt-2 overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-gradient-to-r from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Page
              </button>
              
              <button
                onClick={this.handleHome}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <h3 className="text-gray-300 font-semibold mb-2">💡 Quick Tips:</h3>
              <ul className="text-gray-300 text-sm space-y-1 text-left">
                <li>• Try refreshing the page</li>
                <li>• Check your internet connection</li>
                <li>• Try a different AI model</li>
                <li>• Simplify your prompt</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
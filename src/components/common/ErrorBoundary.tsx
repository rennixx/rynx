import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className="min-h-screen flex items-center justify-center bg-black text-white p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md mx-auto text-center">
            <motion.div
              className="text-6xl mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ⚠️
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-4 font-mono">
              &lt;Error /&gt;
            </h1>
            
            <p className="text-gray-300 mb-6">
              Something unexpected happened. The error has been logged and we're working on a fix.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-gray-900 p-4 rounded-lg mb-6 text-sm">
                <summary className="cursor-pointer text-red-400 font-mono mb-2">
                  Debug Info (Development Only)
                </summary>
                <pre className="text-red-300 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <motion.button
              className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

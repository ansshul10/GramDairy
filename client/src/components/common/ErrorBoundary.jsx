import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary Caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-950">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Something went wrong</h2>
              <p className="text-gray-500 font-medium">
                We encountered an unexpected error. Don't worry, your order and data are safe.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full"
              onClick={() => window.location.reload()}
              leftIcon={<RotateCcw className="w-5 h-5" />}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

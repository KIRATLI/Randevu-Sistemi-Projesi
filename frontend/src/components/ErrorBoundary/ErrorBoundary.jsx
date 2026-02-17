import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // You can log the error to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Bir Hata Oluştu
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-600 dark:text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
              >
                Tekrar Dene
              </button>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary



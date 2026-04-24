import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-950">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[150px] font-black text-gray-100 dark:text-gray-900 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-primary-500/50">
              <span className="text-white text-5xl font-black">?</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Lost in the Farm?</h2>
          <p className="text-gray-500 font-medium">
            The page you are looking for doesn't exist or has been moved to another pasture.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full" leftIcon={<Home className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 font-bold text-gray-400 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound

export default function LoadingSpinner({ size = 'md', fullScreen = false, message = '' }) {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-6'
    }

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
            />
            {message && (
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        )
    }

    return spinner
}

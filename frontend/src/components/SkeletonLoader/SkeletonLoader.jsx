export default function SkeletonLoader({ variant = 'card', count = 1 }) {
    const variants = {
        text: () => (
            <div className="animate-pulse space-y-2">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                ))}
            </div>
        ),

        card: () => (
            <div className="animate-pulse">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        ),

        table: () => (
            <div className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
                        <div className="flex gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                            ))}
                        </div>
                    </div>
                    {/* Rows */}
                    {[...Array(count)].map((_, i) => (
                        <div key={i} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-4">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),

        profile: () => (
            <div className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),

        stats: () => (
            <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                ))}
            </div>
        ),
    }

    return variants[variant] ? variants[variant]() : variants.card()
}

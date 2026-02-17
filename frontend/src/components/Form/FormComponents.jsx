import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Form Input Component with validation
export function FormInput({ register, name, label, error, type = 'text', placeholder, ...props }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                {...register(name)}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    )
}

// Form Textarea Component
export function FormTextarea({ register, name, label, error, placeholder, rows = 4, ...props }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                {...register(name)}
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    )
}

// Form Select Component
export function FormSelect({ register, name, label, error, options, placeholder, ...props }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                {...register(name)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    )
}

// Form Checkbox Component
export function FormCheckbox({ register, name, label, error, ...props }) {
    return (
        <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    {...register(name)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    {...props}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    )
}

// Custom hook for form handling
export function useValidatedForm(schema, defaultValues = {}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty, isValid },
        reset,
        setValue,
        watch,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
        mode: 'onChange', // Validate on change
    })

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isDirty,
        isValid,
        reset,
        setValue,
        watch,
        getValues,
    }
}

// Form submit button
export function FormSubmitButton({ children, isSubmitting, isValid, ...props }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            {...props}
        >
            {isSubmitting ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    İşlem yapılıyor...
                </>
            ) : (
                children
            )}
        </button>
    )
}

import { showToast } from './toast'

// API Configuration
const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
    retryAttempts: 3,
    retryDelay: 1000, // milliseconds
}

// Retry logic with exponential backoff
async function retryRequest(fn, retries = API_CONFIG.retryAttempts, delay = API_CONFIG.retryDelay) {
    try {
        return await fn()
    } catch (error) {
        if (retries === 0 || !shouldRetry(error)) {
            throw error
        }

        // Exponential backoff
        const waitTime = delay * (API_CONFIG.retryAttempts - retries + 1)

        console.log(`Retrying request... (${API_CONFIG.retryAttempts - retries + 1}/${API_CONFIG.retryAttempts}) after ${waitTime}ms`)

        await new Promise(resolve => setTimeout(resolve, waitTime))
        return retryRequest(fn, retries - 1, delay)
    }
}

// Determine if request should be retried
function shouldRetry(error) {
    // Don't retry on these status codes
    const noRetryStatuses = [400, 401, 403, 404, 422]

    if (error.response) {
        return !noRetryStatuses.includes(error.response.status)
    }

    // Retry on network errors
    return error.code === 'ECONNABORTED' || error.message === 'Network Error'
}

// API Error Handler
export class ApiError extends Error {
    constructor(message, statusCode, response) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
        this.response = response
    }
}

// Handle API errors and convert to user-friendly messages
export function handleApiError(error, customMessage = null) {
    let message = customMessage || 'Bir hata oluştu'
    let statusCode = null

    if (error.response) {
        // Server responded with error
        statusCode = error.response.status

        const errorMessages = {
            400: 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.',
            401: 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.',
            403: 'Bu işlem için yetkiniz yok.',
            404: 'İstenen kaynak bulunamadı.',
            409: 'Bu işlem zaten mevcut bir kayıtla çakışıyor.',
            422: 'Girdiğiniz bilgiler geçerli değil.',
            429: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.',
            500: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
            503: 'Servis şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
        }

        message = error.response.data?.message || errorMessages[statusCode] || message

        // Auto-redirect to login on 401
        if (statusCode === 401) {
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
        }
    } else if (error.request) {
        // Request made but no response
        message = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.'
    } else {
        // Something else happened
        message = error.message || 'Beklenmeyen bir hata oluştu'
    }

    showToast.error(message)

    return new ApiError(message, statusCode, error.response)
}

// Generic API request wrapper with retry and error handling
export async function apiRequest(fn, options = {}) {
    const {
        retry = true,
        showError = true,
        customErrorMessage = null,
        onSuccess = null,
        onError = null,
    } = options

    try {
        const response = retry ? await retryRequest(fn) : await fn()

        if (onSuccess) {
            onSuccess(response)
        }

        return response
    } catch (error) {
        const apiError = showError ? handleApiError(error, customErrorMessage) : error

        if (onError) {
            onError(apiError)
        }

        throw apiError
    }
}

// Request interceptor for adding auth token
export function addAuthToken(config) {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        }
    }
    return config
}

// Timeout wrapper
export function withTimeout(promise, timeoutMs = API_CONFIG.timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        ),
    ])
}

// Debounce function for search/filter operations
export function debounce(func, wait = 300) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Throttle function for rate limiting
export function throttle(func, limit = 1000) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

export default {
    apiRequest,
    handleApiError,
    retryRequest,
    addAuthToken,
    withTimeout,
    debounce,
    throttle,
    API_CONFIG,
}

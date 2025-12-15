import toast from 'react-hot-toast'

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#10b981',
      color: '#fff',
    },
  })
}

// Error toast
export const showError = (message) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#ef4444',
      color: '#fff',
    },
  })
}

// Info toast
export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      borderRadius: '10px',
      background: '#3b82f6',
      color: '#fff',
    },
  })
}

// Loading toast
export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      borderRadius: '10px',
      background: '#363636',
      color: '#fff',
    },
  })
}

// Promise toast (for async operations)
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Yükleniyor...',
      success: messages.success || 'Başarılı!',
      error: messages.error || 'Bir hata oluştu!',
    },
    {
      style: {
        borderRadius: '10px',
        minWidth: '250px',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      },
    }
  )
}

// Custom toast with action button
export const showConfirm = (message, onConfirm) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <p>{message}</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onConfirm()
            toast.dismiss(t.id)
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Onayla
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
        >
          İptal
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    style: {
      borderRadius: '10px',
      background: '#fff',
      color: '#000',
      minWidth: '300px',
    },
  })
}

export default toast



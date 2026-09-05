import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { api } from '../../../utils/api'

const TEMPLATE_TYPES = [
    { id: 'appointment_confirmed', name: 'Randevu Onayı', icon: '✅' },
    { id: 'appointment_rejected', name: 'Randevu Reddi', icon: '❌' },
    { id: 'appointment_cancelled', name: 'Randevu İptali', icon: '🚫' },
    { id: 'appointment_reminder', name: 'Randevu Hatırlatma', icon: '⏰' },
    { id: 'welcome_email', name: 'Hoş Geldiniz', icon: '👋' },
    { id: 'password_reset', name: 'Şifre Sıfırlama', icon: '🔑' }
]

const VARIABLES = [
    { key: '{student_name}', description: 'Öğrenci adı' },
    { key: '{student_no}', description: 'Öğrenci numarası' },
    { key: '{academician_name}', description: 'Akademisyen adı' },
    { key: '{date}', description: 'Randevu tarihi' },
    { key: '{time}', description: 'Randevu saati' },
    { key: '{duration}', description: 'Randevu süresi' },
    { key: '{subject}', description: 'Randevu konusu' },
    { key: '{office}', description: 'Ofis yeri' },
    { key: '{cancel_reason}', description: 'İptal nedeni' }
]

export default function EmailTemplates() {
    const [templates, setTemplates] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [showPreview, setShowPreview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        type: '',
        subject: '',
        body: ''
    })

    useEffect(() => {
        loadTemplates()
    }, [])

    const loadTemplates = async () => {
        setLoading(true)
        try {
            // Mock data - gerçek API'ye bağlanacak
            const mockTemplates = TEMPLATE_TYPES.map(type => ({
                id: type.id,
                type: type.id,
                subject: getDefaultSubject(type.id),
                body: getDefaultBody(type.id),
                lastModified: new Date().toISOString(),
                isActive: true
            }))
            setTemplates(mockTemplates)
        } catch (error) {
            console.error('Şablonlar yüklenemedi:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDefaultSubject = (type) => {
        const subjects = {
            'appointment_confirmed': 'Randevunuz Onaylandı - {academician_name}',
            'appointment_rejected': 'Randevu Talebiniz Hakkında',
            'appointment_cancelled': 'Randevunuz İptal Edildi',
            'appointment_reminder': 'Randevu Hatırlatma - {date} {time}',
            'welcome_email': 'Ankara Üniversitesi Randevu Sistemine Hoş Geldiniz',
            'password_reset': 'Şifre Sıfırlama Talebi'
        }
        return subjects[type] || 'Email Şablonu'
    }

    const getDefaultBody = (type) => {
        const bodies = {
            'appointment_confirmed': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p><strong>{academician_name}</strong> ile <strong>{date}</strong> tarihinde saat <strong>{time}</strong>'de yapacağınız randevunuz onaylanmıştır.</p>
        <p><strong>Randevu Detayları:</strong></p>
        <ul>
          <li>Tarih: {date}</li>
          <li>Saat: {time}</li>
          <li>Süre: {duration} dakika</li>
          <li>Ofis: {office}</li>
          <li>Konu: {subject}</li>
        </ul>
        <p>Randevunuza lütfen zamanında gelmeyi unutmayınız.</p>
        <p>İyi günler dileriz.</p>
      `,
            'appointment_rejected': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p>Maalesef <strong>{academician_name}</strong> ile <strong>{date}</strong> tarihinde talep ettiğiniz randevu uygun görülmemiştir.</p>
        <p>Farklı bir tarih için yeni randevu talebinde bulunabilirsiniz.</p>
        <p>Anlayışınız için teşekkür ederiz.</p>
      `,
            'appointment_cancelled': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p><strong>{academician_name}</strong> ile <strong>{date}</strong> tarihindeki randevunuz iptal edilmiştir.</p>
        <p><strong>İptal Nedeni:</strong> {cancel_reason}</p>
        <p>Yeni randevu için sistem üzerinden talepte bulunabilirsiniz.</p>
      `,
            'appointment_reminder': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p>Yarın <strong>{date}</strong> tarihinde saat <strong>{time}</strong>'de <strong>{academician_name}</strong> ile randevunuz bulunmaktadır.</p>
        <p>Randevunuza lütfen zamanında gelmeyi unutmayınız.</p>
        <p>Ofis: {office}</p>
      `,
            'welcome_email': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p>Ankara Üniversitesi Randevu Sistemine hoş geldiniz!</p>
        <p>Sistem üzerinden akademisyenlerimizle kolayca randevu oluşturabilir, randevularınızı takip edebilir ve mesajlaşabilirsiniz.</p>
        <p>İyi çalışmalar dileriz.</p>
      `,
            'password_reset': `
        <p>Sayın <strong>{student_name}</strong>,</p>
        <p>Şifre sıfırlama talebiniz alınmıştır.</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayınız:</p>
        <p><a href="#">Şifremi Sıfırla</a></p>
        <p>Bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
      `
        }
        return bodies[type] || '<p>Email içeriği...</p>'
    }

    const handleEdit = (template) => {
        setEditingTemplate(template)
        setFormData({
            type: template.type,
            subject: template.subject,
            body: template.body
        })
    }

    const handleSave = async () => {
        if (!formData.subject.trim() || !formData.body.trim()) {
            alert('Konu ve içerik alanları zorunludur!')
            return
        }

        try {
            // API call would go here
            const updatedTemplates = templates.map(t =>
                t.id === editingTemplate.id
                    ? { ...t, ...formData, lastModified: new Date().toISOString() }
                    : t
            )
            setTemplates(updatedTemplates)
            setEditingTemplate(null)
            alert('✓ Şablon kaydedildi!')
        } catch (error) {
            console.error('Kaydetme hatası:', error)
            alert('✗ Şablon kaydedilemedi')
        }
    }

    const handlePreview = (template) => {
        setSelectedTemplate(template)
        setShowPreview(true)
    }

    const renderPreview = () => {
        if (!selectedTemplate) return null

        const sampleData = {
            '{student_name}': 'Ahmet Yılmaz',
            '{student_no}': '12345678',
            '{academician_name}': 'Prof. Dr. Ayşe Demir',
            '{date}': '25 Aralık 2025',
            '{time}': '14:00',
            '{duration}': '30',
            '{subject}': 'Proje danışmanlığı',
            '{office}': 'A-204',
            '{cancel_reason}': 'Ani bir toplantı nedeniyle'
        }

        let previewSubject = selectedTemplate.subject
        let previewBody = selectedTemplate.body

        Object.keys(sampleData).forEach(key => {
            previewSubject = previewSubject.replaceAll(key, sampleData[key])
            previewBody = previewBody.replaceAll(key, sampleData[key])
        })

        return (
            <>
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowPreview(false)} />
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                👁️ Email Önizleme
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                <div className="mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Konu:</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{previewSubject}</p>
                                </div>
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: previewBody }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                * Bu önizleme örnek verilerle oluşturulmuştur.
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const insertVariable = (variable) => {
        setFormData({ ...formData, body: formData.body + ' ' + variable })
    }

    if (loading) {
        return (
            <DashboardLayout userRole="admin">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📧 Email Şablon Yönetimi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Otomatik email şablonlarını düzenleyin ve yönetin
                    </p>
                </div>

                {editingTemplate ? (
                    /* Edit Mode */
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {TEMPLATE_TYPES.find(t => t.id === editingTemplate.type)?.icon}{' '}
                                    {TEMPLATE_TYPES.find(t => t.id === editingTemplate.type)?.name} Şablonu
                                </h2>
                                <button
                                    onClick={() => setEditingTemplate(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Subject */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Konusu *
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    placeholder="Email konusu..."
                                />
                            </div>

                            {/* Variables */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kullanılabilir Değişkenler
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {VARIABLES.map(variable => (
                                        <button
                                            key={variable.key}
                                            onClick={() => insertVariable(variable.key)}
                                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                                            title={variable.description}
                                        >
                                            {variable.key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rich Text Editor */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email İçeriği *
                                </label>
                                <div className="bg-white dark:bg-gray-700 rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.body}
                                        onChange={(value) => setFormData({ ...formData, body: value })}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['link'],
                                                ['clean']
                                            ]
                                        }}
                                        style={{ height: '300px', marginBottom: '50px' }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setEditingTemplate(null)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={() => handlePreview(formData)}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    Önizle
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List Mode */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => {
                            const templateType = TEMPLATE_TYPES.find(t => t.id === template.type)
                            return (
                                <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="text-3xl mb-2">{templateType?.icon}</div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {templateType?.name}
                                                </h3>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${template.isActive
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {template.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {template.subject}
                                        </p>

                                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                                            Son güncelleme: {new Date(template.lastModified).toLocaleDateString('tr-TR')}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(template)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handlePreview(template)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                                            >
                                                Önizle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Preview Modal */}
                {showPreview && renderPreview()}
            </div>
        </DashboardLayout>
    )
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Auth Pages
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import TwoFactor from './pages/TwoFactor/TwoFactor'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'

// Student Pages
import StudentDashboard from './pages/Student/Dashboard/Dashboard'
import AcademicianList from './pages/Student/AcademicianList/AcademicianList'
import AcademicianProfile from './pages/Student/AcademicianProfile/AcademicianProfile'
import StudentAppointments from './pages/Student/Appointments/Appointments'
import StudentMessages from './pages/Student/Messages/Messages'
import StudentSettings from './pages/Student/Settings/Settings'
import StudentHistory from './pages/Student/History/History'
import StudentNotificationSettings from './pages/Student/NotificationSettings/NotificationSettings'
import StudentSupport from './pages/Student/Support/Support'

// Academician Pages
import AcademicianDashboard from './pages/Academician/Dashboard/Dashboard'
import ScheduleSettings from './pages/Academician/ScheduleSettings/ScheduleSettings'
import AcademicianAppointments from './pages/Academician/Appointments/Appointments'
import AcademicianMessages from './pages/Academician/Messages/Messages'
import Students from './pages/Academician/Students/Students'

// Admin Pages
import AdminLogin from './pages/Admin/Login/Login'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard'
import Users from './pages/Admin/Users/Users'
import Reports from './pages/Admin/Reports/Reports'
import AdminMessages from './pages/Admin/Messages/Messages'
import Faculties from './pages/Admin/Faculties/Faculties'
import Departments from './pages/Admin/Departments/Departments'
import AdminAppointments from './pages/Admin/Appointments/Appointments'
import AcademicianSettings from './pages/Academician/Settings/Settings'
import AcademicianSupport from './pages/Academician/Support/Support'
import AdminSettings from './pages/Admin/Settings/Settings'
import Announcements from './pages/Admin/Announcements/Announcements'
import BulkNotifications from './pages/Admin/Notifications/Notifications'
import CalendarView from './pages/Admin/Calendar/Calendar'
import EmailTemplates from './pages/Admin/EmailTemplates/EmailTemplates'
import AdminTickets from './pages/Admin/Tickets/Tickets'

// Not Found
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/2fa" element={<TwoFactor />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/academicians" element={<AcademicianList />} />
              <Route path="/student/academician/:id" element={<AcademicianProfile />} />
              <Route path="/student/appointments" element={<StudentAppointments />} />
              <Route path="/student/messages" element={<StudentMessages />} />
              <Route path="/student/settings" element={<StudentSettings />} />
              <Route path="/student/history" element={<StudentHistory />} />
              <Route path="/student/notification-settings" element={<StudentNotificationSettings />} />
              <Route path="/student/support" element={<StudentSupport />} />

              {/* Academician Routes */}
              <Route path="/academician/dashboard" element={<AcademicianDashboard />} />
              <Route path="/academician/schedule" element={<ScheduleSettings />} />
              <Route path="/academician/appointments" element={<AcademicianAppointments />} />
              <Route path="/academician/settings" element={<AcademicianSettings />} />
              <Route path="/academician/support" element={<AcademicianSupport />} />
              <Route path="/academician/students" element={<Students />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/faculties" element={<Faculties />} />
              <Route path="/admin/departments" element={<Departments />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/announcements" element={<Announcements />} />
              <Route path="/admin/notifications" element={<BulkNotifications />} />
              <Route path="/admin/calendar" element={<CalendarView />} />
              <Route path="/admin/email-templates" element={<EmailTemplates />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/messages" element={<AdminMessages />} />

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                padding: '16px',
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App


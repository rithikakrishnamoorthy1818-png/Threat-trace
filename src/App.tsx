import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationCenterProvider } from './context/NotificationCenterContext'
import { ToastProvider } from './components/common/Toast'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const ThreatIntelPage = lazy(() => import('./pages/ThreatIntelPage'))
const URLScannerPage = lazy(() => import('./pages/URLScannerPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ThreatGraphPage = lazy(() => import('./pages/ThreatGraphPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationCenterProvider>
        <ToastProvider>
          <Suspense
            fallback={
              <div className="min-h-dvh tt-grid-bg flex items-center justify-center">
                <div className="tt-scanline rounded-2xl border border-border bg-panel/70 px-8 py-7 shadow-[var(--tt-shadow-cyan)]">
                  <LoadingSpinner label="Loading ThreatTrace…" />
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis/:scanId"
                element={
                  <ProtectedRoute>
                    <AnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/threat-intel"
                element={
                  <ProtectedRoute>
                    <ThreatIntelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan-url"
                element={
                  <ProtectedRoute>
                    <URLScannerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/threat-graph/:scanId"
                element={
                  <ProtectedRoute>
                    <ThreatGraphPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
        </NotificationCenterProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}



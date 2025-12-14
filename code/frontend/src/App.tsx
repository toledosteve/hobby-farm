import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProjectProvider, ThemeProvider, BillingProvider } from '@/contexts';
import { ProtectedRoute, PublicRoute } from '@/routes/RouteGuards';
import { ROUTES } from '@/routes/routes';
import { Toaster } from '@/components/ui/sonner';

// Auth pages
import { WelcomeScreen } from '@/components/auth/WelcomeScreen';
import { SignInScreen } from '@/components/auth/SignInScreen';
import { ForgotPasswordScreen } from '@/components/auth/ForgotPasswordScreen';
import { PasswordResetConfirmation } from '@/components/auth/PasswordResetConfirmation';

// Main pages
import { ProjectsDashboard } from '@/components/ProjectsDashboard';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { MainAppLayout } from '@/components/layouts/MainAppLayout';

// App pages
import { FarmDashboard } from '@/components/dashboard/FarmDashboard';
import { MapScreen } from '@/components/MapScreen';
import { CalendarScreen } from '@/components/calendar/CalendarScreen';
import { ModulesScreen } from '@/components/modules/ModulesScreen';
import { SettingsScreen } from '@/components/settings/SettingsScreen';

// Module pages
import { MapleDashboard } from '@/components/maple/MapleDashboard';
import { MapleTreesScreen } from '@/components/maple/MapleTreesScreen';
import { SapCollectionLog } from '@/components/maple/SapCollectionLog';
import { BoilSessionLog } from '@/components/maple/BoilSessionLog';
import { PoultryDashboard } from '@/components/poultry/PoultryDashboard';
import { FlockManagement } from '@/components/poultry/FlockManagement';
import { EggLogTable } from '@/components/poultry/EggLogTable';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <BillingProvider>
            <ProjectProvider>
              <Routes>
            {/* Public routes - redirect to /projects if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path={ROUTES.AUTH.WELCOME} element={<WelcomeScreen />} />
              <Route path={ROUTES.AUTH.SIGNUP} element={<WelcomeScreen />} />
              <Route path={ROUTES.AUTH.SIGNIN} element={<SignInScreen />} />
              <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordScreen />} />
              <Route path={ROUTES.AUTH.RESET_CONFIRMATION} element={<PasswordResetConfirmation />} />
            </Route>

            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.PROJECTS} element={<ProjectsDashboard />} />
              <Route path={ROUTES.ONBOARDING} element={<OnboardingFlow />} />

              {/* App routes with layout */}
              <Route path="/app" element={<MainAppLayout />}>
                <Route path="dashboard" element={<FarmDashboard />} />
                <Route path="map" element={<MapScreen />} />
                <Route path="calendar" element={<CalendarScreen />} />
                <Route path="modules" element={<ModulesScreen />} />
                <Route path="settings" element={<SettingsScreen />} />

                {/* Maple module routes */}
                <Route path="modules/maple" element={<MapleDashboard />} />
                <Route path="modules/maple/trees" element={<MapleTreesScreen />} />
                <Route path="modules/maple/collection-log" element={<SapCollectionLog />} />
                <Route path="modules/maple/boil-log" element={<BoilSessionLog />} />

                {/* Poultry module routes */}
                <Route path="modules/poultry" element={<PoultryDashboard />} />
                <Route path="modules/poultry/flocks" element={<FlockManagement />} />
                <Route path="modules/poultry/egg-log" element={<EggLogTable />} />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={ROUTES.AUTH.WELCOME} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.AUTH.WELCOME} replace />} />
          </Routes>

              <Toaster />
            </ProjectProvider>
          </BillingProvider>
        </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

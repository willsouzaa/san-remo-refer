import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import ReferralForm from './pages/ReferralForm';
import Commissions from './pages/Commissions';
import EditReferral from './pages/EditReferral';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import ComoFunciona from "@/pages/ComoFunciona"
import SobreAplicativo from "@/pages/SobreAplicativo"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/sobre-aplicativo" element={<SobreAplicativo />} />


          {/* protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/indicar"
            element={
              <ProtectedRoute>
                <ReferralForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comissoes"
            element={
              <ProtectedRoute>
                <Commissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-indicacao/:id"
            element={
              <ProtectedRoute>
                <EditReferral />
              </ProtectedRoute>
            }
          />

          {/* admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
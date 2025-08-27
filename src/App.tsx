import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import ReferralForm from './pages/ReferralForm';
import Commissions from './pages/Commissions';
import EditReferral from './pages/EditReferral';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import ComoFunciona from './pages/ComoFunciona';
import SobreAplicativo from './pages/SobreAplicativo';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
// Adicione a importação da nova página de gestão de usuários
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Header fixo */}
        <Header />

        {/* Conteúdo das rotas */}
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/sobre-aplicativo" element={<SobreAplicativo />} />
          <Route path="*" element={<NotFound />} />

          {/* Protegidas */}
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Nova rota para gestão de usuários (apenas admin) */}
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
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
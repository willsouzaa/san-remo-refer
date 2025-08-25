import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import ReferralForm from './pages/ReferralForm';
import Commissions from './pages/Commissions';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/indicar" element={<ReferralForm />} />
          <Route path="/comissoes" element={<Commissions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
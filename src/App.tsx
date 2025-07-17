
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminRoute } from '@/components/AdminRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ProfessionalCounseling from '@/pages/ProfessionalCounseling';
import PeerCounseling from '@/pages/PeerCounseling';
import StressRelief from '@/pages/StressRelief';
import Organizations from '@/pages/Organizations';
import PractitionerDetail from '@/pages/PractitionerDetail';
import BureauDetail from '@/pages/BureauDetail';
import PeerCounselingDetail from '@/pages/PeerCounselingDetail';
import OrganizationDetail from '@/pages/OrganizationDetail';
import About from '@/pages/About';
import AdminSimple from '@/pages/AdminSimple';
import AddPractitioner from '@/pages/admin/AddPractitioner';
import AddInstitution from '@/pages/admin/AddInstitution';
import AddOrganization from '@/pages/admin/AddOrganization';
import AddPeerCounseling from '@/pages/admin/AddPeerCounseling';
import AddActivity from '@/pages/admin/AddActivity';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"
import { useAnalytics } from '@/hooks/useAnalytics';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from '@/contexts/LanguageContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </QueryClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/professional-counseling" element={<ProfessionalCounseling />} />
          <Route path="/peer-counseling" element={<PeerCounseling />} />
          <Route path="/stress-relief" element={<StressRelief />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/practitioner/:id" element={<PractitionerDetail />} />
          <Route path="/bureau/:id" element={<BureauDetail />} />
          <Route path="/peer-counseling/:id" element={<PeerCounselingDetail />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/admin" element={<AdminRoute><AdminSimple /></AdminRoute>} />
          <Route path="/admin/practitioner/add" element={<AdminRoute><AddPractitioner /></AdminRoute>} />
          <Route path="/admin/practitioner/edit/:id" element={<AdminRoute><AddPractitioner /></AdminRoute>} />
          <Route path="/admin/institution/add" element={<AdminRoute><AddInstitution /></AdminRoute>} />
          <Route path="/admin/institution/edit/:id" element={<AdminRoute><AddInstitution /></AdminRoute>} />
          <Route path="/admin/organization/add" element={<AdminRoute><AddOrganization /></AdminRoute>} />
          <Route path="/admin/organization/edit/:id" element={<AdminRoute><AddOrganization /></AdminRoute>} />
          <Route path="/admin/peer-counseling/add" element={<AdminRoute><AddPeerCounseling /></AdminRoute>} />
          <Route path="/admin/peer-counseling/edit/:id" element={<AdminRoute><AddPeerCounseling /></AdminRoute>} />
          <Route path="/admin/activity/add" element={<AdminRoute><AddActivity /></AdminRoute>} />
          <Route path="/admin/activity/edit/:id" element={<AdminRoute><AddActivity /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;

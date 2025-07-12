
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import ProfessionalCounseling from '@/pages/ProfessionalCounseling';
import PeerCounseling from '@/pages/PeerCounseling';
import StressRelief from '@/pages/StressRelief';
import Organizations from '@/pages/Organizations';
import PractitionerDetail from '@/pages/PractitionerDetail';
import BureauDetail from '@/pages/BureauDetail';
import PeerCounselingDetail from '@/pages/PeerCounselingDetail';
import OrganizationDetail from '@/pages/OrganizationDetail';
import About from '@/pages/About';
import Admin from '@/pages/Admin';
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
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </QueryClientProvider>
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
          <Route path="/professional-counseling" element={<ProfessionalCounseling />} />
          <Route path="/peer-counseling" element={<PeerCounseling />} />
          <Route path="/stress-relief" element={<StressRelief />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/practitioner/:id" element={<PractitionerDetail />} />
          <Route path="/bureau/:id" element={<BureauDetail />} />
          <Route path="/peer-counseling/:id" element={<PeerCounselingDetail />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;

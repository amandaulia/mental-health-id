import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, Routes } from 'react-router-dom';
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"
import { useAnalytics } from '@/hooks/useAnalytics';
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  useAnalytics();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

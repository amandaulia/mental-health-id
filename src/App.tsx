
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"
import { useAnalytics } from '@/hooks/useAnalytics';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { featureFlags } from '@/config/features';
import { ScrollToTop } from '@/components/ScrollToTop';

const Index = lazy(() => import('@/pages/Index'));
const ProfessionalCounseling = lazy(() => import('@/pages/ProfessionalCounseling'));
const PeerCounseling = lazy(() => import('@/pages/PeerCounseling'));
const StressRelief = lazy(() => import('@/pages/StressRelief'));
const Organizations = lazy(() => import('@/pages/Organizations'));
const PractitionerDetail = lazy(() => import('@/pages/PractitionerDetail'));
const BureauDetail = lazy(() => import('@/pages/BureauDetail'));
const PeerCounselingDetail = lazy(() => import('@/pages/PeerCounselingDetail'));
const OrganizationDetail = lazy(() => import('@/pages/OrganizationDetail'));
const About = lazy(() => import('@/pages/About'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ScrollToTop />
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
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/professional-counseling" element={<ProfessionalCounseling />} />
          {featureFlags.peerCounseling && (
            <>
              <Route path="/peer-counseling" element={<PeerCounseling />} />
              <Route path="/peer-counseling/:id" element={<PeerCounselingDetail />} />
            </>
          )}
          {featureFlags.stressRelief && (
            <Route path="/stress-relief" element={<StressRelief />} />
          )}
          {featureFlags.organizations && (
            <>
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/organizations/:id" element={<OrganizationDetail />} />
            </>
          )}
          <Route path="/practitioner/:id" element={<PractitionerDetail />} />
          <Route path="/bureau/:id" element={<BureauDetail />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;

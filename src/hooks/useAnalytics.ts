
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from '@/utils/analytics';

const GA_MEASUREMENT_ID = 'G-0DWXF5DTK4';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics on first load
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (GA_MEASUREMENT_ID) {
      const pageName = getPageName(location.pathname);
      trackPageView(pageName);
    }
  }, [location]);

  const getPageName = (pathname: string): string => {
    const routes: Record<string, string> = {
      '/': 'Home',
      '/about': 'About',
      '/professional-counseling': 'Professional Counseling',
      '/peer-counseling': 'Peer Counseling',
      '/stress-relief': 'Stress Relief',
      '/organizations': 'Organizations',
    };

    // Handle dynamic routes
    if (pathname.startsWith('/practitioner/')) return 'Practitioner Detail';
    if (pathname.startsWith('/bureau/')) return 'Bureau Detail';
    if (pathname.startsWith('/peer-counseling/')) return 'Peer Counseling Detail';
    if (pathname.startsWith('/organizations/')) return 'Organization Detail';

    return routes[pathname] || 'Unknown Page';
  };
};

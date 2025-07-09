
// Google Analytics 4 Event Tracking Utility
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  // Add Google Analytics script to head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Generic event tracking function
export const trackEvent = (event: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }
};

// Specific tracking functions for common actions
export const trackPageView = (pageName: string, pageTitle?: string) => {
  trackEvent({
    action: 'page_view',
    category: 'Navigation',
    label: pageName,
    custom_parameters: {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
    },
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number, category: string) => {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
    custom_parameters: {
      search_term: searchTerm,
      results_count: resultsCount,
      search_category: category,
    },
  });
};

export const trackFilter = (filterType: string, filterValue: string, category: string) => {
  trackEvent({
    action: 'filter_applied',
    category: 'Filter',
    label: `${filterType}: ${filterValue}`,
    custom_parameters: {
      filter_type: filterType,
      filter_value: filterValue,
      page_category: category,
    },
  });
};

export const trackCardClick = (cardType: string, cardId: string, cardName: string) => {
  trackEvent({
    action: 'card_click',
    category: 'Engagement',
    label: cardName,
    custom_parameters: {
      card_type: cardType,
      card_id: cardId,
      card_name: cardName,
    },
  });
};

export const trackContactClick = (contactType: string, resourceName: string, resourceType: string) => {
  trackEvent({
    action: 'contact_click',
    category: 'Contact',
    label: `${contactType} - ${resourceName}`,
    custom_parameters: {
      contact_type: contactType,
      resource_name: resourceName,
      resource_type: resourceType,
    },
  });
};

export const trackBookingClick = (serviceName: string, practitionerName: string, price?: number) => {
  trackEvent({
    action: 'booking_click',
    category: 'Conversion',
    label: `${serviceName} - ${practitionerName}`,
    value: price,
    custom_parameters: {
      service_name: serviceName,
      practitioner_name: practitionerName,
      service_price: price,
    },
  });
};

export const trackFeelingsAnalysis = (feelingsLength: number, recommendationsCount: number) => {
  trackEvent({
    action: 'feelings_analysis',
    category: 'AI Feature',
    label: 'Feelings Analysis Completed',
    value: recommendationsCount,
    custom_parameters: {
      feelings_text_length: feelingsLength,
      recommendations_count: recommendationsCount,
    },
  });
};

export const trackFormInteraction = (formType: string, action: string, fieldName?: string) => {
  trackEvent({
    action: `form_${action}`,
    category: 'Form',
    label: formType,
    custom_parameters: {
      form_type: formType,
      form_action: action,
      field_name: fieldName,
    },
  });
};

export const trackExternalLink = (linkUrl: string, linkText: string, context: string) => {
  trackEvent({
    action: 'external_link_click',
    category: 'Outbound',
    label: linkText,
    custom_parameters: {
      link_url: linkUrl,
      link_text: linkText,
      link_context: context,
    },
  });
};

export const trackError = (errorType: string, errorMessage: string, context: string) => {
  trackEvent({
    action: 'error_occurred',
    category: 'Error',
    label: errorType,
    custom_parameters: {
      error_type: errorType,
      error_message: errorMessage,
      error_context: context,
    },
  });
};

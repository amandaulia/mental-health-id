
import React from 'react';
import { trackCardClick, trackContactClick, trackExternalLink } from '@/utils/analytics';

interface AnalyticsWrapperProps {
  children: React.ReactNode;
  trackingType: 'card' | 'contact' | 'external-link';
  trackingData: {
    cardType?: string;
    cardId?: string;
    cardName?: string;
    contactType?: string;
    resourceName?: string;
    resourceType?: string;
    linkUrl?: string;
    linkText?: string;
    context?: string;
  };
  className?: string;
  onClick?: () => void;
}

export const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({
  children,
  trackingType,
  trackingData,
  className,
  onClick,
}) => {
  const handleClick = () => {
    // Track the event based on type
    switch (trackingType) {
      case 'card':
        if (trackingData.cardType && trackingData.cardId && trackingData.cardName) {
          trackCardClick(trackingData.cardType, trackingData.cardId, trackingData.cardName);
        }
        break;
      case 'contact':
        if (trackingData.contactType && trackingData.resourceName && trackingData.resourceType) {
          trackContactClick(trackingData.contactType, trackingData.resourceName, trackingData.resourceType);
        }
        break;
      case 'external-link':
        if (trackingData.linkUrl && trackingData.linkText && trackingData.context) {
          trackExternalLink(trackingData.linkUrl, trackingData.linkText, trackingData.context);
        }
        break;
    }

    // Call the original onClick handler if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

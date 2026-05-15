
import React from 'react';
import { trackError } from '@/utils/analytics';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ErrorFallbackUI: React.FC<{ resetError: () => void }> = ({ resetError }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-semibold">{t('errors.somethingWrong')}</h2>
        <p className="text-muted-foreground">{t('errors.unexpected')}</p>
        <div className="space-x-2">
          <Button onClick={resetError} variant="outline">
            {t('errors.tryAgain')}
          </Button>
          <Button onClick={() => window.location.reload()}>
            {t('errors.refresh')}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Track the error with Google Analytics
    trackError(
      error.name || 'React Error',
      error.message,
      `Component Stack: ${errorInfo.componentStack?.slice(0, 200)}`
    );
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <ErrorFallbackUI resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}

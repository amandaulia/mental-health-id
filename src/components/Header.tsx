import { useState } from "react";
import { Menu, X, Home, Info, Users, Heart, Palette, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { featureFlags } from "@/config/features";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="brand-gradient shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img 
              src="/lovable-uploads/3be71bd4-b94e-4b75-817d-3f5bf5125610.png" 
              alt="Elysium Mental Care"
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('header.navigation.home')}
              </a>
              <a href="/about" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('header.navigation.about')}
              </a>
              <a href="/professional-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('header.navigation.professional')}
              </a>
              {featureFlags.peerCounseling && (
                <a href="/peer-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {t('header.navigation.peer')}
                </a>
              )}
              {featureFlags.stressRelief && (
                <a href="/stress-relief" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('header.navigation.stressRelief')}
                </a>
              )}
              {featureFlags.organizations && (
                <a href="/organizations" className="text-white hover:text-accent-foreground transition-colors font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t('header.navigation.organizations')}
                </a>
              )}
            </nav>
            {featureFlags.languageOptions && <LanguageToggle />}
          </div>

          {/* Mobile Menu Button and Language Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {featureFlags.languageOptions && <LanguageToggle />}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg m-2 p-4">
            <nav className="flex flex-col space-y-3">
              <a href="/" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('header.navigation.home')}
              </a>
              <a href="/about" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('header.navigation.about')}
              </a>
              <a href="/professional-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('header.navigation.professional')}
              </a>
              {featureFlags.peerCounseling && (
                <a href="/peer-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {t('header.navigation.peer')}
                </a>
              )}
              {featureFlags.stressRelief && (
                <a href="/stress-relief" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t('header.navigation.stressRelief')}
                </a>
              )}
              {featureFlags.organizations && (
                <a href="/organizations" className="text-white hover:text-accent-foreground transition-colors font-medium py-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t('header.navigation.organizations')}
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
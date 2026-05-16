import { Users, Heart, Palette, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageSEO } from "@/components/PageSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="about" path="/about" />
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">{t('about.hero.title1')}</span> {t('about.hero.title2')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* What is the Mental Health Directory? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              {t('about.what.title')}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">{t('about.what.p1')}</p>
              <p>{t('about.what.p2')}</p>
            </div>
          </div>
        </section>

        {/* What information will Mental Health Directory cover? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              {t('about.info.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{t('about.info.professional.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">{t('about.info.professional.desc')}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{t('about.info.peer.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">{t('about.info.peer.desc')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{t('about.info.stressRelief.title')}</h3>
                    <Badge className="bg-purple-300 text-purple-900 ml-auto flex items-center justify-center">
                      {t('home.comingSoon')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{t('about.info.stressRelief.desc')}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{t('about.info.organizations.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">{t('about.info.organizations.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How can I contribute to the project? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              {t('about.contribute.title')}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">{t('about.contribute.intro')}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="font-semibold mb-2">{t('about.contribute.professionals.title')}</h3>
                  <p className="text-sm">{t('about.contribute.professionals.desc')}</p>
                </div>
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">🏢</div>
                  <h3 className="font-semibold mb-2">{t('about.contribute.organizations.title')}</h3>
                  <p className="text-sm">{t('about.contribute.organizations.desc')}</p>
                </div>
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="font-semibold mb-2">{t('about.contribute.community.title')}</h3>
                  <p className="text-sm">{t('about.contribute.community.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">{t('about.contact.title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold">{t('about.contact.email')}</h3>
                    <a href="mailto:elysium.mcare@gmail.com" className="text-primary hover:text-primary-hover">
                      elysium.mcare@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold">{t('about.contact.phone')}</h3>
                    <a href="https//wa.me/6281323931225" className="text-primary hover:text-primary-hover">
                      +62-813-2393-1225
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('about.contact.followInstagram')}</h3>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-muted-foreground mb-4">{t('about.contact.instagramDesc')}</p>
                  <a
                    href="https://instagram.com/mentalwellnessmovieclub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-medium"
                  >
                    <span>@mentalwellnessmovieclub</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

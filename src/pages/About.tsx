import { Users, Heart, Palette, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageSEO } from "@/components/PageSEO";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="about" path="/about" />
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">About</span> Mental Health Directory
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive guide to mental health resources and support in Indonesia
          </p>
        </div>

        {/* What is the Mental Health Directory? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              What is the Mental Health Directory?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                The Mental Health Directory is a comprehensive platform designed to help individuals find qualified
                mental health professionals, support groups, and wellness resources across Indonesia. We understand that
                seeking mental health support can be overwhelming, and our mission is to make this process easier and
                more accessible for everyone.
              </p>
              <p>
                Our platform serves as a bridge between those seeking help and qualified professionals, providing
                detailed information about psychologists, psychiatrists, counseling centers, and various mental health
                support services available in your area.
              </p>
            </div>
          </div>
        </section>

        {/* What information will Mental Health Directory cover? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              What information will Mental Health Directory cover?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Professional Counseling Services</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Licensed psychologists, psychiatrists, and mental health clinics with detailed profiles,
                    specializations, and contact information.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Peer & Support Counseling</h3>
                    <Badge className="bg-purple-300 text-purple-900 ml-auto flex items-center justify-center">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Community-based support groups and peer counseling services for various mental health conditions and
                    life challenges.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Stress Relief Activities</h3>
                    <Badge className="bg-purple-300 text-purple-900 ml-auto flex items-center justify-center">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Art therapy, music therapy, sports activities, and other wellness programs designed to promote
                    mental well-being.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Organizations</h3>
                    <Badge className="bg-purple-300 text-purple-900 ml-auto flex items-center justify-center">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Mental health organizations, educational institutions, and community groups dedicated to mental
                    health awareness and support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How can I contribute to the project? */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">
              How can I contribute to the project?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                We believe in the power of community and welcome contributions from mental health professionals,
                organizations, and individuals passionate about mental health advocacy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="font-semibold mb-2">Mental Health Professionals</h3>
                  <p className="text-sm">Join our directory to help more people find the support they need</p>
                </div>
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">🏢</div>
                  <h3 className="font-semibold mb-2">Organizations</h3>
                  <p className="text-sm">Partner with us to expand mental health resources and awareness</p>
                </div>
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="font-semibold mb-2">Community Members</h3>
                  <p className="text-sm">Share feedback, suggest improvements, or help spread awareness</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="mb-12">
          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary">Contact Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:elysium.mcare@gmail.com" className="text-primary hover:text-primary-hover">
                      elysium.mcare@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a href="https//wa.me/6281323931225" className="text-primary hover:text-primary-hover">
                      +62-813-2393-1225
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Follow us on Instagram</h3>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <p className="text-muted-foreground mb-4">
                    Stay updated with our latest resources and mental health tips
                  </p>
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

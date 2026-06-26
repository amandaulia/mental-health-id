import { AlertTriangle, MapPin, ExternalLink, Pill } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";

interface Pharmacy {
  name: string;
  description: string;
  city: string;
  website?: string;
  tags?: string[];
}

const pharmacies: Pharmacy[] = [
  {
    name: "Kimia Farma",
    description:
      "National pharmacy chain with broad availability of psychiatric medications across most cities in Indonesia.",
    city: "Nationwide",
    website: "https://www.kimiafarmaapotek.co.id/",
    tags: ["Chain", "Nationwide"],
  },
  {
    name: "Apotek K-24",
    description:
      "24-hour pharmacy chain that commonly stocks antidepressants, anxiolytics, and antipsychotics.",
    city: "Nationwide",
    website: "https://www.k24klik.com/",
    tags: ["Chain", "24 hours"],
  },
  {
    name: "Century Healthcare",
    description:
      "Pharmacy and health store chain found in major malls; carries common psychiatric prescriptions.",
    city: "Nationwide",
    website: "https://century-healthcare.co.id/",
    tags: ["Chain"],
  },
  {
    name: "Guardian Pharmacy",
    description:
      "Health and beauty retailer with pharmacy counters in major cities for prescription fulfillment.",
    city: "Nationwide",
    website: "https://www.guardian.co.id/",
    tags: ["Chain"],
  },
];

const Pharmacies = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO
        pageKey="pharmacies"
        path="/pharmacies"
        title="Pharmacies for Psychiatric Medication"
        description="Pharmacies in Indonesia that dispense psychiatric medication. A valid prescription from a licensed doctor is always required."
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Pharmacies</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Pharmacies in Indonesia known to dispense psychiatric medication such as
          antidepressants, anxiolytics, mood stabilizers, and antipsychotics.
        </p>
      </div>

      <Alert className="mb-8 border-destructive/40 bg-destructive/5">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive">Prescription always required</AlertTitle>
        <AlertDescription>
          Psychiatric medications listed here are prescription-only. Pharmacies will
          not dispense them without a valid, signed prescription from a licensed
          psychiatrist or doctor. Never self-medicate, share medication, or buy
          psychiatric drugs from unverified online sellers.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pharmacies.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {p.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{p.description}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              )}
              {p.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(p.website, "_blank", "noopener,noreferrer")}
                >
                  Visit website
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Stock availability varies by branch. Call ahead to confirm your specific
        medication is in stock before visiting.
      </p>
    </div>
  );
};

export default Pharmacies;
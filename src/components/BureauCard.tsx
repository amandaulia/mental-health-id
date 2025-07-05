
import { Bureau } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

interface BureauCardProps {
  bureau: Bureau;
}

export const BureauCard = ({ bureau }: BureauCardProps) => {
  const getBureauTypeLabel = (type: string) => {
    switch (type) {
      case "independent":
        return "Independent Bureau";
      case "clinic":
        return "Clinic";
      case "faskes1":
        return "Faskes 1";
      case "faskes2":
        return "Faskes 2";
      default:
        return type;
    }
  };

  return (
    <Link to={`/bureau/${bureau.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{bureau.name}</h3>
                  {bureau.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{getBureauTypeLabel(bureau.bureauType)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{bureau.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{bureau.businessHours}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {bureau.insurance.map((ins) => (
                  <Badge key={ins} variant="outline" className="text-xs">
                    {ins === "bpjs" ? "BPJS" : ins === "private" ? "Private Insurance" : "No Insurance"}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

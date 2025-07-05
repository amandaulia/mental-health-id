
import { MessageCircle, Phone, Video, User } from "lucide-react";

interface ModeIconProps {
  mode: string;
}

export const ModeIcon = ({ mode }: ModeIconProps) => {
  switch (mode) {
    case "text":
      return <MessageCircle className="h-4 w-4" />;
    case "voice":
      return <Phone className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "offline":
      return <User className="h-4 w-4" />;
    default:
      return null;
  }
};

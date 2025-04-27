
import { Bell, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header = ({ username, onLogout }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border/50 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-lg font-bold">A</span>
        </div>
        <h1 className="text-xl font-bold text-primary">Arduino Nexus</h1>
        <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
          v1.0.0
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            title="Logout"
          >
            <Power size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

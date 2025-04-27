
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Power } from "lucide-react";
import { getDefaultControlStates, ControlState } from "../utils/mockData";
import { useToast } from "../hooks/use-toast";

const ControlCard = () => {
  const [controls, setControls] = useState<ControlState[]>(getDefaultControlStates());
  const { toast } = useToast();

  const handleToggle = (id: number) => {
    setControls(prevControls => 
      prevControls.map(control => 
        control.id === id ? { ...control, isActive: !control.isActive } : control
      )
    );
    
    const control = controls.find(c => c.id === id);
    if (control) {
      const newState = !control.isActive;
      toast({
        title: `${control.name} ${newState ? 'Activated' : 'Deactivated'}`,
        description: `The ${control.name.toLowerCase()} is now ${newState ? 'ON' : 'OFF'}`,
        variant: newState ? "default" : "destructive",
      });
    }
  };

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Power className="mr-2 text-primary" size={18} />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {controls.map((control) => (
            <div 
              key={control.id} 
              className="flex items-center justify-between p-3 rounded-md bg-background/30 border border-border/30"
            >
              <Label 
                htmlFor={`control-${control.id}`} 
                className="cursor-pointer flex-1"
              >
                {control.name}
              </Label>
              <div className="flex items-center">
                <div 
                  className={`w-2 h-2 rounded-full mr-3 ${
                    control.isActive ? "bg-success animate-pulse" : "bg-destructive"
                  }`}
                />
                <Switch
                  id={`control-${control.id}`}
                  checked={control.isActive}
                  onCheckedChange={() => handleToggle(control.id)}
                  className="data-[state=checked]:bg-success"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          All controls respond instantly
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlCard;

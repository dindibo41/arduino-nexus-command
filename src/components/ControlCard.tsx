
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Power } from "lucide-react";
import { getDefaultControlStates, ControlState } from "../utils/mockData";
import { useToast } from "@/hooks/use-toast";
import useSonarStore from "@/utils/sonarState";
import SonarSafetyDialog from "./SonarSafetyDialog";

const ControlCard = () => {
  // Replace the initial controls to remove Main Relay and reorder them
  const [controls, setControls] = useState<ControlState[]>([
    { id: 1, name: "Cooling Fan", isActive: false },
    { id: 4, name: "Transducer", isActive: false },
    { id: 2, name: "Navigation Lights", isActive: false },
    { id: 3, name: "Emergency Beacon", isActive: false }
  ]);
  
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<number | null>(null);
  const { toast } = useToast();
  const { isSonarActive, isDeactivating } = useSonarStore();

  const isSonarControl = (id: number) => {
    return id === 1 || id === 4; // Cooling fan and Transducer
  };

  const handleToggle = (id: number) => {
    const control = controls.find(c => c.id === id);
    if (!control) return;

    const newState = !control.isActive;

    // If trying to deactivate sonar-related controls while sonar is active
    if (isSonarControl(id) && !newState && isSonarActive) {
      toast({
        title: "Warning",
        description: "Cannot deactivate while sonar is running",
        variant: "destructive",
      });
      return;
    }

    // If turning off a sonar-related component
    if (isSonarControl(id) && control.isActive) {
      setPendingToggle(id);
      setShowWarningDialog(true);
      return;
    }

    updateControl(id, newState);
  };

  const updateControl = (id: number, newState: boolean) => {
    setControls(prevControls => 
      prevControls.map(control => 
        control.id === id ? { ...control, isActive: newState } : control
      )
    );
    
    const control = controls.find(c => c.id === id);
    if (control) {
      toast({
        title: `${control.name} ${newState ? 'Activated' : 'Deactivated'}`,
        description: `The ${control.name.toLowerCase()} is now ${newState ? 'ON' : 'OFF'}`,
        variant: newState ? "default" : "destructive",
      });
    }
  };

  // Effect to sync sonar-related controls
  useEffect(() => {
    if (isSonarActive) {
      setControls(prev => 
        prev.map(control => 
          isSonarControl(control.id) ? { ...control, isActive: true } : control
        )
      );
    } else if (isDeactivating) {
      // Do nothing during deactivation phase
    } else {
      // When sonar is fully deactivated, also deactivate related controls
      setControls(prev => 
        prev.map(control => 
          isSonarControl(control.id) ? { ...control, isActive: false } : control
        )
      );
    }
  }, [isSonarActive, isDeactivating]);

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
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

        <SonarSafetyDialog
          open={showWarningDialog}
          onOpenChange={setShowWarningDialog}
          onConfirm={() => {
            if (pendingToggle !== null) {
              updateControl(pendingToggle, false);
              setPendingToggle(null);
            }
          }}
          title="Warning"
          description="This action can potentially harm the sonar functionality. Do you wish to continue?"
        />
      </CardContent>
    </Card>
  );
};

export default ControlCard;

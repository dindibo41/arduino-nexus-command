
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar, ToggleLeft } from "lucide-react";
import { generateSonarPoint } from "../utils/mockData";
import { useToast } from "@/hooks/use-toast";
import SonarSafetyDialog from "./SonarSafetyDialog";
import useSonarStore from "@/utils/sonarState";

const SonarCard = () => {
  const [angle, setAngle] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number; active: boolean; id: number }[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const pointIdCounter = useRef(0);
  const { toast } = useToast();

  const {
    isSonarActive,
    isDeactivating,
    isInitializing,
    showSafetyWarning,
    setShowSafetyWarning,
    toggleSonar,
  } = useSonarStore();

  const polarToCartesian = useCallback((angle: number, distance: number, maxRadius: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    const x = 0.5 + (distance / 100) * Math.cos(radians) * 0.5;
    const y = 1 - (distance / 100) * Math.sin(radians) * 0.5;
    
    return { x: x * maxRadius, y: y * maxRadius };
  }, []);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    
    if (deltaTime > 30 && isSonarActive) {
      previousTimeRef.current = time;
      
      setAngle((prevAngle) => {
        const newAngle = prevAngle + 1;
        
        if (newAngle >= 180) {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
              console.log("Audio play was prevented");
            });
          }
          return 0;
        }
        
        return newAngle;
      });
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isSonarActive]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    if (!containerRef.current || !isSonarActive) return;
    
    const maxRadius = containerRef.current.clientWidth;
    const { distance } = generateSonarPoint(angle);
    
    if (distance < 80) {
      const { x, y } = polarToCartesian(angle, distance, maxRadius);
      const newPoint = { x, y, active: true, id: pointIdCounter.current++ };
      setPoints(prev => {
        const filtered = prev.filter(p => p.id !== newPoint.id && p.x !== x && p.y !== y);
        return filtered.concat(newPoint);
      });
      
      setTimeout(() => {
        setPoints(prev => 
          prev.filter(p => p.id !== newPoint.id)
        );
      }, 2000);
    }
  }, [angle, polarToCartesian, isSonarActive]);

  const handleToggle = async () => {
    if (!isSonarActive && showSafetyWarning) {
      setShowConfirmDialog(true);
    } else {
      await toggleSonar(!isSonarActive);
      handleStatusChange(!isSonarActive);
    }
  };

  const handleConfirmToggle = async () => {
    setShowConfirmDialog(false);
    await toggleSonar(true);
    handleStatusChange(true);
  };

  const handleStatusChange = (newState: boolean) => {
    if (newState) {
      toast({
        title: "Activating sonar...",
        description: "Please wait while the system initializes",
      });
      
      setTimeout(() => {
        toast({
          title: "Sonar activated",
          description: "System is now operational",
        });
      }, 2000);
    } else {
      toast({
        title: "Sonar deactivated",
        description: "System is now in standby mode",
      });
    }
  };

  const getStatusColor = () => {
    if (isInitializing) return "bg-yellow-500/20 text-yellow-500";
    if (isDeactivating) return "bg-yellow-500/20 text-yellow-500";
    return isSonarActive
      ? "bg-success/20 text-success"
      : "bg-destructive/20 text-destructive";
  };

  const getStatusText = () => {
    if (isInitializing) return "Initializing...";
    if (isDeactivating) return "Deactivating...";
    return isSonarActive ? "Active" : "Standby";
  };

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <Radar className="mr-2 text-primary" size={18} />
            Proximity Sonar
          </CardTitle>
          <div className="flex items-center gap-2">
            <div 
              className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}
            >
              {getStatusText()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              disabled={isDeactivating || isInitializing}
            >
              <ToggleLeft className={`mr-2 ${isSonarActive ? "text-success" : "text-destructive"}`} />
              {isSonarActive ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pb-6">
        <div 
          ref={containerRef} 
          className="w-full aspect-square rounded-full bg-background/50 relative overflow-hidden border border-border/30"
        >
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="absolute rounded-full border border-border/30" 
              style={{
                width: `${i * 25}%`,
                height: `${i * 25}%`,
                left: `${50 - (i * 12.5)}%`,
                top: `${50 - (i * 12.5)}%`
              }}
            />
          ))}
          
          {[0, 30, 60, 90, 120, 150, 180].map((lineAngle) => (
            <div 
              key={lineAngle} 
              className="absolute bottom-0 left-1/2 origin-bottom border-l border-border/30" 
              style={{
                height: '50%',
                transform: `rotate(${lineAngle - 90}deg)`
              }}
            />
          ))}
          
          <div 
            className="sonar-sweep absolute bottom-0 left-1/2 h-1/2 w-[2px] bg-success"
            style={{
              transform: `rotate(${angle - 90}deg)`,
              boxShadow: '0 0 10px hsl(var(--success)), 0 0 20px hsl(var(--success))',
              opacity: isSonarActive ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          
          {points.map(point => (
            <div
              key={point.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: point.x,
                top: point.y,
                backgroundColor: 'hsl(var(--success))',
                boxShadow: '0 0 8px hsl(var(--success))',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 flex justify-between">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
        </div>
        
        <audio ref={audioRef} src="/ping.mp3" preload="auto" />

        <SonarSafetyDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmToggle}
          showDontAskOption={true}
          onDontAskAgainChange={(checked) => setShowSafetyWarning(!checked)}
          title="Activate Sonar System"
          description="This action will automatically turn on the cooling fan and the transducer. Do you want to proceed?"
        />
      </CardContent>
    </Card>
  );
};

export default SonarCard;


import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar } from "lucide-react";
import { generateSonarPoint } from "../utils/mockData";
import { useToast } from "@/hooks/use-toast";

const SonarCard = () => {
  const [angle, setAngle] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number; active: boolean; id: number }[]>([]);
  const [isSweeping, setIsSweeping] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const pointIdCounter = useRef(0);
  const { toast } = useToast();

  // Function to convert polar coordinates (angle, distance) to Cartesian (x, y)
  const polarToCartesian = useCallback((angle: number, distance: number, maxRadius: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    const x = 0.5 + (distance / 100) * Math.cos(radians) * 0.5;
    const y = 1 - (distance / 100) * Math.sin(radians) * 0.5;
    
    return { x: x * maxRadius, y: y * maxRadius };
  }, []);

  // Animation loop
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    
    if (deltaTime > 30 && isSweeping) {
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
  }, [isSweeping]);

  // Effect for animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  // Effect to add points based on current angle
  useEffect(() => {
    if (!containerRef.current || !isSweeping) return;
    
    const maxRadius = containerRef.current.clientWidth;
    const { distance } = generateSonarPoint(angle);
    
    if (distance < 80) {
      const { x, y } = polarToCartesian(angle, distance, maxRadius);
      
      const newPoint = { x, y, active: true, id: pointIdCounter.current++ };
      setPoints(prev => prev.filter(p => p.id !== newPoint.id).concat(newPoint));
      
      setTimeout(() => {
        setPoints(prev => 
          prev.filter(p => p.id !== newPoint.id)
        );
      }, 2000);
    }
  }, [angle, polarToCartesian, isSweeping]);

  const toggleSweep = async () => {
    if (!isSweeping) {
      setIsActivating(true);
      toast({
        title: "Activating sonar...",
        description: "Please wait while the system initializes",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSweeping(true);
      setIsActivating(false);
      
      toast({
        title: "Sonar activated",
        description: "System is now operational",
      });
    } else {
      setIsSweeping(false);
      setPoints([]);
      toast({
        title: "Sonar deactivated",
        description: "System is now in standby mode",
      });
    }
  };

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <Radar className="mr-2 text-primary" size={18} />
            Proximity Sonar
          </CardTitle>
          <div 
            className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
              isActivating 
                ? "bg-yellow-500/20 text-yellow-500"
                : isSweeping 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
            }`}
            onClick={!isActivating ? toggleSweep : undefined}
            role="button"
          >
            {isActivating ? "Initializing..." : isSweeping ? "Active" : "Standby"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pb-6">
        <div 
          ref={containerRef} 
          className="w-full aspect-square rounded-full bg-background/50 relative overflow-hidden border border-border/30"
        >
          {/* Grid lines */}
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
          
          {/* Angle lines */}
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
          
          {/* Sonar sweep line */}
          <div 
            className="sonar-sweep absolute bottom-0 left-1/2 h-1/2 w-[2px] bg-success"
            style={{
              transform: `rotate(${angle - 90}deg)`,
              boxShadow: '0 0 10px hsl(var(--success)), 0 0 20px hsl(var(--success))',
              opacity: isSweeping ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          
          {/* Detected points */}
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
      </CardContent>
    </Card>
  );
};

export default SonarCard;

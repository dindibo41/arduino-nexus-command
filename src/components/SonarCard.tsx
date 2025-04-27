
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar } from "lucide-react";
import { generateSonarPoint } from "../utils/mockData";

const SonarCard = () => {
  const [angle, setAngle] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number; active: boolean; id: number }[]>([]);
  const [isSweeping, setIsSweeping] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const pointIdCounter = useRef(0);

  // Function to convert polar coordinates (angle, distance) to Cartesian (x, y)
  const polarToCartesian = useCallback((angle: number, distance: number, maxRadius: number) => {
    // Convert angle from degrees to radians and adjust for the 180-degree sweep
    const radians = (angle - 90) * (Math.PI / 180);
    // Calculate x and y positions (normalized to 0-1)
    const x = 0.5 + (distance / 100) * Math.cos(radians) * 0.5;
    const y = 1 - (distance / 100) * Math.sin(radians) * 0.5;
    
    return { 
      x: x * maxRadius, 
      y: y * maxRadius 
    };
  }, []);

  // Animation loop
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    
    if (deltaTime > 30 && isSweeping) { // Update every 30ms
      previousTimeRef.current = time;
      
      // Calculate new angle (0-180 degrees)
      setAngle((prevAngle) => {
        const newAngle = prevAngle + 1;
        
        // If we've completed a full sweep
        if (newAngle >= 180) {
          // Play ping sound
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
              // Handle any autoplay restrictions
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
    if (!containerRef.current) return;
    
    const maxRadius = containerRef.current.clientWidth;
    const { distance } = generateSonarPoint(angle);
    
    if (distance < 80) { // Only add points for objects within range
      const { x, y } = polarToCartesian(angle, distance, maxRadius);
      
      // Add a new point
      const newPoint = { 
        x, 
        y, 
        active: true, 
        id: pointIdCounter.current++
      };
      
      setPoints(prev => [...prev, newPoint]);
      
      // Set timeout to deactivate the point
      setTimeout(() => {
        setPoints(prev => 
          prev.map(p => p.id === newPoint.id ? { ...p, active: false } : p)
        );
        
        // Remove inactive points after they fade out to avoid memory issues
        setTimeout(() => {
          setPoints(prev => prev.filter(p => p.id !== newPoint.id));
        }, 5000);
      }, 2000);
    }
  }, [angle, polarToCartesian]);

  const toggleSweep = () => {
    setIsSweeping(prev => !prev);
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
            className={`px-2 py-1 text-xs rounded-full ${isSweeping 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"}`}
            onClick={toggleSweep}
            role="button"
          >
            {isSweeping ? "Active" : "Paused"}
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
            className="sonar-sweep absolute bottom-0 left-1/2 h-1/2 w-[2px] bg-primary/80"
            style={{
              transform: `rotate(${angle - 90}deg)`,
              boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))'
            }}
          />
          
          {/* Detected points */}
          {points.map(point => (
            <div
              key={point.id}
              className={`radar-point ${point.active ? 'active' : ''}`}
              style={{
                left: point.x,
                top: point.y,
                backgroundColor: point.active ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)',
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

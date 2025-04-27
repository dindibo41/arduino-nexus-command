
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryMedium, Clock, Settings } from "lucide-react";

const DiagnosticsCard = () => {
  const [uptime, setUptime] = useState(5247);
  const [voltage, setVoltage] = useState(5.5);
  const baudRate = 115200;

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      setVoltage(prev => {
        const newVoltage = prev + (Math.random() * 0.2 - 0.1);
        return Math.min(Math.max(newVoltage, 4.9), 6.2);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getVoltageColor = (v: number) => {
    if (v < 5.0) return "text-destructive";
    if (v > 6.0) return "text-yellow-500";
    return "text-success";
  };

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Settings className="mr-2 text-primary" size={18} />
          System Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Voltage Reading */}
          <div className="bg-background/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BatteryMedium size={24} />
              <span>System Voltage</span>
            </div>
            <span className={`font-mono text-lg ${getVoltageColor(voltage)}`}>
              {voltage.toFixed(1)}V
            </span>
          </div>
          
          {/* Uptime */}
          <div className="bg-background/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={24} />
              <span>Uptime</span>
            </div>
            <span className="font-mono text-lg">
              {formatUptime(uptime)}
            </span>
          </div>
          
          {/* Baud Rate */}
          <div className="bg-background/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={24} />
              <span>Baud Rate</span>
            </div>
            <span className="font-mono text-lg">
              {baudRate.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticsCard;

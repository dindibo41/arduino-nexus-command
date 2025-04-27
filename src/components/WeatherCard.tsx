
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Wind, Humidity, Sun } from "lucide-react";
import { generateWeatherData, WeatherData } from "../utils/mockData";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(generateWeatherData());
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateWeatherData();
      setWeatherData(newData);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper to determine temperature color
  const getTempColor = (temp: number) => {
    if (temp < 15) return "text-blue-400";
    if (temp > 30) return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <Card className="tech-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Thermometer className="mr-2 text-primary" size={18} />
          Weather Station
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Temperature Reading */}
          <div className="bg-background/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className={getTempColor(weatherData.temperature)} size={24} />
            </div>
            <div className={`text-2xl font-bold ${getTempColor(weatherData.temperature)}`}>
              {weatherData.temperature}°C
            </div>
            <div className="text-xs text-muted-foreground mt-1">Temperature</div>
          </div>
          
          {/* Humidity Reading */}
          <div className="bg-background/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
              <Humidity className="text-blue-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {weatherData.humidity}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Humidity</div>
          </div>
          
          {/* Barometric Pressure */}
          <div className="bg-background/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
              <Wind className="text-gray-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-400">
              {weatherData.pressure}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Pressure (hPa)</div>
          </div>
          
          {/* Light Intensity */}
          <div className="bg-background/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
              <Sun className="text-yellow-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {weatherData.light}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Light (lux)</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;

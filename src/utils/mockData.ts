
export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
}

export interface ControlState {
  id: number;
  name: string;
  isActive: boolean;
}

export interface SonarPoint {
  angle: number;
  distance: number;
}

// Generate random weather data within sensible ranges
export const generateWeatherData = (): WeatherData => {
  return {
    temperature: parseFloat((Math.random() * 30 + 10).toFixed(1)), // 10-40°C
    humidity: parseFloat((Math.random() * 60 + 20).toFixed(1)),    // 20-80%
    pressure: parseFloat((Math.random() * 20 + 990).toFixed(1)),   // 990-1010 hPa
    light: Math.floor(Math.random() * 1000),                       // 0-1000 lux
  };
};

// Generate default control states
export const getDefaultControlStates = (): ControlState[] => {
  return [
    { id: 1, name: "Main Relay", isActive: false },
    { id: 2, name: "Pump Motor", isActive: false },
    { id: 3, name: "LED Strip", isActive: false },
    { id: 4, name: "Cooling Fan", isActive: false },
    { id: 5, name: "Auxiliary", isActive: false },
  ];
};

// Generate a point for the sonar visualization based on the angle
export const generateSonarPoint = (angle: number): SonarPoint => {
  // Generate a random distance (0-100), with some smoothing to make it look more natural
  const noiseLevel = 30; // How much the signal fluctuates
  const baseDistance = 60; // Base distance
  const distance = Math.max(0, Math.min(100, 
    baseDistance + (Math.sin(angle * 0.1) * 20) + (Math.random() * noiseLevel - noiseLevel/2)
  ));
  
  return { angle, distance };
};


import Header from "./Header";
import SonarCard from "./SonarCard";
import WeatherCard from "./WeatherCard";
import ControlCard from "./ControlCard";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header username={username} onLogout={onLogout} />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sonar Card */}
          <div className="lg:col-span-1">
            <SonarCard />
          </div>
          
          {/* Weather Station Card */}
          <div className="lg:col-span-1">
            <WeatherCard />
          </div>
          
          {/* Control Panel Card */}
          <div className="lg:col-span-1">
            <ControlCard />
          </div>
        </div>
        
        <footer className="mt-8 text-xs text-center text-muted-foreground">
          <p>Arduino Nexus Command System &copy; 2025</p>
          <p className="mt-1">Ready to connect to real Arduino devices</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

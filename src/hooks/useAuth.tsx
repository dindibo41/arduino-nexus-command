
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";

interface User {
  username: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User>(() => {
    // Check if user is already authenticated in sessionStorage
    const savedUser = sessionStorage.getItem("arduinoUser");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return { username: "", isAuthenticated: false };
  });
  
  const { toast } = useToast();

  // Update sessionStorage when user changes
  useEffect(() => {
    if (user.isAuthenticated) {
      sessionStorage.setItem("arduinoUser", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("arduinoUser");
    }
  }, [user]);

  const login = (username: string, password: string) => {
    // Hardcoded credentials check
    if (username === "Admin" && password === "Aa123456") {
      setUser({ username, isAuthenticated: true });
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}`,
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser({ username: "", isAuthenticated: false });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return {
    user,
    login,
    logout,
  };
}


import { useAuth } from "../hooks/useAuth";
import AuthScreen from "../components/AuthScreen";
import Dashboard from "../components/Dashboard";

const Index = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user.isAuthenticated ? (
        <Dashboard username={user.username} onLogout={logout} />
      ) : (
        <AuthScreen onLogin={login} />
      )}
    </div>
  );
};

export default Index;

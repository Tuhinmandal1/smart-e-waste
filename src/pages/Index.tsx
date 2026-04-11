import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import { Recycle } from "lucide-react";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Recycle className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

export default Index;

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { Auth } from "./Pages/Auth/Auth";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
}

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem", fontSize: "1.5rem" }}>
      Welcome to Dashboard!
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("access_token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default App;

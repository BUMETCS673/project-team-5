import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

// ProtectedRoute is a component that ensures user authentication before rendering its children.
// It provides a simple way to protect routes and restrict access to authenticated users.
function ProtectedRoute({ children }) {
  const { username } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      // User is not logged in, navigate to the login page
      navigate("/login");
    }
  }, [username, navigate]);

  return children;
}

export default ProtectedRoute;

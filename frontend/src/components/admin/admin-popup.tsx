import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";

// Login Popup Component
const LoginPopup = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        onLogin(); 
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Login Required</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Access Denied Popup Component
const AccessDeniedPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          You don't have the required permissions to access this area. This
          section is restricted to administrators only.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { _id, role, initialized } = useProfile();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAccessDeniedPopup, setShowAccessDeniedPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (initialized) {
      checkAuthorization();
    } else {
      const timer = setTimeout(() => {
        checkAuthorization();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialized, _id, role]);

  const checkAuthorization = () => {
    setLoading(false);

    if (!_id) {
      setShowLoginPopup(true);
      return;
    }

    if (role !== "admin" && role !== "super_admin") {
      setShowAccessDeniedPopup(true);
      return;
    }

    setAuthorized(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    // Re-check authorization after successful login
    const { _id, role } = useProfile.getState();

    if (!_id) {
      setShowLoginPopup(true);
      return;
    }

    if (role !== "admin" && role !== "super_admin") {
      setShowAccessDeniedPopup(true);
      return;
    }

    setAuthorized(true);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {authorized ? children : <div className="min-h-screen"></div>}

      {showLoginPopup && (
        <LoginPopup onClose={handleGoBack} onLogin={handleLoginSuccess} />
      )}

      {showAccessDeniedPopup && <AccessDeniedPopup onClose={handleGoBack} />}
    </>
  );
};

export default ProtectedAdminRoute;

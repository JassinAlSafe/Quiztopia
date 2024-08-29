import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(
      "Attempting to log in with username",
      username,
      "and password",
      password
    );

    if (!username || !password) {
      setError("Username and password are required");
      console.log("Error: Username and password are required");
      return;
    }

    try {
      // Call the API to log in
      console.log("Sending API request to log in...");
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("API response", response);

      if (response.ok && data.success) {
        console.log("Login successful, token:", data);
        sessionStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        console.log("Login failed", data);
        throw new Error("Failed to log in. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <h2 className="mb-4 text-xl font-bold text-center">
          Welcome to Quiztopia
        </h2>
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          Don't have an account?{" "}
          <button
            onClick={handleSignupRedirect}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Home;

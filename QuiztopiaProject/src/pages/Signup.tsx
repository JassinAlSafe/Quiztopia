import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with username", username, "and password", password);

    if (!username || !password) {
      setError("Username and password are required");
      console.log("Error: Username and password are required");
      return;
    }

    try {
      // Call the API to create a new account
      console.log("Calling API to create account");
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      console.log("API response", response);
      const data = await response.json();
      console.log("API data", data);

      if (response.ok && data.success) {
        setSuccess(true);
        // Navigate back to home page to log in
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      } else {
        throw new Error("Failed to create account. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <h2 className="mb-4 text-xl font-bold text-center">
          Create a New Account
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm italic mb-4">
              Account created successfully. Redirecting...
            </p>
          )}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

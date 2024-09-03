import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Define the Quiz interface to structure the data properly
interface Quiz {
  quizId: string;
  userId: string;
  questions: Array<{
    question: string;
    answer: string;
    location: {
      longitude: string;
      latitude: string;
    };
  }>;
  username: string;
}

const Dashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // State to store the quizzes
  const [error, setError] = useState<string | null>(null); // State to store any error messages
  const navigate = useNavigate(); // Hook to navigate between routes

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
      if (!token) {
        console.error("No token found in session storage");
        setError("You must be logged in to view this page");
        return;
      }

      try {
        const response = await fetch(
          "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token to the request headers
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch quizzes.");
        }

        const data = await response.json();
        console.log("Fetched quizzes:", data);

        if (data.success && Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        } else {
          console.error("Unexpected data format:", data);
          setError("Unexpected data format received from the server.");
        }
      } catch (err: unknown) {
        console.error("Error fetching quizzes:", (err as Error).message);
        setError((err as Error).message || "Failed to fetch quizzes.");
      }
    };

    fetchQuizzes();
  }, []);

  // Function to delete a quiz
  const handleDeleteQuiz = async (quizId: string) => {
    const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
    if (!token) {
      console.error("No token found in session storage");
      setError("You must be logged in to view this page");
      return;
    }

    try {
      const response = await fetch(
        `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Delete quiz response:", data);

      if (response.ok && data.success) {
        console.log("Quiz deleted successfully", data);
        setQuizzes(quizzes.filter((quiz) => quiz.quizId !== quizId)); // Remove the deleted quiz from the state
      } else {
        console.error("Failed to delete quiz", data);
        setError(data.error || "Failed to delete quiz");
      }
    } catch (err) {
      console.error("Error deleting quiz:", err);
      setError("Failed to delete quiz");
    }
  };

  // Function to navigate to quiz details
  const handleQuizClick = (quizId: string, userId: string) => {
    if (!userId || !quizId) {
      console.error("User ID or Quiz ID is missing");
      return;
    }
    console.log(
      "Navigating to quiz detail with userId:",
      userId,
      "quizId:",
      quizId
    ); // Debugging line
    navigate(`/quiz/${userId}/${quizId}`); // Navigate to quiz detail page
  };

  // Function to navigate to create a new quiz
  const handleCreateQuiz = () => {
    navigate("/create-quiz");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-center">Dashboard</h2>
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={handleCreateQuiz}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-3xl"
          >
            +
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="w-full max-w-2xl">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz.quizId}
                className="bg-white shadow-md rounded p-4 mb-4 cursor-pointer hover:shadow-lg"
              >
                <p className="text-lg font-semibold">Quiz ID: {quiz.quizId}</p>
                <p className="text-sm text-gray-600">
                  Created by: {quiz.username}
                </p>
                <p className="text-sm text-gray-600">
                  Number of Questions: {quiz.questions.length}
                </p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleQuizClick(quiz.quizId, quiz.userId)} // Pass both userId and quizId
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.quizId)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

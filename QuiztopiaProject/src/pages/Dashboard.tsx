import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
}

const Dashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = sessionStorage.getItem("token");
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch quizzes.");
        }

        const data = await response.json();
        console.log("Fetched quizzes:", data);
        setQuizzes(data); // assuming data is an array of quizzes
      } catch (err: unknown) {
        console.error("Error fetching quizzes:", (err as Error).message);
        setError((err as Error).message || "Failed to fetch quizzes.");
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate("/create-quiz");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
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
                onClick={() => handleQuizClick(quiz.quizId)}
              >
                <p className="text-lg font-semibold">Quiz ID: {quiz.quizId}</p>
                <p className="text-sm text-gray-600">
                  Number of Questions: {quiz.questions.length}
                </p>
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

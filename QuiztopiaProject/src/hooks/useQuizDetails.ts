import { useState, useEffect } from "react";
import { fetchQuizDetails } from "../services/quizService";

interface QuizDetailProps {
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

export const useQuizDetails = (
  userId: string | undefined,
  quizId: string | undefined
) => {
  const [quizDetails, setQuizDetails] = useState<QuizDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId || !quizId) {
        setError("User ID or Quiz ID is missing in URL parameters");
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this page");
          setLoading(false);
          return;
        }

        const data = await fetchQuizDetails(userId, quizId, token); // Use the service function
        setQuizDetails(data.quiz);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to fetch quiz details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId, quizId]);

  return { quizDetails, error, loading };
};

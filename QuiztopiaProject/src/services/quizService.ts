export const createQuiz = async (
  quizName: string,
  token: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: quizName }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return data.quizId;
    } else {
      throw new Error(data.error || "Failed to create quiz.");
    }
  } catch (err) {
    console.error("Error creating quiz:", err);
    throw err;
  }
};

interface QuestionProps {
  question: string;
  answer: string;
  coordinates: { lat: number; lng: number };
}

export const addQuestionsToQuiz = async (
  quizName: string,
  questions: QuestionProps[],
  token: string
) => {
  for (const question of questions) {
    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: quizName,
            question: question.question,
            answer: question.answer,
            location: {
              longitude: question.coordinates.lng.toString(),
              latitude: question.coordinates.lat.toString(),
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to add question.");
      }
    } catch (err) {
      console.error("Error adding question:", err);
      throw err;
    }
  }
};

export const fetchQuizDetails = async (
  userId: string,
  quizId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to fetch quiz details.");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching quiz details:", err);
    throw err;
  }
};

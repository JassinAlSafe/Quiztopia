import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { createQuiz, addQuestionsToQuiz } from "../services/quizService"; // Import the service functions
import { useGeolocation } from "../hooks/useGeolocation"; // Import the custom hook for geolocation

// Define the structure for a question's properties
interface QuestionProps {
  question: string;
  answer: string;
  coordinates: { lat: number; lng: number };
}

const CreateQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionProps>({
    question: "",
    answer: "",
    coordinates: { lat: 0, lng: 0 },
  });
  const [quizId, setQuizId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentLocation = useGeolocation(); // Use custom hook for geolocation

  const handleInputChange = (field: keyof QuestionProps, value: string) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCurrentQuestion((prev) => ({ ...prev, coordinates: { lat, lng } }));
  };

  const addQuestionToList = () => {
    if (currentQuestion.question && currentQuestion.answer) {
      setQuestions((prev) => [...prev, currentQuestion]);
      resetCurrentQuestion();
    } else {
      setError("Question and answer are required");
    }
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      question: "",
      answer: "",
      coordinates: { lat: 0, lng: 0 },
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a quiz");
      return;
    }

    try {
      let id = quizId;
      if (!quizId) {
        id = await createQuiz(quizName, token); // Use service function to create quiz
        setQuizId(id);
      }
      if (id) {
        await addQuestionsToQuiz(quizName, questions, token); // Use service function to add questions
        navigate("/dashboard"); // Redirect after adding questions
      }
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        <h2 className="mb-4 text-xl font-bold text-center">
          Create a New Quiz
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          <div className="mb-4">
            <label
              htmlFor="quizName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Quiz Name
            </label>
            <input
              type="text"
              id="quizName"
              placeholder="Quiz Name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Question"
                value={currentQuestion.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="text"
                placeholder="Answer"
                value={currentQuestion.answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mb-6">
            {currentLocation && (
              <div className="h-64 mt-4">
                <MapContainer
                  center={currentLocation}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[currentLocation.lat, currentLocation.lng]}>
                    <Popup>
                      <div
                        style={{
                          backgroundColor: "green",
                          color: "#fff",
                          padding: "10px",
                          borderRadius: "8px",
                          textAlign: "center",
                        }}
                      >
                        <h3 style={{ margin: 0 }}>Your Location</h3>
                      </div>
                    </Popup>
                  </Marker>
                  {currentQuestion.coordinates.lat !== 0 &&
                    currentQuestion.coordinates.lng !== 0 && (
                      <Marker
                        position={[
                          currentQuestion.coordinates.lat,
                          currentQuestion.coordinates.lng,
                        ]}
                      />
                    )}
                  <MapClickHandler onMapClick={handleMapClick} />
                </MapContainer>
              </div>
            )}
          </div>
          <div className="mb-4">
            <button
              type="button"
              onClick={addQuestionToList}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Question
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Quiz
            </button>
          </div>
        </form>
        {questions.length > 0 && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="mb-4 text-lg font-bold">Added Questions:</h3>
            {questions.map((q, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">Question {index + 1}:</p>
                <p>{q.question}</p>
                <p className="text-gray-600">Answer: {q.answer}</p>
                <p className="text-gray-600">
                  Location: Lat {q.coordinates.lat}, Lng {q.coordinates.lng}
                </p>
                <hr className="my-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// MapClickHandler component to handle map clicks and set coordinates
const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default CreateQuiz;

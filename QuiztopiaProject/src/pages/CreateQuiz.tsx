import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";

const CreateQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState<string>(""); // Updated to use "name"
  const [question, setQuestion] = useState<{
    question: string;
    answer: string;
    coordinates: { lat: number; lng: number };
  }>({
    question: "",
    answer: "",
    coordinates: { lat: 0, lng: 0 },
  });
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log(
            "User's location:",
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error("Failed to get user's location", error);
          setCurrentLocation({ lat: 57.7089, lng: 11.9746 }); // Default to Gothenburg
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setCurrentLocation({ lat: 57.7089, lng: 11.9746 });
    }
  }, []);

  const handleQuestionChange = (field: string, value: string) => {
    setQuestion({ ...question, [field]: value });
  };

  const handleMapClick = (lat: number, lng: number) => {
    setQuestion({ ...question, coordinates: { lat, lng } });
  };

  const createQuiz = async () => {
    console.log("Creating quiz with name:", quizName);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      setError("You must be logged in to create a quiz");
      return;
    }

    try {
      const response = await fetch(
        "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: quizName }), // Corrected to use "name"
        }
      );

      const data = await response.json();
      console.log("Quiz creation response:", data);

      if (response.ok && data.success) {
        console.log("Quiz created successfully:", data);
        setQuizId(data.quizId); // Save the quizId to add questions later
        return data.quizId;
      } else {
        console.error("Failed to create quiz:", data.error || "Unknown error");
        setError(data.error || "Failed to create quiz. Please try again.");
      }
    } catch (err) {
      console.error("Error during quiz creation: ", err);
      setError("Failed to create quiz. Please try again.");
    }
  };

  const addQuestionToQuiz = async (quizId: string) => {
    console.log("Adding question to quiz:", quizId);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      setError("You must be logged in to add a question");
      return;
    }

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
            name: quizName, // using name to identify the quiz
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
      console.log("Add question response:", data);

      if (response.ok && data.success) {
        console.log("Question added successfully:", data);
        navigate("/dashboard"); // Redirect after adding the question successfully
      } else {
        console.error("Failed to add question:", data.error || "Unknown error");
        setError(data.error || "Failed to add question. Please try again.");
      }
    } catch (err) {
      console.error("Error during question addition: ", err);
      setError("Failed to add question. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quizId = await createQuiz(); // Create the quiz first

    if (quizId) {
      await addQuestionToQuiz(quizId); // If quiz creation is successful, add questions
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
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange("question", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <input
                type="text"
                placeholder="Answer"
                value={question.answer}
                onChange={(e) => handleQuestionChange("answer", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mb-6">
            {/* Display the map once the current location is set */}
            {currentLocation && (
              <div className="h-64 mt-4">
                <MapContainer
                  center={currentLocation}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {question.coordinates.lat !== 0 &&
                    question.coordinates.lng !== 0 && (
                      <Marker
                        position={[
                          question.coordinates.lat,
                          question.coordinates.lng,
                        ]}
                      ></Marker>
                    )}
                  <MapClickHandler onMapClick={handleMapClick} />
                </MapContainer>
              </div>
            )}
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
      console.log(`Map clicked at coordinates:`, e.latlng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default CreateQuiz;

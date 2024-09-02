import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useQuizDetails } from "../hooks/useQuizDetails";

const QuizDetail: React.FC = () => {
  const { id: quizId, userId } = useParams<{ id: string; userId: string }>(); // Ensure both userId and quizId are correctly extracted
  const { quizDetails, error, loading } = useQuizDetails(userId, quizId);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {error}
      </div>
    );
  }

  if (!quizDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        No quiz details available.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold text-center">Quiz Details</h2>

        {/* Display Map */}
        <div className="h-64 w-full mb-4">
          <MapContainer
            center={[
              parseFloat(quizDetails.questions[0].location.latitude),
              parseFloat(quizDetails.questions[0].location.longitude),
            ]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {quizDetails.questions.map((q, index) => (
              <Marker
                key={index}
                position={[
                  parseFloat(q.location.latitude),
                  parseFloat(q.location.longitude),
                ]}
              >
                <Popup>
                  <div>
                    <strong>Question:</strong> {q.question}
                    <br />
                    <strong>Answer:</strong> {q.answer}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Display Questions */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {quizDetails.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold">Question {index + 1}:</p>
              <p>{q.question}</p>
              <p className="text-gray-600">Answer: {q.answer}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;

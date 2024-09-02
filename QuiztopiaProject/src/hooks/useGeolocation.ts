import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocation({ lat: 57.7089, lng: 11.9746 }); // Default to Gothenburg if location retrieval fails
        }
      );
    } else {
      setLocation({ lat: 57.7089, lng: 11.9746 });
    }
  }, []);

  return location;
};

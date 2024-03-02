import axios from "axios";

export const createEvent = async (formData, user) => {
  const SERVER = import.meta.env.VITE_SERVER;
  const date = new Date(formData.date);
  const time = new Date(formData.time);
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
  const data = {
    title: formData.title,
    description: formData.description,
    date: { start: dateTime, end: "" },
    location: { description: formData.location, lat: 0, long: 0 },
    participants: formData.participants,
    picture: formData.image,
    owner: user._id,
  };

  try {
    const response = await axios.post(`${SERVER}/events`, data);
  } catch (error) {
    console.error(error);
  }
};

export const fetchUserEvents = async (setUserEvents, token) => {
  const SERVER = import.meta.env.VITE_SERVER;
  try {
    const response = await axios.get(`${SERVER}/events`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setUserEvents(response.data);
  } catch (error) {
    console.log(error);
  }
};

export const getEvent = async (
  eventId,
  token,
  setEventData,
  setLoading,
  setBackgroundImage
) => {
  const SERVER = import.meta.env.VITE_SERVER;
  try {
    setLoading(true);
    const response = await axios.get(`${SERVER}/events/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setEventData(response.data);
    setBackgroundImage(response.data.picture.url);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const addParticipant = async (
  participantId,
  token,
  eventId,
  setEventData
) => {
  const SERVER = import.meta.env.VITE_SERVER;
  console.log("addParticipant", participantId, token, eventId);
  try {
    const response = await axios.put(
      `${SERVER}/events/${eventId}/participants/add`,
      { participant: participantId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("participants", response.data);
    setEventData((prev) => ({ ...prev, participants: response.data }));
  } catch (error) {
    console.log(error);
  }
};

export const removeParticipant = async (
  participantId,
  token,
  eventId,
  setEventData
) => {
  const SERVER = import.meta.env.VITE_SERVER;
  try {
    const response = await axios.put(
      `${SERVER}/events/${eventId}/participants/remove`,
      { participant: participantId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("participants", response.data);
    setEventData((prev) => ({ ...prev, participants: response.data }));
  } catch (error) {
    console.log(error);
  }
};

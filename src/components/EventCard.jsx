import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { convertDate } from "../utils/convertDate.js";
import MailboxIcon from "./MailboxIcon";

//STYLES
import "../styles/infobox.css";

const EventCard = ({
  date,
  title,
  location,
  picture,
  host,
  hostImg,
  eventId,
}) => {
  const [start, setStart] = useState({});
  const [end, setEnd] = useState({});
  const today = new Date();
  const { user } = useAuth();

  useEffect(() => {
    setStart(convertDate(date.start));
    setEnd(convertDate(date.end));
  }, []);

  return (
    <>
      <div className="time-infobox">
        <div className="time-grid-container">
          <div className="time-date">
            <p className="day">{start.day}</p>
            <p>{start.month}</p>
          </div>
          <div className="time-center">
            <p className="day">{start.weekday}</p>
            <p>
              {start.hours}:{start.minutes}
              {date.end ? ` – ${end.hours}:${end.minutes}` : null}
            </p>
          </div>
          {host ? (
            <div className="host-img">
              <img
                style={{ height: "90px", width: "90px" }}
                src={hostImg}
                alt="host"
              />
            </div>
          ) : (
            <MailboxIcon eventId={eventId} />
          )}
        </div>
        {location && title ? (
          <div
            className="event-image"
            style={{ backgroundImage: `url(${picture})` }}
          >
            <div className="description">
              <p className="title">{title}</p>
              <p>{location.description}</p>
              {user.name === host && new Date(date.start) < today ? (
                <p className="host">You were the host.</p>
              ) : user.name === host ? (
                <p className="host">You are the host!</p>
              ) : (
                <p className="host">Host: {host}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default EventCard;

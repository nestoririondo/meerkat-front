import { Modal, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import "../styles/participants.css";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { getUserNames } from "../api/users.js";
import {
  inviteParticipant,
  removeParticipant,
  getInvitations,
} from "../api/events.js";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { emailInvitation } from "../api/events.js";
import LeaveEvent from "./LeaveEvent.jsx";

const Participants = ({ open, setOpen, setEventData, eventData }) => {
  const { user, token } = useAuth();
  const [contactsFilter, setContactsFilter] = useState({});
  const [contacts, setContacts] = useState({});
  const [invitations, setInvitations] = useState(null);
  const [emailInvitationMessage, setEmailInvitationMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const style = {
    backgroundColor: "white",
    height: "100vh",
    overflow: "scroll",
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = (e) => {
    const participantId = e.target.id;
    inviteParticipant(participantId, token, eventData._id, setInvitations);
  };

  const handleRemove = async (e) => {
    const participantId = e.target.id;
    removeParticipant(participantId, token, eventData._id, setEventData);
  };

  const filterContacts = () => {
    const filteredContacts = user.contacts.filter(
      (contact) =>
        !eventData.participants.some(
          (participant) => participant._id === contact
        )
    );
    setContactsFilter(filteredContacts);
  };

  const handleEmailInvitation = (e) => {
    e.preventDefault();
    setEmailInvitationMessage(`Invitation sent to ${e.target[0].value}!`);
    emailInvitation(e.target[0].value, eventData._id, token);
    setEmailInput("");
    setTimeout(() => {
      setEmailInvitationMessage("");
    }, 3000);
  };

  const handleChangeEmail = (e) => {
    setEmailInput(e.target.value);
  };
  
  useEffect(() => {
    filterContacts();
    getInvitations(eventData._id, token, setInvitations);
  }, [eventData]);

  useEffect(() => {
    getUserNames(contactsFilter, token, setContacts);
  }, [contactsFilter]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={style}>
            <div className="participant-modal">
              <div className="header">
                <h2>{eventData.title}</h2>
                <div className="button-container">
                  <Button
                    className="btn-close"
                    onClick={handleClose}
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "rgba(241, 241, 241)",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      minWidth: "0 !important",
                    }}
                  >
                    <IoIosClose style={{ fontSize: "1.25rem" }} />
                  </Button>
                </div>
              </div>
              {eventData.participants.length === 0 &&
              Object.keys(contacts).length === 0 &&
              invitations === null ? (
                <>
                  <h2 className="event-heading">No friends to add</h2>
                  <p className="all-invited">
                    Add friends from your Profile view, then invite them to the
                    event.
                  </p>
                  <div className="btn-center">
                    <Button class="btn-grey ">
                      <Link to="/profile">To Your Profile</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <h2 className="event-heading">Participants</h2>
                  <section className="participant-modal">
                    <div
                      className="participant-container"
                      key={eventData.owner._id}
                    >
                      <img
                        className="profile-small"
                        src={eventData.owner.picture.url}
                        alt=""
                      />
                      {eventData.owner.name === user.name ? (
                        <div>You (host)</div>
                      ) : (
                        <div>{eventData.owner.name} (host)</div>
                      )}
                    </div>

                    {eventData.participants.length > 0 ? (
                      eventData.participants.map((participant) => (
                        <div
                          className="participant-container"
                          key={participant._id}
                        >
                          <img
                            className="profile-small"
                            src={participant.picture.url}
                            alt=""
                          />
                          <div>{participant.name}</div>
                          {participant._id === user._id &&
                            eventData.owner._id !== user._id && (
                              <LeaveEvent
                                eventData={eventData}
                                token={token}
                                user={user}
                              />
                            )}
                          {eventData.owner._id === user._id ? (
                            <button
                              onClick={handleRemove}
                              id={participant._id}
                              className="btn-red"
                            >
                              remove
                            </button>
                          ) : null}
                        </div>
                      ))
                    ) : invitations &&
                      !invitations.find((inv) => inv.status === "pending") ? (
                      <div className="all-invited">
                        Invite your friends to this event!
                      </div>
                    ) : null}
                  </section>

                  {eventData.owner._id === user._id ? (
                    <>
                      <h2 className="event-heading">Invite Meerkats</h2>
                      <section className="participant-modal">
                        {Object.keys(contacts).length > 0 ? (
                          contacts.map((participant) => (
                            <div
                              className="participant-container"
                              key={participant._id}
                            >
                              <img
                                className="profile-small"
                                src={participant.picture.url}
                                alt=""
                              />
                              <div>{participant.name}</div>
                              {eventData.owner._id === user._id ? (
                                <button
                                  onClick={handleAdd}
                                  id={participant._id}
                                  className={
                                    invitations &&
                                    invitations.find(
                                      (invitation) =>
                                        invitation.invited ===
                                          participant._id &&
                                        invitation.status === "pending"
                                    )
                                      ? "btn-disabled"
                                      : "btn-grey"
                                  }
                                  disabled={
                                    invitations &&
                                    invitations.find(
                                      (invitation) =>
                                        invitation.invited ===
                                          participant._id &&
                                        invitation.status === "pending"
                                    )
                                  }
                                >
                                  {invitations &&
                                  invitations.find(
                                    (invitation) =>
                                      invitation.invited === participant._id &&
                                      invitation.status === "pending"
                                  )
                                    ? "pending"
                                    : "invite"}
                                </button>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <div className="all-invited">
                            You have invited the whole pack!
                          </div>
                        )}
                      </section>
                      <div className="email-invitation-container">
                        <label>Invite via email</label>
                        <form onSubmit={handleEmailInvitation}>
                          <input
                            value={emailInput}
                            onChange={handleChangeEmail}
                            type="email"
                            placeholder="Email"
                          />
                          <button type="submit">Invite</button>
                        </form>
                        <p>{emailInvitationMessage}</p>
                      </div>
                    </>
                  ) : null}
                </Typography>
              )}
            </div>
          </Box>
        </motion.div>
      </Modal>
    </>
  );
};

export default Participants;

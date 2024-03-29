import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { toggleTodo } from "../api/todos.js";
import { addTodo, deleteTodo, editTodo } from "../api/todos.js";
import Message from "./Message.jsx";

//STYLE
import "../styles/todolist.css";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  Zoom,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { FaRegCircleCheck, FaRegCircle } from "react-icons/fa6";

const Todolist = ({ eventData, setEventData }) => {
  const { token, user } = useAuth();

  const [participantList, setParticipantList] = useState(
    eventData.participants
  );
  const [todoList, setTodoList] = useState(eventData.todos);

  //STATES FOR TO-DO_EDITING
  const [formData, setFormData] = useState({
    assignee: user._id,
    title: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [snackBarMessage, setSnackBarMessage] = useState(null);

  // EVENT HANDLERS FOR TO-DOS
  const handleAdd = async () => {
    addTodo(eventData._id, formData, token, setEventData, setSnackBarMessage);

    setFormData({
      assignee: user._id,
      title: "",
    });
  };

  const handleToggle = (event) => {
    const todoId = !event.target.id
      ? !event.target.parentNode.id
        ? event.target.parentNode.parentNode.id
        : event.target.parentNode.id
      : event.target.id;
    toggleTodo(eventData._id, todoId, token, formData, setEventData);
  };

  const handleEdit = (todo) => {
    if (currentTodo === null) {
      setCurrentTodo(todo);
      setIsEditing(true);
    }
    if (todo._id === currentTodo._id) {
      setIsEditing(!isEditing);
    } else if (todo._id !== currentTodo._id) {
      setIsEditing(true);
    } else {
      setIsEditing(true);
    }
    setCurrentTodo(todo);
  };

  const handleInputTodo = (e) => {
    const todoTitle = e.target.value;
    setCurrentTodo((prev) => ({ ...prev, title: todoTitle }));
  };

  const handleChangeTodo = (event) => {
    const todoAssignee = event.target.value;
    setCurrentTodo((prev) => ({ ...prev, assignee: todoAssignee }));
  };

  const handleSave = () => {
    editTodo(
      eventData._id,
      currentTodo,
      token,
      setEventData,
      setSnackBarMessage
    );
    setIsEditing(false);
    setCurrentTodo(null);
  };

  const handleDelete = (todoId) => {
    deleteTodo(eventData._id, todoId, token, setEventData, setSnackBarMessage);
    setIsEditing(false);
    setCurrentTodo(null);
  };

  const handleChange = (event) => {
    const data = { assignee: event.target.value };
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleInput = (event) => {
    const data = { title: event.target.value };
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleClickUnauthorized = () => {
    setSnackBarMessage({
      message: "You can not change this",
      severity: "success",
    });
  };

  const getAssigned = (todo, value) => {
    let assignee;

    if (user._id === todo.assignee) {
      assignee = user;
    } else {
      const participant = participantList.find(
        (participant) => participant._id === todo.assignee
      );

      if (participant) {
        assignee = participant;
      } else {
        // owner
        assignee = eventData.owner;
      }
    }
    if (assignee && value === "name") {
      return assignee.name;
    }
    if (assignee && value === "picture" && assignee.picture) {
      return assignee.picture.url;
    }
    return "Assign Task";
  };

  useEffect(() => {
    setParticipantList(eventData.participants);
    setTodoList(eventData.todos);
  }, [eventData]);

  return (
    <>
      {user._id === eventData.owner._id || eventData.todos.length > 0 ? (
        <h2 className="event-heading">TO-DO-List</h2>
      ) : null}
      <section className="todo-list">
        {todoList.map((todo, index) => (
          <div
            className={
              user._id === eventData.owner._id &&
              user._id === todo.assignee &&
              !todo.done
                ? "todo-item grid4 item-alert"
                : user._id === eventData.owner._id
                ? "todo-item grid4"
                : user._id !== eventData.owner._id &&
                  user._id === todo.assignee &&
                  !todo.done
                ? "todo-item grid3 item-alert"
                : "todo-item grid3"
            }
            key={index}
          >
            {user._id === eventData.owner._id || user._id === todo.assignee ? (
              <Button
                onClick={handleToggle}
                id={todo._id}
                className={
                  todo.done
                    ? "btn-check btn-checked"
                    : "btn-check btn-unchecked"
                }
              >
                {todo.done ? <FaRegCircleCheck /> : <FaRegCircle />}
              </Button>
            ) : (
              <Tooltip
                title={`This task is assigned to ${getAssigned(todo, "name")}`}
                TransitionComponent={Zoom}
                arrow={true}
                placement="top"
                PopperProps={{
                  popperOptions: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -20],
                        },
                      },
                    ],
                  },
                }}
              >
                <Button
                  id={todo._id}
                  onClick={handleClickUnauthorized}
                  className="btn-check btn-disabled"
                >
                  {todo.done ? <FaRegCircleCheck /> : <FaRegCircle />}
                </Button>
              </Tooltip>
            )}

            {isEditing && currentTodo._id === todo._id ? (
              <TextField
                label="Edit To-Do"
                variant="outlined"
                value={currentTodo.title}
                onChange={handleInputTodo}
              />
            ) : (
              <p>{todo.title}</p>
            )}

            {isEditing && currentTodo._id === todo._id ? (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Assign</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="assign-participant"
                  value={currentTodo.assignee}
                  label="Assign"
                  onChange={handleChangeTodo}
                >
                  <MenuItem key={user._id} value={user._id}>
                    <img
                      className="profile-small assign-img"
                      src={user.picture.url}
                      alt=""
                    />
                    {user.name}
                  </MenuItem>
                  {participantList.map((participant) => (
                    <MenuItem key={participant._id} value={participant._id}>
                      <img
                        className="profile-small assign-img"
                        src={participant.picture.url}
                        alt=""
                      />
                      {participant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Tooltip
                title={getAssigned(todo, "name")}
                TransitionComponent={Zoom}
                arrow={false}
                placement="top"
                PopperProps={{
                  popperOptions: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -50],
                        },
                      },
                    ],
                  },
                }}
              >
                <div className="center-item">
                  <img
                    className="profile-small"
                    src={getAssigned(todo, "picture")}
                    alt=""
                  />
                </div>
              </Tooltip>
            )}

            {user._id === eventData.owner._id ? (
              <div className="center-item">
                <button onClick={() => handleEdit(todo)} className="edit-btn">
                  {!isEditing ? <FaPencilAlt /> : <IoIosClose />}
                </button>
              </div>
            ) : null}

            {isEditing && currentTodo._id === todo._id ? (
              <div className="todo-buttons">
                <Button className="btn-grey" id="btn-save" onClick={handleSave}>
                  save task
                </Button>
                <Button
                  className="btn-red"
                  id="btn-delete"
                  onClick={() => handleDelete(todo._id)}
                >
                  delete task
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </section>

      {user._id === eventData.owner._id ? (
        <section className="todo-owner">
          <Box
            component="form"
            sx={{
              "& > :not(style)": { width: "100%" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Add new To-Do"
              required
              variant="outlined"
              value={formData.title}
              onChange={handleInput}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assign</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="assign-participant"
                value={formData.assignee}
                label="Assign"
                onChange={handleChange}
              >
                <MenuItem key={user._id} value={user._id}>
                  <img
                    className="profile-small assign-img"
                    src={user.picture.url}
                    alt=""
                  />
                  {user.name}
                </MenuItem>
                {participantList.map((participant) => (
                  <MenuItem key={participant._id} value={participant._id}>
                    <img
                      className="profile-small assign-img"
                      src={participant.picture.url}
                      alt=""
                    />
                    {participant.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button className="btn-green" onClick={handleAdd}>
              Add
            </Button>
          </Box>

          {snackBarMessage ? (
            <Message
              message={snackBarMessage.message}
              severity={snackBarMessage.severity}
            />
          ) : null}
        </section>
      ) : null}
    </>
  );
};

export default Todolist;

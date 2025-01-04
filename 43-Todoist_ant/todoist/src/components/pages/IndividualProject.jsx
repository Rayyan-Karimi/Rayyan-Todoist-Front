// Single project's view
import Index from "./Index";
import AddTaskButton from "../util/AddTaskButton";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { List, Typography, Checkbox, Tooltip, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import { TodoistApi } from "@doist/todoist-api-typescript";
const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN;
const api = new TodoistApi(apiToken);

const { Title, Text } = Typography;

export default function IndividualProject({ tasks, projects, setTasks }) {
  const { id } = useParams();
  const filteredTasks = tasks.filter((task) => task.projectId === id);
  const filteredProject = projects.find((project) => project.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditing(true);
  };

  const handleEditSave = async (updatedTask) => {
    try {
      const isSuccess = await api.updateTask(updatedTask.id, {
        content: updatedTask.content,
        description: updatedTask.description,
        due_date: updatedTask.due_date,
        priority: updatedTask.priority,
      });

      if (isSuccess) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        console.log("Task updated successfully");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (theId) => {
    api
      .deleteTask(theId)
      .then((isSuccess) => {
        if (isSuccess) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== theId)
          );
          message.success("Task deleted.");
        }
      })
      .catch((error) => message.error("Error deleting task:", error));
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "auto",
        height: "80vh",
        overflowY: "auto",
        width: "600px",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>
        {filteredProject && filteredProject.name}
      </Title>

      {filteredTasks.length > 0 ? (
        <List
          dataSource={filteredTasks}
          renderItem={(task) => (
            <List.Item
              style={{
                padding: "10px 0",
                alignItems: "flex-start",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                width: "100%",
              }}
              className="task-item"
            >
              <Tooltip title="Delete Task?">
                <Checkbox
                  checked={task.isCompleted}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  position: "relative",
                }}
              >
                <div>
                  <Text strong>{task.content}</Text>
                  <Tooltip title="Edit Task?">
                    <EditOutlined
                      className="edit-icon"
                      onClick={() => handleEditClick(task)}
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                        color: "#1890ff",
                      }}
                    />
                  </Tooltip>
                </div>
                <Text type="secondary">{task.description || ""}</Text>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Text>No tasks found for this project.</Text>
      )}

      {isEditing && (
        <AddTaskButton
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          task={editingTask}
          onSave={handleEditSave}
        />
      )}
      {!isEditing && (
        <AddTaskButton setTasks={setTasks} tasks={tasks} projectId={id} />
      )}
      {filteredTasks.length === 0 && <Index />}
    </div>
  );
}

IndividualProject.propTypes = {
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};

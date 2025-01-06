// React & antd imports
import { useState, useEffect, useReducer } from "react";
import { ProjectOutlined, ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Form, message } from "antd";
import { useMediaQuery } from "react-responsive";

// Imports of self made items
import ProjectLabel from "./components/util/ProjectLabel";
import AddProjectModal from "./components/util/AddProjectModal";
import EditOrDeleteProjectModal from "./components/util/EditOrDeleteProjectModal";
import ProjectActionsDropdown from "./components/util/ProjectActionsDropdown";
import LeftSiderSmall from "./components/element/LeftSider";
import RightLayout from "./components/element/RightLayout";
import LeftSiderToggle from "./components/element/LeftSider-ToggleForLeftSider";

// API setup
import { TodoistApi } from "@doist/todoist-api-typescript";
const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN;
const api = new TodoistApi(apiToken); // Use an environment variable

// App function
function App() {
  function projectsReducer(projects, action) {
    console.log("Projects:", projects);
    console.log("Action", action);
    switch (action.type) {
      case "ADD_PROJECT":
        return [...projects, action.payload];
      case "EDIT_PROJECT":
        return projects.map((project) => {
          if (project.id === action.payload.id) {
            return action.payload;
          }
          return project;
        });
      case "DELETE_PROJECT":
        return projects.filter((project) => project.id !== action.payload);
      default:
        return projects;
    }
  }

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const addProjectForm = Form.useForm();
  const [
    isEditOrDeleteProjectModalVisible,
    setIsEditOrDeleteProjectModalVisible,
  ] = useState(false);
  const [actionTypeOnProject, setActionTypeOnProject] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [editOrDeleteProjectForm] = Form.useForm();
  const isLargeScreen = useMediaQuery({ minWidth: 751 });
  const [collapsed, setCollapsed] = useState(false);
  // const [projects, setProjects] = useState([]);
  const [projects, dispatch] = useReducer(projectsReducer, []);

  // Add project
  const handleFormSubmitForAddProject = async (values) => {
    const { projectTitle, isFavorite } = values;
    try {
      const newProject = await api.addProject({
        name: projectTitle,
        isFavorite,
      });
      // setProjects((prev) => [...prev, newProject]);
      dispatch({
        type: "ADD_PROJECT",
        payload: newProject,
      });
      setIsAddProjectModalVisible(false);
      addProjectForm.resetFields();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Update project
  const handleEditProjectFormSubmit = async (values) => {
    try {
      const updatedProject = await api.updateProject(selectedProject.id, {
        name: values.name,
        isFavorite: values.isFavorite,
      });
      dispatch({
        type: "UPDATE_PROJECT",
        payload: updatedProject,
      });
      // setProjects((prev) =>
      //   prev.map((project) =>
      //     project.id !== updatedProject.id ? project : updatedProject
      //   )
      // );

      editOrDeleteProjectForm.resetFields();
      message.success("Updated project successfully.");
    } catch (err) {
      message.error("Error updating project:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  // Delete project
  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(selectedProject.id);
      dispatch({
        type: "DELETE_PROJECT",
        payload: selectedProject.id,
      });
      // setProjects((prev) =>
      //   prev.filter((project) => project.id !== selectedProject.id)
      // );
      message.success("Deleted project successfully.");
    } catch (err) {
      message.error("Error deleting project:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  // Favorite update project
  const handleUpdateFavoriteProjectStatus = async () => {
    try {
      const updatedProject = {
        ...selectedProject,
        isFavorite: !selectedProject.isFavorite,
      };
      await api.updateProject(selectedProject.id, updatedProject);
      dispatch({
        type: "UPDATE_PROJECT",
        payload: updatedProject,
      });
      // setProjects((prev) =>
      //   prev.map((project) =>
      //     project.id !== updatedProject.id ? project : updatedProject
      //   )
      // );
      message.success("Updated favorite successfully.");
    } catch (err) {
      message.error("Error updating favorite:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  const showProjectActionsModal = (project, type) => {
    setSelectedProject(project);
    setActionTypeOnProject(type); // 'edit' or 'delete'
    setIsEditOrDeleteProjectModalVisible(true);
    if (type === "edit") {
      editOrDeleteProjectForm.setFieldsValue({
        name: project.name,
        isFavorite: project.isFavorite,
      });
    }
  };

  const handleCancelForEditOrDeleteProject = () => {
    setIsEditOrDeleteProjectModalVisible(false);
    setSelectedProject(null);
    setActionTypeOnProject("");
    editOrDeleteProjectForm.resetFields();
  };

  const showAddProjectModal = () => {
    setIsAddProjectModalVisible(true);
  };

  const handleModalCancelForAddProject = () => {
    setIsAddProjectModalVisible(false);
    addProjectForm.resetFields();
  };

  // Fetch
  useEffect(() => {
    setIsLoading(true);
    console.log("Hi");
    Promise.all([api.getProjects(), api.getTasks()])
      .then(([fetchedProjects, fetchedTasks]) => {
        fetchedProjects.splice(0, 1).map(
          (project) =>
            dispatch({
              type: "UPDATE_PROJECT",
              payload: project, // @TODO:
            }) // Exclude the first project
        );
        setTasks(fetchedTasks);
        setIsLoading(false);
        setHasError(false);
        console.log("Projects are:", fetchedProjects);
        console.log("TAsks are:", fetchedTasks);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  } else if (hasError) {
    return <>Error loading data. Please check Login Token.</>;
  }

  const menuItems = [
    {
      key: "my-favorites",
      label: "My Favorites",
      icon: <ProjectOutlined />,
      children: projects
        .filter((project) => project.isFavorite)
        .map((project) => ({
          label: (
            <ProjectLabel
              project={project}
              setSelectedProject={setSelectedProject}
              handleUpdateFavoriteProjectStatus={
                handleUpdateFavoriteProjectStatus
              }
              showProjectActionsModal={showProjectActionsModal}
              onClick={() => setSelectedProject(project)}
            />
          ),
          key: `/my-favorites/${project.id}`,
        })),
    },
    {
      key: "my-projects",
      label: "My Projects",
      icon: <ProfileOutlined />,
      children: projects.map((project) => ({
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
            onClick={() => setSelectedProject(project)}
          >
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
              title={project.name}
            >
              {project.name}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <ProjectActionsDropdown
                project={project}
                handleUpdateFavoriteProjectStatus={
                  handleUpdateFavoriteProjectStatus
                }
                showProjectActionsModal={showProjectActionsModal}
              />
            </div>
          </div>
        ),
        key: `/my-projects/${project.id}`,
      })),
    },
  ];

  // Returning HTML
  return (
    <div className="App">
      <Layout>
        {/* Left side Sider */}
        <LeftSiderSmall
          collapsed={collapsed}
          isLargeScreen={isLargeScreen}
          setCollapsed={setCollapsed}
          menuItems={menuItems}
          navigate={navigate}
          showAddProjectModal={showAddProjectModal}
        />
        {collapsed && (
          <LeftSiderToggle collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        {/* Right side Layout */}
        <RightLayout
          selectedProject={selectedProject}
          tasks={tasks}
          projects={projects}
          setTasks={setTasks}
        />
      </Layout>

      {/* Project actions modal */}
      <EditOrDeleteProjectModal
        actionTypeOnProject={actionTypeOnProject}
        isVisible={isEditOrDeleteProjectModalVisible}
        onCancel={handleCancelForEditOrDeleteProject}
        onEditSubmit={handleEditProjectFormSubmit}
        onDelete={handleDeleteProject}
        form={editOrDeleteProjectForm}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isVisible={isAddProjectModalVisible}
        onCancel={handleModalCancelForAddProject}
        onSubmit={handleFormSubmitForAddProject}
      />
    </div>
  );
}

export default App;

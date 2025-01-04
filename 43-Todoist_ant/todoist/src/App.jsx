import { useState, useEffect } from "react";
import { ProjectOutlined, ProfileOutlined } from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Menu, Flex, Layout, Button, Form, message } from "antd";
import { useMediaQuery } from "react-responsive";

// import ContentDisplay from "./components/element/ContentDisplay";
import ProjectLabel from "./components/element/ProjectLabel";
import AddProjectModal from "./components/util/AddProjectModal";
import EditOrDeleteProjectModal from "./components/util/EditOrDeleteProjectModal";
import AddProjectIcon from "./assets/AddProjectIcon.svg";
import Index from "./components/pages/Index";
import IndividualProject from "./components/pages/IndividualProject";
import ProjectActionsDropdown from "./components/util/ProjectActionsDropdown";

const { Sider, Header, Content, Footer } = Layout;

import { TodoistApi } from "@doist/todoist-api-typescript";
const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN;
const api = new TodoistApi(apiToken); // Use an environment variable

function App() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
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

  const handleUpdateFavoriteProjectStatus = async () => {
    try {
      const updatedProject = {
        ...selectedProject,
        isFavorite: !selectedProject.isFavorite,
      };
      await api.updateProject(selectedProject.id, updatedProject);
      setProjects((prev) =>
        prev.map((project) =>
          project.id !== updatedProject.id ? project : updatedProject
        )
      );
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
  const handleEditProjectFormSubmit = async (values) => {
    try {
      const updatedProject = await api.updateProject(selectedProject.id, {
        name: values.name,
        isFavorite: values.isFavorite,
      });
      setProjects((prev) =>
        prev.map((project) =>
          project.id !== updatedProject.id ? project : updatedProject
        )
      );

      editOrDeleteProjectForm.resetFields();
      message.success("Updated project successfully.");
    } catch (err) {
      message.error("Error updating project:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(selectedProject.id);
      setProjects((prev) =>
        prev.filter((project) => project.id !== selectedProject.id)
      );
      message.success("Deleted project successfully.");
    } catch (err) {
      message.error("Error deleting project:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  const showAddProjectModal = () => {
    setIsAddProjectModalVisible(true);
  };
  const handleModalCancelForAddProject = () => {
    setIsAddProjectModalVisible(false);
    addProjectForm.resetFields();
  };
  const handleFormSubmitForAddProject = async (values) => {
    const { projectTitle, isFavorite } = values;
    try {
      const newProject = await api.addProject({
        name: projectTitle,
        isFavorite,
      });
      setProjects((prev) => [...prev, newProject]);
      setIsAddProjectModalVisible(false);
      addProjectForm.resetFields();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Fetch
  useEffect(() => {
    setIsLoading(true);
    console.log("Hi");
    Promise.all([api.getProjects(), api.getTasks()])
      .then(([fetchedProjects, fetchedTasks]) => {
        setProjects(fetchedProjects); // Exclude the first project
        setTasks(fetchedTasks);
        setIsLoading(false);
        setHasError(false);
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
            />
          ),
          key: `/projects/${project.id}`,
        })),
    },
    {
      key: "my-projects", // Matches the route
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
        key: `/projects/${project.id}`,
      })),
    },
  ];

  return (
    <div className="App">
      <Layout>
        {/* Left side Sider */}
        {/* Small screen sidebar */}
        <Sider
          width={325}
          style={{
            background: "rgb(255, 255, 245)",
            minHeight: "100vh",
            transform:
              isLargeScreen || collapsed
                ? "translateX(-100%)"
                : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
            position: "fixed", // Keep it fixed for smooth transitions
            zIndex: 1000, // Ensure it is above other content
          }}
        >
          {/* Sider top buttons */}
          <Flex wrap direction="column" align="center" justify="end">
            <Button type="text" style={{ padding: 3 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m6.585 15.388-.101.113c-.286.322-.484.584-.484 1h12c0-.416-.198-.678-.484-1l-.101-.113c-.21-.233-.455-.505-.7-.887-.213-.33-.355-.551-.458-.79-.209-.482-.256-1.035-.4-2.71-.214-3.5-1.357-5.5-3.857-5.5s-3.643 2-3.857 5.5c-.144 1.675-.191 2.227-.4 2.71-.103.239-.245.46-.457.79-.246.382-.491.654-.701.887Zm10.511-2.312c-.083-.341-.131-.862-.241-2.148-.113-1.811-.469-3.392-1.237-4.544C14.8 5.157 13.57 4.5 12 4.5c-1.571 0-2.8.656-3.618 1.883-.768 1.152-1.124 2.733-1.237 4.544-.11 1.286-.158 1.807-.241 2.148-.062.253-.13.373-.46.884-.198.308-.373.504-.57.723-.074.081-.15.166-.232.261-.293.342-.642.822-.642 1.557a1 1 0 0 0 1 1h3a3 3 0 0 0 6 0h3a1 1 0 0 0 1-1c0-.735-.35-1.215-.642-1.557-.082-.095-.158-.18-.232-.261-.197-.22-.372-.415-.57-.723-.33-.511-.398-.63-.46-.884ZM14 17.5h-4a2 2 0 1 0 4 0Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button
              type="text"
              style={{ padding: 0 }}
              onClick={() => setCollapsed(!collapsed)} // Toggle collapsed state
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </Flex>
          {/* Sider Menu items */}
          <Menu
            mode="inline"
            defaultSelectedKeys={["my-favorites"]}
            defaultOpenKeys={["my-favorites"]}
            onClick={({ key }) => {
              if (key === "add-project") {
                showAddProjectModal();
              } else {
                navigate(key);
              }
            }}
            style={{
              marginTop: "3vh",
              padding: 0,
              background: "inherit",
              border: "none",
            }}
          >
            <Menu.Item
              key="add-project"
              icon={
                <img
                  src={AddProjectIcon}
                  alt="Add Project Icon"
                  style={{ width: 16, height: 16 }}
                />
              }
            >
              Add Project
            </Menu.Item>
            {menuItems.map((menuItem) => {
              if (menuItem.children && menuItem.children.length > 0) {
                return (
                  <Menu.SubMenu
                    key={menuItem.key}
                    icon={menuItem.icon}
                    title={menuItem.label}
                  >
                    {menuItem.children.map((child) => (
                      <Menu.Item key={child.key}>{child.label}</Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              }
              return (
                <Menu.Item key={menuItem.key} icon={menuItem.icon}>
                  {menuItem.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        {!isLargeScreen && (
          <Sider style={{ background: "white" }} width={50}>
            <Button
              type="text"
              style={{ padding: 0 }}
              onClick={() => setCollapsed(!collapsed)} // Toggle collapsed state
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </Sider>
        )}

        {/* Large screen sidebar */}
        {isLargeScreen && !collapsed && (
          <Sider
            width={325}
            style={{
              background: "rgb(255, 255, 225)",
              minHeight: "100vh",
            }}
          >
            {/* Sider top buttons */}
            <Flex wrap direction="column" align="center" justify="end">
              <Button type="text" style={{ padding: 3 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m6.585 15.388-.101.113c-.286.322-.484.584-.484 1h12c0-.416-.198-.678-.484-1l-.101-.113c-.21-.233-.455-.505-.7-.887-.213-.33-.355-.551-.458-.79-.209-.482-.256-1.035-.4-2.71-.214-3.5-1.357-5.5-3.857-5.5s-3.643 2-3.857 5.5c-.144 1.675-.191 2.227-.4 2.71-.103.239-.245.46-.457.79-.246.382-.491.654-.701.887Zm10.511-2.312c-.083-.341-.131-.862-.241-2.148-.113-1.811-.469-3.392-1.237-4.544C14.8 5.157 13.57 4.5 12 4.5c-1.571 0-2.8.656-3.618 1.883-.768 1.152-1.124 2.733-1.237 4.544-.11 1.286-.158 1.807-.241 2.148-.062.253-.13.373-.46.884-.198.308-.373.504-.57.723-.074.081-.15.166-.232.261-.293.342-.642.822-.642 1.557a1 1 0 0 0 1 1h3a3 3 0 0 0 6 0h3a1 1 0 0 0 1-1c0-.735-.35-1.215-.642-1.557-.082-.095-.158-.18-.232-.261-.197-.22-.372-.415-.57-.723-.33-.511-.398-.63-.46-.884ZM14 17.5h-4a2 2 0 1 0 4 0Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              <Button
                type="text"
                style={{ padding: 0 }}
                onClick={() => setCollapsed(!collapsed)} // Toggle collapsed state
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </Flex>
            {/* Sider Menu items */}
            <Menu
              mode="inline"
              defaultSelectedKeys={["my-favorites"]}
              defaultOpenKeys={["my-favorites"]}
              onClick={({ key }) => {
                if (key === "add-project") {
                  showAddProjectModal();
                } else {
                  navigate(key);
                }
              }}
              style={{
                marginTop: "3vh",
                padding: 0,
                background: "inherit",
                border: "none",
              }}
            >
              <Menu.Item
                key="add-project"
                icon={
                  <img
                    src={AddProjectIcon}
                    alt="Add Project Icon"
                    style={{ width: 16, height: 16 }}
                  />
                }
              >
                Add Project
              </Menu.Item>
              {menuItems.map((menuItem) => {
                if (menuItem.children && menuItem.children.length > 0) {
                  return (
                    <Menu.SubMenu
                      key={menuItem.key}
                      icon={menuItem.icon}
                      title={menuItem.label}
                    >
                      {menuItem.children.map((child) => (
                        <Menu.Item key={child.key}>{child.label}</Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                }
                return (
                  <Menu.Item key={menuItem.key} icon={menuItem.icon}>
                    {menuItem.label}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Sider>
        )}
        {isLargeScreen && collapsed && (
          <Sider style={{ background: "white" }} width={50}>
            <Button
              type="text"
              style={{ padding: 0 }}
              onClick={() => setCollapsed(!collapsed)} // Toggle collapsed state
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </Sider>
        )}

        {/* Right side Layout */}
        <Layout style={{ background: "white" }}>
          <Header style={{ background: "white" }}>
            {selectedProject && selectedProject.isFavorite === true
              ? `My Favorites /`
              : `My Projects /`}
          </Header>
          <Content style={{ minHeight: "70vh" }}>
            <ContentDisplay
              tasks={tasks}
              projects={projects}
              setTasks={setTasks}
            />
          </Content>
          <Footer style={{ background: "white" }}>Todoist Clone ©2024</Footer>
        </Layout>
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

function ContentDisplay({ tasks, projects, setTasks }) {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/projects/:id"
        element={
          <IndividualProject
            tasks={tasks}
            projects={projects}
            setTasks={setTasks}
          />
        }
      />
      <Route path="/test" element={<h3>Test</h3>} />
      <Route
        path="*"
        element={<div>404 - Page Not Found</div>} // Fallback route
      />
    </Routes>
  );
}

export default App;

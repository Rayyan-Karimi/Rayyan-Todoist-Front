import { useState, useEffect } from "react";
import {
  PlusOutlined,
  ProjectOutlined,
  ProfileOutlined,
  RightOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  Flex,
  Layout,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Tooltip,
} from "antd";

import Index from "./components/pages/Index";
import IndividualProject from "./components/pages/IndividualProject";
// import DrawerComponent from "./components/util/DrawerComponent";

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
  // const [open, setOpen] = useState(false);
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

  const showProjectActionsModal = (project, type) => {
    console.log("sel proj:", project);
    setSelectedProject(project);
    setActionTypeOnProject(type); // 'edit' or 'delete'
    console.log("Sleected action:", type);
    setIsEditOrDeleteProjectModalVisible(true);
    console.log("Modal is viisble");
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
      console.log("Updated project successfully.");
    } catch (err) {
      console.error("Error updating project:", err);
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
      console.log("Deleted project successfully.");
    } catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      handleCancelForEditOrDeleteProject();
    }
  };

  const showAddProjectModal = () => {
    console.log("Showing add projects modal");
    setIsAddProjectModalVisible(true);
  };
  const handleModalCancelForAddProject = () => {
    console.log("Handling cancel for add projects modal");
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
      console.log("You tried to create new project:", newProject);
      setProjects((prev) => [...prev, newProject]);
      console.log("Setting projects to add this new project.");
      setIsAddProjectModalVisible(false);
      console.log("Closed Modal for add project.");
      addProjectForm.resetFields();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Fetch
  useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getProjects(), api.getTasks()])
      .then(([fetchedProjects, fetchedTasks]) => {
        setProjects(fetchedProjects.slice(1)); // Exclude the first project
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

  // const onOpenDrawer = () => {
  //   setOpen(true);
  // };
  const handleNotificationsLink = () => {
    navigate("/notifications");
  };

  const menuItems = [
    {
      key: "my-favorites",
      label: "My Favorites",
      icon: <ProjectOutlined />,
      children: projects
        .filter((project) => project.isFavorite)
        .map((project) => ({
          label: (
            <div
              className="menu-item-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              {/* Name Container */}
              <div
                style={{
                  overflow: "hidden", // Prevent overflow
                  textOverflow: "ellipsis", // Add ellipsis for long names
                  maxWidth: 120,
                }}
                title={project.name} // Tooltip with the full project name
              >
                {project.name}
              </div>
              {/* Buttons Container */}
              <div style={{ display: "flex", gap: "8px" }}>
                <Tooltip title="Edit Project">
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      showProjectActionsModal(project, "edit");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip title="Delete Project">
                  <DeleteOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      showProjectActionsModal(project, "delete");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </div>
            </div>
          ),
          key: `/projects/${project.id}`, // Adjusted path to match route
        })),
    },
    {
      key: "my-projects",
      label: "My Projects",
      icon: <ProfileOutlined />,
      children: projects.map((project) => ({
        label: (
          <div
            className="menu-item-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "nowrap",
            }}
          >
            {/* Name Container */}
            <div
              style={{
                overflow: "hidden", // Prevent overflow
                textOverflow: "ellipsis", // Add ellipsis for long names
                maxWidth: 120,
              }}
              title={project.name} // Tooltip with the full project name
            >
              {project.name}
            </div>
            {/* Buttons Container */}
            <div style={{ display: "flex", gap: "8px" }}>
              <Tooltip title="Edit Project">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    showProjectActionsModal(project, "edit");
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
              <Tooltip title="Delete Project">
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    showProjectActionsModal(project, "delete");
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        key: `/projects/${project.id}`, // Adjusted path to match route
      })),
    },
    { label: "Test", key: "/test" }, // Matches the Test route
  ];
  

  return (
    <div className="App">
      <Layout>
        {/* Left side Sider */}
        <Sider
          width={250}
          style={{ background: "lightYellow", minHeight: "100vh" }}
        >
          {/* Sider top buttons */}
          <Flex wrap direction="column" align="center" justify="end">
            <Button
              type="text"
              style={{ padding: 3 }}
              onClick={handleNotificationsLink}
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
                  d="m6.585 15.388-.101.113c-.286.322-.484.584-.484 1h12c0-.416-.198-.678-.484-1l-.101-.113c-.21-.233-.455-.505-.7-.887-.213-.33-.355-.551-.458-.79-.209-.482-.256-1.035-.4-2.71-.214-3.5-1.357-5.5-3.857-5.5s-3.643 2-3.857 5.5c-.144 1.675-.191 2.227-.4 2.71-.103.239-.245.46-.457.79-.246.382-.491.654-.701.887Zm10.511-2.312c-.083-.341-.131-.862-.241-2.148-.113-1.811-.469-3.392-1.237-4.544C14.8 5.157 13.57 4.5 12 4.5c-1.571 0-2.8.656-3.618 1.883-.768 1.152-1.124 2.733-1.237 4.544-.11 1.286-.158 1.807-.241 2.148-.062.253-.13.373-.46.884-.198.308-.373.504-.57.723-.074.081-.15.166-.232.261-.293.342-.642.822-.642 1.557a1 1 0 0 0 1 1h3a3 3 0 0 0 6 0h3a1 1 0 0 0 1-1c0-.735-.35-1.215-.642-1.557-.082-.095-.158-.18-.232-.261-.197-.22-.372-.415-.57-.723-.33-.511-.398-.63-.46-.884ZM14 17.5h-4a2 2 0 1 0 4 0Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button
              type="text"
              style={{ padding: 0 }}
              onClick={() => console.log("Button clicked.")}
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
                navigate(key); // Navigate directly to the path defined in 'key'
              }
            }}
            style={{
              marginTop: "3vh",
              padding: 0,
              background: "inherit",
              border: "none",
            }}
          >
            <Menu.Item key="add-project" icon={<PlusOutlined />}>
              Add Project
            </Menu.Item>
            {menuItems.map((menuItem) => {
              if (menuItem.children && menuItem.children.length > 0) {
                // Render a SubMenu for items with children
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
              // Render regular Menu.Item
              return (
                <Menu.Item key={menuItem.key} icon={menuItem.icon}>
                  {menuItem.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>

        {/* Right side Layout */}
        <Layout>
          <Header style={{ background: "white" }}>
            Todoist Clone
            {/* @TODO: add bbreadcrumbs */}
          </Header>
          <Content style={{ minHeight: "70vh" }}>
            <ContentDisplay tasks={tasks} />
          </Content>
          <Footer>Todoist Clone ©2024</Footer>
        </Layout>
      </Layout>

      {/* Project actions modal */}
      <Modal
        title={
          actionTypeOnProject === "edit" ? "Edit Project" : "Delete Project"
        }
        visible={isEditOrDeleteProjectModalVisible}
        onCancel={handleCancelForEditOrDeleteProject}
        footer={null}
      >
        {actionTypeOnProject === "edit" ? (
          <Form
            form={editOrDeleteProjectForm}
            layout="vertical"
            onFinish={handleEditProjectFormSubmit}
          >
            <Form.Item
              label="Project Title"
              name="name"
              rules={[
                { required: true, message: "Please input your project name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="isFavorite"
              valuePropName="checked" // Ensures the checkbox state is properly managed
            >
              <Checkbox>Mark as Favorite</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
                Save Changes
              </Button>
              <Button onClick={handleCancelForEditOrDeleteProject}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <p>Are you sure you want to delete this project?</p>
            <Button
              type="primary"
              danger
              onClick={handleDeleteProject}
              style={{ marginRight: 8 }}
            >
              Delete
            </Button>
            <Button onClick={handleCancelForEditOrDeleteProject}>Cancel</Button>
          </div>
        )}
      </Modal>

      {/* Add Project Modal */}
      <Modal
        title="Add New Project"
        visible={isAddProjectModalVisible}
        onCancel={handleModalCancelForAddProject}
        footer={null} // Use Form buttons instead
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={handleFormSubmitForAddProject}
          onFinishFailed={handleModalCancelForAddProject}
          autoComplete="off"
        >
          <Form.Item
            label="Project Title"
            name="projectTitle"
            rules={[
              { required: true, message: "Please input your project title!" },
            ]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>

          <Form.Item
            name="isFavorite"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Mark as Favorite</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Add Project
            </Button>
            <Button onClick={handleModalCancelForAddProject}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* <DrawerComponent
        open={open}
        setOpen={setOpen}
        handleNotificationsLink={handleNotificationsLink}
        menuItems={menuItems}
      /> */}
    </div>
  );
}

function ContentDisplay({ tasks }) {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/projects/:id"
        element={<IndividualProject tasks={tasks} />}
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

import { useState, useEffect } from "react";
import { Menu, Flex, Layout, Button, Drawer } from "antd";
import {
  PlusOutlined,
  ProjectOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import drawerIcon from "./assets/drawer.svg";

import { TodoistApi } from "@doist/todoist-api-typescript";
const api = new TodoistApi("ff43ebfce17f5e4a429a5f76712cf581b37a3750"); // Use an environment variable
const { Header, Content, Footer } = Layout;

const { Sider } = Layout;
function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
    return (
      <main>
        <div role="status">Loading...</div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main>
        <div role="alert">Error loading data. Please check Login Token.</div>
      </main>
    );
  }

  const onOpenDrawer = () => {
    setOpen(true);
  };
  const onCloseDrawer = () => {
    setOpen(false);
  };
  const handleNotificationsLink = () => {
    setOpen(false);
    navigate("/notifications");
  };
  const menuItems = [
    { label: "Add Project", key: "/", icon: <PlusOutlined /> }, // Matches the home route
    {
      label: "My Favorites",
      icon: <ProjectOutlined />,
      children: projects
        .filter((project) => project.isFavorite)
        .map((project) => ({
          label: project.name,
          key: `/projects/${project.id}`, // Adjusted path to match route
        })),
    },
    {
      label: "My Projects",
      icon: <ProfileOutlined />,
      children: projects.map((project) => ({
        label: project.name,
        key: `/projects/${project.id}`, // Adjusted path to match route
      })),
    },
    { label: "Test", key: "/test" }, // Matches the Test route
  ];

  return (
    <div className="App">
      <Layout>
        <Sider
          width={250}
          style={{ background: "lightYellow", minHeight: "100vh" }}
        >
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
            <Button type="text" style={{ padding: 0 }} onClick={onOpenDrawer}>
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
          <Menu
            mode="inline"
            defaultSelectedKeys={["/"]}
            items={menuItems}
            onClick={({ key }) => {
              setOpen(false);
              navigate(key); // Navigate directly to the path defined in 'key'
            }}
            style={{
              marginTop: "3vh",
              padding: 0,
              background: "inherit",
              border: "none",
            }}
          />
        </Sider>

        <Layout>
          <Header style={{ background: "white" }}>
            header
            <div>
              <img src={drawerIcon} alt="Drawer Opener" />
            </div>
          </Header>
          <Content style={{ minHeight: "70vh" }}>
            <ContentDisplay tasks={tasks} />
          </Content>
          <Footer>footer</Footer>
        </Layout>
      </Layout>

      <Drawer
        placement={"left"}
        width={250}
        onClose={onCloseDrawer}
        open={open}
        closable={false}
      >
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
          <Button type="text" style={{ padding: 0 }} onClick={onCloseDrawer}>
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
        <Menu
          mode="inline"
          defaultSelectedKeys={["today"]}
          defaultOpenKeys={["myProjects"]}
          items={menuItems}
          onClick={({ key }) => {
            setOpen(false);
            navigate(key); // Navigate directly to the path defined in 'key'
          }}
          style={{
            marginTop: "3vh",
            padding: 0,
            background: "inherit",
            border: "none",
          }}
        />
      </Drawer>
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

function IndividualProject({ tasks }) {
  const { id } = useParams();
  const filteredTasks = tasks.filter((task) => task.projectId === id);
  console.log(filteredTasks);
  return (
    <Flex
      style={{
        padding: '10px',
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1>Individual Project, will show project ID here.</h1>{" "}
      <h3>Project ID: {id}</h3>
      <p>FIltered tasks length: {filteredTasks.length}</p>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => <div key={task.id} style={{margin: '20px'}}><div>Task Name: {task.content}</div><div>Task completion status: {task.isCompleted ? "Done" : "Not Done"}</div></div>)
      ) : (
        <p>No tasks found for this project.</p>
      )}
    </Flex>
  );
}

function Index() {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "60%",
        flexDirection: "column", // Ensure column direction applies properly
        textAlign: "center", // Align text for heading and paragraph
      }}
    >
      <img
        src="/todoist-home.png"
        alt="Todoist Home"
        style={{
          maxWidth: "100%",
          height: "auto",
          marginBottom: "1rem",
        }}
      />
      <h3 style={{ marginBottom: "0.5rem" }}>Start small (or dream big)...</h3>
      <p>Add your tasks or find a template to get started with your project.</p>
    </Flex>
  );
}

export default App;

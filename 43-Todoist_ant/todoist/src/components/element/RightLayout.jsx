import { Layout } from "antd";
const { Header, Content, Footer } = Layout;
import PropTypes from "prop-types";

import ContentDisplay from "./RightLayout-ContentDisplay.jsx";

// RightLayout Component
const RightLayout = ({ selectedProject, tasks, projects, setTasks }) => (
  <Layout style={{ background: "white" }}>
    <HeaderComponent selectedProject={selectedProject} />
    <Content style={{ minHeight: "70vh" }}>
      <ContentDisplay tasks={tasks} projects={projects} setTasks={setTasks} />
    </Content>
    <FooterComponent />
  </Layout>
);

RightLayout.propTypes = {
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  selectedProject: PropTypes.object.isRequired,
  setTasks: PropTypes.func.isRequired,
};

// HeaderComponent
const HeaderComponent = ({ selectedProject }) => (
  <Header style={{ background: "white" }}>
    {selectedProject && selectedProject.isFavorite
      ? `My Favorites /`
      : `My Projects /`}
  </Header>
);

HeaderComponent.propTypes = {
  selectedProject: PropTypes.object.isRequired,
};

// FooterComponent
const FooterComponent = () => (
  <Footer style={{ background: "white" }}>Todoist Clone ©2024</Footer>
);

export default RightLayout;

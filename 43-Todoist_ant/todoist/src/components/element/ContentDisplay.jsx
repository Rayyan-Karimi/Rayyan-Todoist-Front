import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import IndividualProject from "../pages/IndividualProject";
import PropTypes from "prop-types";

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

ContentDisplay.propTypes = {
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default ContentDisplay;

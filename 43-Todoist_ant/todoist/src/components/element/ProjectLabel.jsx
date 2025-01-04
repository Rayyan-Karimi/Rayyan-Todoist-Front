import { useState } from "react";
import PropTypes from "prop-types";

import ProjectActionsDropdown from "../util/ProjectActionsDropdown";

const ProjectLabel = ({
  project,
  setSelectedProject,
  handleUpdateFavoriteProjectStatus,
  showProjectActionsModal,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
      }}
      onClick={() => setSelectedProject(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {isHovered && (
        // <div style={{ display: "flex", gap: "8px" }}>
          <ProjectActionsDropdown
            project={project}
            handleUpdateFavoriteProjectStatus={
              handleUpdateFavoriteProjectStatus
            }
            showProjectActionsModal={showProjectActionsModal}
          />
        // </div>
      )}
    </div>
  );
};

ProjectLabel.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
  setSelectedProject: PropTypes.func.isRequired,
  showProjectActionsModal: PropTypes.func.isRequired,
  handleUpdateFavoriteProjectStatus: PropTypes.func.isRequired,
};

export default ProjectLabel;
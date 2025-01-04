// Project Actions Dropdown
import PropTypes from "prop-types";
import { Menu, Dropdown } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FrownOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const ProjectActionsDropdown = ({
  project,
  showProjectActionsModal,
  handleUpdateFavoriteProjectStatus,
}) => {
  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => showProjectActionsModal(project, "edit")}
      >
        <EditOutlined style={{ marginRight: "8px" }} />
        Edit Project
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() => showProjectActionsModal(project, "delete")}
      >
        <DeleteOutlined style={{ marginRight: "8px" }} />
        Delete Project
      </Menu.Item>
      <Menu.Item
        key="favorite"
        onClick={() => handleUpdateFavoriteProjectStatus(project)}
      >
        {project.isFavorite ? (
          <FrownOutlined style={{ marginRight: "8px" }} />
        ) : (
          <HeartOutlined style={{ marginRight: "8px" }} />
        )}
        {project.isFavorite ? `Remove From Favorites` : `Add To Favorites`}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <MoreOutlined style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

ProjectActionsDropdown.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired,
  }).isRequired,
  showProjectActionsModal: PropTypes.func.isRequired,
  handleUpdateFavoriteProjectStatus: PropTypes.func.isRequired,
};

export default ProjectActionsDropdown;

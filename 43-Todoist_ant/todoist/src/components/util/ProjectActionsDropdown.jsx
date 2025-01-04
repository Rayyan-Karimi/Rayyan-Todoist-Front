import React from "react";
import { Menu, Dropdown, Tooltip } from "antd";
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
  onUpdateProject,
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
      <Tooltip title="Show Actions">
        <MoreOutlined style={{ cursor: "pointer" }} />
      </Tooltip>
    </Dropdown>
  );
};

export default ProjectActionsDropdown;

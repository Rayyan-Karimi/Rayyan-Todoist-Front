import PropTypes from "prop-types";
import { Menu } from "antd";
import AddProjectIcon from "../../assets/AddProjectIcon.svg";

const SiderMenu = ({ menuItems, navigate, showAddProjectModal }) => (
  <Menu
    mode="inline"
    defaultSelectedKeys={["my-favorites"]}
    defaultOpenKeys={["my-favorites"]}
    onClick={({ key }) =>
      key === "add-project" ? showAddProjectModal() : navigate(key)
    }
    style={getSiderMenuStyle()}
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
    {menuItems.map(renderMenuItem)}
  </Menu>
);

SiderMenu.propTypes = {
  menuItems: PropTypes.array.isRequired,
  navigate: PropTypes.any.isRequired,
  showAddProjectModal: PropTypes.func.isRequired,
};

const getSiderMenuStyle = () => ({
  marginTop: "3vh",
  padding: 0,
  background: "inherit",
  border: "none",
});

const renderMenuItem = (menuItem) =>
  menuItem.children && menuItem.children.length > 0 ? (
    <Menu.SubMenu
      key={menuItem.key}
      icon={menuItem.icon}
      title={menuItem.label}
    >
      {menuItem.children.map((child) => (
        <Menu.Item key={child.key}>{child.label}</Menu.Item>
      ))}
    </Menu.SubMenu>
  ) : (
    <Menu.Item key={menuItem.key} icon={menuItem.icon}>
      {menuItem.label}
    </Menu.Item>
  );

export default SiderMenu;

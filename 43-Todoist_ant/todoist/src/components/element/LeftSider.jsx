import { Menu, Flex, Layout, Button } from "antd";
import PropTypes from "prop-types";

const { Sider } = Layout;

import AddProjectIcon from "../../assets/AddProjectIcon.svg";

// LeftSider Component
const LeftSider = ({
  collapsed,
  isLargeScreen,
  setCollapsed,
  menuItems,
  navigate,
  showAddProjectModal,
}) => {
  return (
    <Sider width={325} style={getLeftSiderStyle(isLargeScreen, collapsed)}>
      <SiderHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      <SiderMenu
        menuItems={menuItems}
        navigate={navigate}
        showAddProjectModal={showAddProjectModal}
      />
    </Sider>
  );
};

/**
  menuItems,
  showAddProjectModal
 */
LeftSider.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  navigate: PropTypes.any.isRequired,
  menuItems: PropTypes.array.isRequired,
  showAddProjectModal: PropTypes.func.isRequired,
};

export default LeftSider;

const getLeftSiderStyle = (isLargeScreen, collapsed) => ({
  background: "rgb(255, 255, 245)",
  minHeight: "100vh",
  transform: isLargeScreen || collapsed ? "translateX(-100%)" : "translateX(0)",
  transition: "transform 0.3s ease-in-out",
  position: "fixed",
  zIndex: 1000,
});

const SiderHeader = ({ collapsed, setCollapsed }) => (
  <Flex wrap direction="column" align="center" justify="end">
    <Button type="text" style={{ padding: 3 }}>
      {/* Icon */}
    </Button>
    <Button
      type="text"
      style={{ padding: 0 }}
      onClick={() => setCollapsed(!collapsed)}
    >
      {/* Toggle Icon */}
    </Button>
  </Flex>
);

SiderHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};

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

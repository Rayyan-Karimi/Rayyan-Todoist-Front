// LeftSider Component

import { Layout } from "antd";
import PropTypes from "prop-types";
const { Sider } = Layout;

import SiderHeader from "./LeftSider-SiderHeader";
import SiderMenu from "./LeftSider-SiderMenu";

const getLeftSiderStyle = (isLargeScreen, collapsed) => ({
  background: "rgb(255, 255, 245)",
  minHeight: "100vh",
  transform: collapsed ? "translateX(-100%)" : "translateX(0)",
  position: isLargeScreen ? "relative" : "fixed",
  zIndex: isLargeScreen ? "auto" : 1000,
  transition: "transform 0.3s ease-in-out",
});

const LeftSiderSmall = ({
  collapsed,
  setCollapsed,
  menuItems,
  navigate,
  isLargeScreen,
  showAddProjectModal,
}) => {
  return (
    <Sider
      width={isLargeScreen ? (collapsed ? 0 : 325) : 325}
      style={getLeftSiderStyle(isLargeScreen, collapsed)}
    >
      <SiderHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      <SiderMenu
        menuItems={menuItems}
        navigate={navigate}
        showAddProjectModal={showAddProjectModal}
      />
    </Sider>
  );
};

LeftSiderSmall.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  navigate: PropTypes.any.isRequired,
  menuItems: PropTypes.array.isRequired,
  showAddProjectModal: PropTypes.func.isRequired,
};

export default LeftSiderSmall;

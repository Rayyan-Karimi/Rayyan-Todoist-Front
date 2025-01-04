import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Menu, Flex, Layout, Button, Form, message } from "antd";
import { useMediaQuery } from "react-responsive";

const { Sider, Header, Content, Footer } = Layout;

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

const getSiderMenuStyle = () => ({
  marginTop: "3vh",
  padding: 0,
  background: "inherit",
  border: "none",
});

import './App.css';
import { Layout, Avatar, Button, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {
  return (
    <div className="App">
      <Layout>
        <Sider style={{ padding: '1vh', background: 'lightYellow', minHeight: '100vh' }}>
          {/* Avatar Button */}
          <Button style={{ border: 'none', background: 'inherit' }}>
            <Avatar icon={<UserOutlined />} />
          </Button>
          {/* Menu */}
          <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['myProjects']}
            style={{ marginTop: '3vh', background: 'inherit', border: 'none' }}
            itemStyle={{ padding: '4px 16px', margin: 0 }} // Decrease spacing
          >
            <Menu.Item key="addTask">Add Task</Menu.Item>
            <Menu.Item key="search">Search</Menu.Item>
            <Menu.Item key="inbox">Inbox</Menu.Item>
            <Menu.Item key="today">Today</Menu.Item>
            <Menu.Item key="upcoming">Upcoming</Menu.Item>
            <Menu.Item key="filters">Filters & Labels</Menu.Item>
            
            {/* SubMenu for "My Projects" */}
            <SubMenu key="myProjects" title="My Projects">
              <Menu.Item key="home">Home</Menu.Item>
              <Menu.Item key="myWork">My Work</Menu.Item>
              <Menu.Item key="education">Education</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: 'white' }}>Header</Header>
          <Content style={{ background: 'white' }}>Content</Content>
          <Footer style={{ background: 'white' }}>Footer</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;

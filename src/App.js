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
          >
            <Menu.Item key="addTask" style={{ padding: '4px 16px', margin: 0 }}>Add Task</Menu.Item>
            <Menu.Item key="search" style={{ padding: '4px 16px', margin: 0 }}>Search</Menu.Item>
            <Menu.Item key="inbox" style={{ padding: '4px 16px', margin: 0 }}>Inbox</Menu.Item>
            <Menu.Item key="today" style={{ padding: '4px 16px', margin: 0 }}>Today</Menu.Item>
            <Menu.Item key="upcoming" style={{ padding: '4px 16px', margin: 0 }}>Upcoming</Menu.Item>
            <Menu.Item key="filters" style={{ padding: '4px 16px', margin: 0 }}>Filters & Labels</Menu.Item>
            <SubMenu key="myProjects" title="My Projects">
              <Menu.Item key="home" style={{ padding: '4px 16px', margin: 0 }}>Home</Menu.Item>
              <Menu.Item key="myWork" style={{ padding: '4px 16px', margin: 0 }}>My Work</Menu.Item>
              <Menu.Item key="education" style={{ padding: '4px 16px', margin: 0 }}>Education</Menu.Item>
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

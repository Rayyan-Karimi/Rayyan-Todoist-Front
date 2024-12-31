import './App.css';
import { Layout, Avatar, Button, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

// import { TodoistApi } from "@doist/todoist-api-typescript";

const { Header, Footer, Sider, Content } = Layout;

// const api = new TodoistApi("cf40653b3b769c7ac911487e225d9caccec90be9"); // Use an environment variable

function App() {
  // const [projects, setProjects] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [hasError, setHasError] = useState(false);

  // useEffect(() => {
  //   console.log("hello")
  //   api.getProjects()
  //     .then((projects) => console.log(projects))
  //     .catch((error) => console.log(error))
  // }, []);
  
  // if (isLoading) {
  //   return (
  //     <main>
  //       <div role="status">Loading...</div>
  //     </main>
  //   );
  // }

  // if (hasError) {
  //   return (
  //     <main>
  //       <div role="alert">Error loading data. Please try again later.</div>
  //     </main>
  //   );
  // }

  const menuItems = [
    { label: 'Add Task', key: 'addTask' },
    { label: 'Search', key: 'search' },
    { label: 'Inbox', key: 'inbox' },
    { label: 'Today', key: 'today' },
    { label: 'Upcoming', key: 'upcoming' },
    { label: 'Filters & Labels', key: 'filters' },
    {
      label: 'My Projects',
      key: 'myProjects',
      children: projects.map((project) => ({
        label: project.name,
        key: project.id,
      })),
    },
  ];

  return (
    <div className="App">
      <Layout>
        <Sider style={{ padding: '1vh', background: 'lightYellow', minHeight: '100vh' }}>
          <Button style={{ border: 'none', background: 'inherit' }}>
            <Avatar icon={<UserOutlined />} />
          </Button>
          <Menu
            mode="inline"
            defaultSelectedKeys={['today']}
            defaultOpenKeys={['myProjects']}
            items={menuItems}
            style={{ marginTop: '3vh', background: 'inherit', border: 'none' }}
          />
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

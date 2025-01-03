import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TodoistApi } from "@doist/todoist-api-typescript";

const { Option } = Select;
const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN;
const api = new TodoistApi(apiToken);

export default function AddTaskButton({
  projectId,
  tasks,
  setTasks,
  isEditing = false,
  setIsEditing,
  task = null,
  onSave,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing && task) {
      form.setFieldsValue({
        content: task.content,
        description: task.description,
        due_date: task.due_date ? task.due_date : null,
        priority: task.priority || 1,
      });
    }
  }, [isEditing, task, form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing?.(false);
    form.resetFields();
  };

  const handleAddTask = async (values) => {
    const { content, description, due_date, priority } = values;

    if (isEditing && task) {
      onSave({
        ...task,
        content,
        description,
        due_date: due_date ? due_date.format("YYYY-MM-DD") : undefined,
        priority,
      });
      form.resetFields();
      return;
    }

    try {
      const newTask = await api.addTask({
        content,
        description,
        due_date: due_date ? due_date.format("YYYY-MM-DD") : undefined,
        priority,
        project_id: projectId,
      });

      message.success("Task added successfully!");
      setTasks((prev) => [...prev, newTask]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div>
      {!isEditing && (
        <Button type="text" icon={<PlusOutlined />} onClick={showModal}>
          Add Task
        </Button>
      )}
      <Modal
        title={isEditing ? "Edit Task" : "Add Task"}
        visible={isEditing || isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item
            label="Task Content"
            name="content"
            rules={[{ required: true, message: "Please enter task content!" }]}
          >
            <Input placeholder="Enter task content" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter task description" rows={3} />
          </Form.Item>
          <Form.Item label="Due Date" name="due_date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Select placeholder="Select priority">
              <Option value={1}>Low</Option>
              <Option value={2}>Medium</Option>
              <Option value={3}>High</Option>
              <Option value={4}>Urgent</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// AddProjectModal.jsx
import PropTypes from "prop-types";
import { Modal, Form, Input, Checkbox, Button } from "antd";

const AddProjectModal = ({ isVisible, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Add New Project"
      visible={isVisible}
      onCancel={onCancel}
      footer={null} // Use Form buttons instead
    >
      <Form
        name="addProjectForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={onCancel}
        autoComplete="off"
      >
        <Form.Item
          label="Project Title"
          name="projectTitle"
          rules={[
            { required: true, message: "Please input your project title!" },
          ]}
        >
          <Input placeholder="Enter project title" />
        </Form.Item>

        <Form.Item
          name="isFavorite"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Mark as Favorite</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add Project
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddProjectModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddProjectModal;

// EditOrDeleteProjectModal.jsx
import PropTypes from "prop-types";
import { Modal, Form, Input, Checkbox, Button } from "antd";

const EditOrDeleteProjectModal = ({
  actionTypeOnProject,
  isVisible,
  onCancel,
  onEditSubmit,
  onDelete,
  form
}) => {
  return (
    <Modal
      title={
        actionTypeOnProject === "edit" ? "Edit Project" : "Delete Project"
      }
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      {actionTypeOnProject === "edit" ? (
        <Form form={form} layout="vertical" onFinish={onEditSubmit}>
          <Form.Item
            label="Project Title"
            name="name"
            rules={[
              { required: true, message: "Please input your project name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isFavorite"
            valuePropName="checked"
          >
            <Checkbox>Mark as Favorite</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Save Changes
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>Are you sure you want to delete this project?</p>
          <Button
            type="primary"
            danger
            onClick={onDelete}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      )}
    </Modal>
  );
};

EditOrDeleteProjectModal.propTypes = {
  actionTypeOnProject: PropTypes.oneOf(["edit", "delete"]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  form: PropTypes.object.isRequired,
};

export default EditOrDeleteProjectModal;

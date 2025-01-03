import { Flex } from "antd";
import { useParams } from "react-router-dom";

export default function IndividualProject({ tasks }) {
  const { id } = useParams();
  const filteredTasks = tasks.filter((task) => task.projectId === id);
  console.log(filteredTasks);
  return (
    <Flex
      style={{
        padding: "10px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1>Individual Project, will show project ID here.</h1>{" "}
      <h3>Project ID: {id}</h3>
      <p>FIltered tasks length: {filteredTasks.length}</p>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <div key={task.id} style={{ margin: "20px" }}>
            <div>Task Name: {task.content}</div>
            <div>
              Task completion status: {task.isCompleted ? "Done" : "Not Done"}
            </div>
          </div>
        ))
      ) : (
        <p>No tasks found for this project.</p>
      )}
    </Flex>
  );
}

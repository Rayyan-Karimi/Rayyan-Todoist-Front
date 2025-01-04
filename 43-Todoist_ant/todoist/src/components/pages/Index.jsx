// Index Page
import { Flex } from "antd";
export default function Index() {
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "60%",
        flexDirection: "column", 
        textAlign: "center", 
      }}
    >
      <img
        src="/todoist-home.png"
        alt="Todoist Home"
        style={{
          maxWidth: "100%",
          height: "auto",
          marginBottom: "1rem",
        }}
      />
      <h3 style={{ marginBottom: "0.5rem" }}>Start small (or dream big)...</h3>
      <p>Add your tasks or find a template to get started with your project.</p>
    </Flex>
  );
}

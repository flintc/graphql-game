import React from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "@storybook/react/demo";
import UserList from "../components/UserList";

export default {
  title: "Button"
};

export const text = () => (
  <Button onClick={action("clicked")}>Hello Button</Button>
);

export const emoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

export const test = () => {
  return (
    <UserList
      data={[
        { id: 0, name: "GEo" },
        { id: 1, name: "CB" }
      ]}
    />
  );
};

import { configure } from "@storybook/react";
import "../src/styles/tailwind.css";
import "../src/styles/custom.css";
// automatically import all files ending in *.stories.js
configure(require.context("../src/stories", true, /\.stories\.js$/), module);

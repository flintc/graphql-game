import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
import { useGesture } from "react-use-gesture";

const triggerActionOn = -80;
const maxSlide = -150;
export const useDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const [foo, setFoo] = React.useState("foo");

  const [isDraggingSetOnce, setIsDraggingSetOnce] = React.useState(false);
  const [ariaDragState, setAriaDragState] = React.useState(0);

  // const animation = useAnimation();
  const bind = useGesture(
    {
      onDrag: ({ dragging, movement, canceled }) => {
        setFoo(
          JSON.stringify({
            movement,
          })
        );
        if (
          dragging &&
          !canceled &&
          movement[0] < 0 &&
          movement[0] > maxSlide
        ) {
          // animation.start({ x: movement[0] });
          setAriaDragState(movement[0]);
          if (movement[0] <= triggerActionOn && !isDraggingSetOnce) {
            setOpen(true);
          }
        }
      },
      onDragEnd: () => {
        // setIsDraggingSetOnce(false);
        setAriaDragState(0);
        // animation.start({ x: 0 });
      },
    },
    {
      drag: {
        axis: "x",
      },
    }
  );
  return {
    containerProps: { ...bind() },
    drawerProps: {
      open,
      onOpenChange: setOpen,
    },
  };
};

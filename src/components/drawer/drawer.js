import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

const DrawerControlled = ({ open, onOpenChange, trigger, close, children }) => {
  const triggerComponent = trigger ? trigger : "Open Dialog";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        id="trigger"
        asChild={trigger !== undefined ? true : false}
        className={
          trigger
            ? "" :"bg-blue-400  rounded-full px-4 py-2 text-white fixed bottom-16 right-6"
        }
      >
        {triggerComponent}
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Overlay forceMount asChild>
            <motion.div
              // id="foo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                // delay: 0.2,
                // duration: 1
                damping: 90,
              }}
              className="fixed inset-0 bg-white/20"
            ></motion.div>
          </Dialog.Overlay>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <Dialog.Content
            forceMount
            className="fixed inset-0 z-50 grid place-content-center"
          >
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { translateX: "100%" },
                show: {
                  translateX: "0%",
                  transition: {
                    // duration: 0.2,
                    type: "spring",
                    stiffness: 1000,
                    damping: 50,
                    mass: 1,
                    // velocity: 1000
                  },
                },
              }}
              className="fixed inset-0 overflow-hidden rounded-l-3xl bg-gray-3"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.15,
                }}
                className="flex flex-col h-screen overflow-hidden"
              >
                <div className="flex-1 pb-10 overflow-y-auto">{children}</div>
                <div className="fixed bottom-0 w-full ">
                  <Dialog.Close asChild>
                    {close ? (
                      close
                    ) : (
                      <button className="w-full px-4 py-2">Close</button>
                    )}
                  </Dialog.Close>
                </div>
              </motion.div>
            </motion.div>
          </Dialog.Content>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

const DrawerUncontrolled = (props) => {
  const [open, setOpen] = React.useState(false);
  return <DrawerControlled open={open} onOpenChange={setOpen} {...props} />;
};

export const Drawer = ({ open, onOpenChange, ...props }) => {
  if (open === undefined) {
    return <DrawerUncontrolled {...props} />;
  } else {
    return (
      <DrawerControlled {...props} open={open} onOpenChange={onOpenChange} />
    );
  }
};

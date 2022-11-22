import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
// const { SCROLL_AREA_CSS_PROPS } = ScrollAreaPrimitive;

export default function ScrollArea({ children }) {
  return (
    <ScrollAreaPrimitive.Root
      id="content"
      // className={`relative z-0 flex-1 max-w-full max-h-full text-gray-600 bg-gray-200 h-96 scrollarea `}
    >
      <ScrollAreaPrimitive.Viewport
        id="datasets"
        // className="relative "
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        type="always"
        // className="absolute top-0 bottom-0 right-0 w-4 transition-opacity select-none"
      >
        <ScrollAreaPrimitive.Thumb
        // className="absolute top-0 left-0 bg-pink-400 rounded-full select-none"
        />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

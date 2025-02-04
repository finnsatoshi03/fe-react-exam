/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  forwardRef,
  HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be rendered inside <Popover>");
  }
  return context;
}

interface PopoverProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentRef,
      }}
    >
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ children, asChild, ...props }, ref) => {
  const { open, setOpen, triggerRef } = usePopoverContext();

  const handleClick = () => {
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      ...props,
      ...children.props,
    } as any);
  }

  return (
    <button
      ref={(node) => {
        if (node)
          (triggerRef as React.MutableRefObject<HTMLButtonElement>).current =
            node;
        if (typeof ref === "function") ref(node);
        else if (ref && node)
          (ref as React.MutableRefObject<HTMLButtonElement>).current = node;
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PopoverContent({
  children,
  className = "",
  ...props
}: PopoverContentProps) {
  const { open, triggerRef, contentRef } = usePopoverContext();

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (triggerRef.current) {
      setReferenceElement(triggerRef.current);
    }
    if (contentRef.current) {
      setPopperElement(contentRef.current);
    }
  }, [triggerRef, contentRef]);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "preventOverflow", enabled: true },
    ],
  });

  if (!open) return null;

  const content = (
    <div
      ref={(node) => {
        if (node)
          (contentRef as React.MutableRefObject<HTMLDivElement>).current = node;
        setPopperElement(node);
      }}
      className={`z-50 min-w-[8rem] rounded-md bg-white p-4 shadow-md ${className}`}
      style={styles.popper}
      {...attributes.popper}
      {...props}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

export function PopoverClose() {
  const { setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="w-full text-left"
    >
      Close
    </button>
  );
}

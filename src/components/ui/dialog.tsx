import React, { createContext, useContext, ReactNode } from "react";

type DialogContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

interface DialogProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be wrapped in <Dialog />");
  }
  return context;
};

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const Trigger = ({ children, asChild = false }: DialogTriggerProps) => {
  const { onOpenChange } = useDialog();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => onOpenChange(true),
    });
  }

  return (
    <div onClick={() => onOpenChange(true)} className="inline-block">
      {children}
    </div>
  );
};

const Content = ({ children, className = "" }: DialogContentProps) => {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-in fade-in zoom-in relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg duration-300 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

const Header = ({ children, className = "" }: DialogHeaderProps) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

const Title = ({ children, className = "" }: DialogTitleProps) => {
  return (
    <h2
      className={`text-lg leading-none font-semibold tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
};

const Description = ({ children, className = "" }: DialogDescriptionProps) => {
  return (
    <p className={`mt-2 text-sm text-gray-500 ${className}`}>{children}</p>
  );
};

const Footer = ({ children, className = "" }: DialogFooterProps) => {
  return (
    <div className={`mt-6 flex justify-end space-x-2 ${className}`}>
      {children}
    </div>
  );
};

const DialogComponent = Object.assign(Dialog, {
  Trigger,
  Content,
  Header,
  Title,
  Description,
  Footer,
});

export default DialogComponent;

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from "react-icons/io5";

// Context
interface DialogContextType {
  isOpen: boolean;
  onClose: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }
  return context;
};

// Root Dialog Component
interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  return (
    <DialogContext.Provider value={{ isOpen: open ?? false, onClose: () => onOpenChange?.(false) }}>
      {children}
    </DialogContext.Provider>
  );
}

// Trigger Component
interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function DialogTrigger({ children, asChild = false }: DialogTriggerProps) {
  const { onClose } = useDialog();
  
  if (asChild) {
    return children;
  }

  return (
    <button onClick={() => onClose()}>
      {children}
    </button>
  );
}

// Content Component
interface DialogContentProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function DialogContent({ children, maxWidth = 'md' }: DialogContentProps) {
  const { isOpen, onClose } = useDialog();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-bronzeDark-bronze1/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-xl bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 p-6 shadow-xl shadow-bronzeDark-bronze1/10 ring-1 ring-bronzeDark-bronze4/50`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-bronzeDark-bronze9 transition-all hover:bg-bronzeDark-bronze3 hover:text-bronzeDark-bronze12 active:scale-95"
          >
            <IoClose className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Header Component
interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: React.ElementType;
}

export function DialogHeader({ children, className = '', icon: Icon }: DialogHeaderProps) {
  return (
    <div className={`space-y-2 pr-8 ${className}`}>
      {Icon && (
        <div className="mb-4 inline-block rounded-lg bg-bronzeDark-bronze3 p-2">
          <Icon className="h-6 w-6 text-bronzeDark-bronze9" />
        </div>
      )}
      {children}
    </div>
  );
}

// Title Component
interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-xl font-semibold text-bronzeDark-bronze12 ${className}`}>
      {children}
    </h2>
  );
}

// Description Component
interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-bronzeDark-bronze11 ${className}`}>
      {children}
    </p>
  );
}

// Footer Component
interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`mt-6 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}

// Button Components for Dialog
interface DialogButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
  className?: string;
}

export function DialogButton({ 
  children, 
  onClick, 
  variant = 'default',
  className = '' 
}: DialogButtonProps) {
  const variantClasses = {
    default: 'bg-bronzeDark-bronze3 hover:bg-bronzeDark-bronze4 text-bronzeDark-bronze12',
    primary: 'bg-bronzeDark-bronze9 hover:bg-bronzeDark-bronze8 text-bronzeDark-bronze1',
    ghost: 'hover:bg-bronzeDark-bronze3 text-bronzeDark-bronze11'
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-95 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
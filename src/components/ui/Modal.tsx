import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
  // দ্বিতীয় modal প্রথমটার উপরে দেখানোর জন্য
  layer?: "base" | "top";
}

// একাধিক modal একসাথে খুললে scroll lock ঠিক রাখার জন্য
let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

const lockBodyScroll = () => {
  if (lockCount === 0) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    // scrollbar চলে গেলে page যেন ডানে সরে না যায়
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount += 1;
};

const unlockBodyScroll = () => {
  lockCount = Math.max(lockCount - 1, 0);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
};

const Modal = ({
  title,
  subtitle,
  onClose,
  children,
  size = "lg",
  layer = "base",
}: ModalProps) => {
  useEffect(() => {
    lockBodyScroll();
    return unlockBodyScroll;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className={`animate-modal-fade fixed inset-0 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4 ${
        layer === "top" ? "z-[60]" : "z-50"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`animate-modal-pop flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-(--background) shadow-2xl sm:max-h-[85dvh] sm:rounded-2xl ${
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl"
        }`}
      >
        {/* Header: scroll করলেও উপরে থাকে */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-(--border-color) px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-(--heading-text)">
              {title}
            </h2>
            {subtitle && (
              <p className="truncate text-sm text-(--paragraph-text)">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-(--paragraph-text) transition hover:bg-(--card)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body: শুধু এই অংশ scroll হবে */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
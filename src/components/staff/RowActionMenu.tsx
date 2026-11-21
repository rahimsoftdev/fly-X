import { useEffect, useRef, useState } from "react";
import { Check, Eye, MoreVertical, Trash2, Undo2 } from "lucide-react";
import type { TravelStatus } from "@/types/travel.type";
// import type { TravelStatus } from "@/types/custom-travel.types";

interface Props {
  status: TravelStatus;
  onView: () => void;
  onChangeStatus: (status: TravelStatus) => void;
  onDelete: () => void;
}

const MENU_WIDTH = 190;

const RowActionMenu = ({ status, onView, onChangeStatus, onDelete }: Props) => {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = () => setPos(null);

  const toggle = () => {
    if (pos) return close();
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH });
  };

  useEffect(() => {
    if (!pos) return;

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (btnRef.current?.contains(target)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const itemClass =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-(--foreground) hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="rounded p-1 text-(--paragraph-text) hover:bg-(--card)"
        aria-label="Actions"
      >
        <MoreVertical size={18} />
      </button>

      {pos && (
        <div
          ref={menuRef}
          style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
          className="fixed z-40 overflow-hidden rounded-lg border border-(--border-color) bg-(--background) py-1 shadow-lg"
        >
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              close();
              onView();
            }}
          >
            <Eye size={15} /> View Details
          </button>

          <button
            type="button"
            className={itemClass}
            disabled={status === "confirmed"}
            onClick={() => {
              close();
              onChangeStatus("confirmed");
            }}
          >
            <Check size={15} /> Mark as Confirmed
          </button>

          <button
            type="button"
            className={itemClass}
            disabled={status === "interested"}
            onClick={() => {
              close();
              onChangeStatus("interested");
            }}
          >
            <Undo2 size={15} /> Mark as Interested
          </button>

          <div className="my-1 border-t border-(--border-color)" />

          <button
            type="button"
            className={`${itemClass} text-red-600!`}
            onClick={() => {
              close();
              onDelete();
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </>
  );
};

export default RowActionMenu;
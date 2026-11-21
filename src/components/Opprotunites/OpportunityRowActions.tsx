import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MoreVertical } from "lucide-react";
import type { ManageOpportunity } from "@/types/opportunity-manage.types";
import type { OpportunityStatus } from "@/types/opportunity.types";
import {
  OPPORTUNITIES_PATH,
  STATUS_LABELS,
  STATUS_TRANSITIONS,
} from "@/utils/opportunity.util";

interface Props {
  opportunity: ManageOpportunity;
  disabled?: boolean;
  onChangeStatus: (id: string, status: OpportunityStatus) => void;
}

interface Position {
  right: number;
  top?: number;
  bottom?: number;
}

const OpportunityRowActions = ({
  opportunity,
  disabled,
  onChangeStatus,
}: Props) => {
  const [pos, setPos] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // বাইরে click, scroll, resize বা Escape-এ menu বন্ধ
  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const right = window.innerWidth - rect.right;
    const opensUp = rect.bottom + 200 > window.innerHeight;
    setPos(
      opensUp
        ? { right, bottom: window.innerHeight - rect.top + 4 }
        : { right, top: rect.bottom + 4 }
    );
  };

  // কেউ book করে ফেললে draft-এ ফেরানো যাবে না (backend-ও আটকাবে)
  const nextStatuses = STATUS_TRANSITIONS[opportunity.status].filter(
    (s) => !(s === "draft" && opportunity.bookedSeats > 0)
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label="Actions"
        aria-haspopup="menu"
        className="rounded-full p-2 text-(--paragraph-text) transition hover:bg-(--card) disabled:opacity-50"
      >
        <MoreVertical size={18} />
      </button>

      {pos && (
        <div
          ref={menuRef}
          role="menu"
          style={pos}
          className="fixed z-40 w-56 overflow-hidden rounded-xl border border-(--border-color) bg-(--background) py-1 shadow-xl"
        >
          <Link
            to={`${OPPORTUNITIES_PATH}/${opportunity._id}`}
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-(--heading-text) hover:bg-(--card)"
          >
            View Details
          </Link>

          {nextStatuses.length > 0 && (
            <div className="my-1 border-t border-(--border-color)" />
          )}

          {nextStatuses.map((status) => (
            <button
              key={status}
              type="button"
              role="menuitem"
              onClick={() => {
                setPos(null);
                onChangeStatus(opportunity._id, status);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-(--heading-text) hover:bg-(--card)"
            >
              Move to {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default OpportunityRowActions;
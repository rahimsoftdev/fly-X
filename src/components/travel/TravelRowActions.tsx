import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { ManageTravel } from "@/types/travel-manage.types";
import type { TravelStatus } from "@/types/travel.type";
import { capitalize, TRAVEL_STATUSES } from "@/utils/travel.util";

interface Props {
  travel: ManageTravel;
  disabled?: boolean;
  onViewDetails: (id: string) => void;
  onChangeStatus: (id: string, status: TravelStatus) => void;
}

interface Position {
  right: number;
  top?: number;
  bottom?: number;
}

const TravelRowActions = ({
  travel,
  disabled,
  onViewDetails,
  onChangeStatus,
}: Props) => {
  const [pos, setPos] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    const opensUp = rect.bottom + 220 > window.innerHeight;
    setPos(
      opensUp
        ? { right, bottom: window.innerHeight - rect.top + 4 }
        : { right, top: rect.bottom + 4 }
    );
  };

  const otherStatuses = TRAVEL_STATUSES.filter((s) => s !== travel.status);

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
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPos(null);
              onViewDetails(travel._id);
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-(--heading-text) hover:bg-(--card)"
          >
            View Details
          </button>

          <div className="my-1 border-t border-(--border-color)" />

          {otherStatuses.map((status) => (
            <button
              key={status}
              type="button"
              role="menuitem"
              onClick={() => {
                setPos(null);
                onChangeStatus(travel._id, status);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-(--heading-text) hover:bg-(--card)"
            >
              Mark as {capitalize(status)}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TravelRowActions;
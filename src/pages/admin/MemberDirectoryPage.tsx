import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Mail, MapPin, MoreVertical, Phone, X } from "lucide-react";
// import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/axios";

/* ---------------- Types ---------------- */
interface Member {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

interface MemberListResponse {
  items: Member[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

interface EditForm {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

/* ---------------- Constants ---------------- */
const LIMIT = 10;
const PAYMENT = "$199"; // backend-এ payment নেই, তাই আপাতত fixed
const MENU_WIDTH = 176;

const noScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/* ---------------- API ---------------- */
const getMembers = async (
  page: number,
  signal: AbortSignal
): Promise<MemberListResponse> => {
  const res = await api.get<{ success: boolean; data: MemberListResponse }>(
    "/users",
    { params: { page, limit: LIMIT }, signal }
  );
  return res.data.data;
};

const updateMember = async (id: string, body: EditForm): Promise<void> => {
  await api.patch(`/users/${id}`, body);
};

/* ---------------- Row actions (3-dot) ---------------- */
const RowActions = ({
  onView,
  onEdit,
}: {
  onView: () => void;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (open) return setOpen(false);
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    const menuHeight = 96;
    const openUp = window.innerHeight - rect.bottom < menuHeight + 8;
    const left = Math.min(
      Math.max(8, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - 8
    );
    setPos({
      top: openUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left,
    });
    setOpen(true);
  };

  // বাইরে click, scroll, resize বা Escape-এ বন্ধ
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
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
  }, [open]);

  const itemClass =
    "block w-full rounded-lg px-3 py-2 text-left text-sm text-(--heading-text) transition hover:bg-(--card)";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Actions"
        aria-haspopup="menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-(--paragraph-text) transition hover:bg-(--card) hover:text-(--heading-text)"
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
            className="fixed z-[90] rounded-xl border border-(--border-color) bg-(--background) p-1.5 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onView();
              }}
              className={itemClass}
            >
              View Details
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className={itemClass}
            >
              Edit
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

/* ---------------- Details modal ---------------- */
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 rounded-xl bg-(--card) p-4">
    <span className="mt-0.5 shrink-0 text-(--paragraph-text)">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-(--paragraph-text)">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-(--heading-text)">
        {value || "—"}
      </p>
    </div>
  </div>
);

const MemberDetailsModal = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-(--border-color) bg-(--background) p-5 shadow-xl sm:p-6 ${noScrollbar}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-(--heading-text)">
              {member.name}
            </h3>
            <p className="text-sm text-(--paragraph-text)">Member details</p>
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

        <div className="mt-5 space-y-3">
          <InfoRow icon={<Mail size={16} />} label="Email" value={member.email} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={member.phone} />
          <InfoRow
            icon={<MapPin size={16} />}
            label="Address"
            value={member.address}
          />

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "City", value: member.city },
              { label: "State", value: member.state },
              { label: "Zip Code", value: member.zipCode },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-(--card) p-4">
                <p className="text-xs text-(--paragraph-text)">{f.label}</p>
                <p className="mt-0.5 break-words text-sm font-medium text-(--heading-text)">
                  {f.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-blue-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* ---------------- Edit modal ---------------- */
const inputClass =
  "w-full rounded-lg border border-(--border-color) bg-(--background) px-3 py-2.5 text-sm text-(--heading-text) outline-none transition placeholder:text-(--paragraph-text)/60 focus:border-primary disabled:opacity-60";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-sm text-(--heading-text)">{label}</span>
    {children}
  </label>
);

// firstName/lastName না এলে name ভেঙে নেওয়া হয়
const splitName = (m: Member) => {
  if (m.firstName || m.lastName) {
    return { firstName: m.firstName ?? "", lastName: m.lastName ?? "" };
  }
  const [first = "", ...rest] = m.name.trim().split(/\s+/);
  return { firstName: first, lastName: rest.join(" ") };
};

const MemberEditModal = ({
  member,
  onClose,
  onSaved,
}: {
  member: Member;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [form, setForm] = useState<EditForm>(() => ({
    ...splitName(member),
    address: member.address,
    zipCode: member.zipCode,
    city: member.city,
    state: member.state,
    phone: member.phone,
    email: member.email,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const set =
    (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const body = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()])
    ) as unknown as EditForm;

    if (Object.values(body).some((v) => v === "")) {
      setError("Please fill in all fields.");
      return;
    }

    setSaving(true);
    try {
      await updateMember(member.id, body);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-(--border-color) bg-(--background) p-5 shadow-xl sm:p-7 ${noScrollbar}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-(--heading-text) sm:text-2xl">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-(--paragraph-text)">
              Please enter your details as they appear on your ID.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-(--paragraph-text) transition hover:bg-(--card) disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-(--border-color) pt-5 sm:grid-cols-2">
          <Field label="First Name">
            <input
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Enter your full name"
              disabled={saving}
              className={inputClass}
            />
          </Field>
          <Field label="Last Name">
            <input
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Enter your last name"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Address">
              <input
                value={form.address}
                onChange={set("address")}
                placeholder="Enter your full address"
                disabled={saving}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Zip Code">
              <input
                value={form.zipCode}
                onChange={set("zipCode")}
                placeholder="Enter Zip Code"
                disabled={saving}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="City">
            <input
              value={form.city}
              onChange={set("city")}
              placeholder="New York City"
              disabled={saving}
              className={inputClass}
            />
          </Field>
          <Field label="State">
            <input
              value={form.state}
              onChange={set("state")}
              placeholder="New York"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="Enter your phone number"
              disabled={saving}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter your email"
              disabled={saving}
              className={inputClass}
            />
          </Field>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

/* ---------------- Page ---------------- */
const MemberDirectoryPage = () => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Member | null>(null);
  const [editing, setEditing] = useState<Member | null>(null);

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => getMembers(page, signal),
    [page]
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const from = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold leading-tight text-(--heading-text) sm:text-2xl lg:text-3xl">
          Member Directory
        </h1>
        <p className="mt-1 text-sm text-(--paragraph-text)">
          System Operational
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
          {error}
        </p>
      )}

      {/* Table (lg+) */}
      <div className="hidden rounded-xl border border-(--border-color) lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--paragraph-text)">
              <th className="w-[16%] px-4 py-3">Name</th>
              <th className="w-[15%] px-4 py-3">Phone Number</th>
              <th className="w-[24%] px-4 py-3">Email</th>
              <th className="w-[24%] px-4 py-3">Address</th>
              <th className="w-[11%] px-4 py-3">Payment</th>
              <th className="w-[10%] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-60" : ""}>
            {items.map((m) => (
              <tr
                key={m.id}
                className="border-b border-(--border-color) align-middle text-(--heading-text) last:border-b-0"
              >
                <td className="break-words px-4 py-4 font-medium">{m.name}</td>
                <td className="whitespace-nowrap px-4 py-4">{m.phone}</td>
                <td className="break-all px-4 py-4">{m.email}</td>
                <td className="break-words px-4 py-4">{m.fullAddress}</td>
                <td className="px-4 py-4">{PAYMENT}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end">
                    <RowActions
                      onView={() => setSelected(m)}
                      onEdit={() => setEditing(m)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile + tablet) */}
      <div
        className={`grid gap-3 sm:grid-cols-2 sm:gap-4 lg:hidden ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-(--border-color) p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-(--heading-text)">
                  {m.name}
                </p>
                <p className="mt-0.5 text-xs text-(--paragraph-text)">
                  {m.phone}
                </p>
              </div>
              <div className="shrink-0">
                <RowActions
                  onView={() => setSelected(m)}
                  onEdit={() => setEditing(m)}
                />
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-(--border-color) pt-4 text-xs">
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Email</dt>
                <dd className="mt-0.5 break-all font-medium text-(--heading-text)">
                  {m.email}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Address</dt>
                <dd className="mt-0.5 break-words font-medium text-(--heading-text)">
                  {m.fullAddress}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-(--paragraph-text)">Payment</dt>
                <dd className="mt-0.5 font-medium text-(--heading-text)">
                  {PAYMENT}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {isLoading && !data && (
        <p className="py-12 text-center text-sm text-(--paragraph-text)">
          Loading...
        </p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="px-4 py-12 text-center text-sm text-(--paragraph-text)">
          No members found.
        </p>
      )}

      {/* Pagination */}
      {meta && meta.total > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-sm text-primary sm:text-left">
            Showing {from} to {to} of {meta.total} results
          </p>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
            <button
              type="button"
              disabled={!meta.hasPrevPage || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!meta.hasNextPage || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-primary px-5 py-2 text-sm font-medium text-primary transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <MemberDetailsModal
          member={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <MemberEditModal
          member={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default MemberDirectoryPage;
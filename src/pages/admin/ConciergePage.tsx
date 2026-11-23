import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/axios";

/* ---------------- Types ---------------- */
interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface StaffListResponse {
  items: Staff[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

interface CreateForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

/* ---------------- Constants ---------------- */
const LIMIT = 10;
const MIN_PASSWORD = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: CreateForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

/* ---------------- API ---------------- */
const getStaff = async (
  page: number,
  signal: AbortSignal
): Promise<StaffListResponse> => {
  const res = await api.get<{ success: boolean; data: StaffListResponse }>(
    "/users/staff",
    { params: { page, limit: LIMIT }, signal }
  );
  return res.data.data;
};

const createStaff = async (body: CreateForm): Promise<void> => {
  await api.post("/users/staff", body);
};

const deleteStaff = async (id: string): Promise<void> => {
  await api.delete(`/users/staff/${id}`);
};

/* ---------------- Delete button ---------------- */
const DeleteButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label="Delete staff"
    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-(--heading-text) transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
  >
    <Trash2 size={18} />
  </button>
);

/* ---------------- Confirm delete modal ---------------- */
const ConfirmDeleteModal = ({
  name,
  loading,
  onConfirm,
  onCancel,
}: {
  name: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-(--border-color) bg-(--background) p-5 shadow-xl sm:p-6"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
          <Trash2 size={20} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-(--heading-text) sm:text-lg">
          Delete staff?
        </h3>
        <p className="mt-2 text-sm text-(--paragraph-text)">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-(--heading-text)">{name}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-full border border-(--border-color) px-5 py-2 text-sm font-medium text-(--heading-text) transition hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- New Concierge modal ---------------- */
const inputClass =
  "w-full rounded-lg border border-(--border-color) bg-(--background) px-3 py-2.5 text-sm text-(--heading-text) outline-none transition placeholder:text-xs placeholder:text-(--paragraph-text)/60 focus:border-primary disabled:opacity-60";

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

const NewConciergeModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
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
    (key: keyof CreateForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const body: CreateForm = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password, // পাসওয়ার্ড trim করা হয় না
    };

    if (!body.name || !body.email || !body.phone || !body.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_REGEX.test(body.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (body.password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }

    setSaving(true);
    try {
      await createStaff(body);
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create account"
      );
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
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-(--border-color) bg-(--background) p-5 shadow-xl [scrollbar-width:none] [-ms-overflow-style:none] sm:p-7 [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-(--heading-text)">
            New Concierge
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--card) text-(--paragraph-text) transition hover:text-(--heading-text) disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="Enter your name here"
              autoComplete="off"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter your e-mail here"
              autoComplete="off"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <Field label="Telephone">
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="Enter telephone no. here"
              autoComplete="off"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <Field label={`Password ( minimum ${MIN_PASSWORD} characters)`}>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
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

        <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full bg-(--card) px-6 py-2.5 text-sm font-medium text-(--heading-text) transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------------- Page ---------------- */
const ConciergePage = () => {
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<Staff | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => getStaff(page, signal),
    [page]
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const from = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  const askDelete = (staff: Staff) => {
    setActionError(null);
    setPending(staff);
  };

  const confirmDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    setActionError(null);
    try {
      await deleteStaff(pending.id);
      setPending(null);

      // পাতার শেষ জনকে মুছলে আগের পাতায় যাও, নইলে একই পাতা নতুন করে আনো
      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        refetch();
      }
    } catch (err) {
      setPending(null);
      setActionError(
        err instanceof Error ? err.message : "Failed to delete staff"
      );
    } finally {
      setDeleting(false);
    }
  };

  // নতুন অ্যাকাউন্ট খোলার পর: modal বন্ধ, তালিকা নতুন (সবার আগে নতুনজন আসে)
  const handleCreated = () => {
    setShowCreate(false);
    setActionError(null);
    if (page !== 1) {
      setPage(1);
    } else {
      refetch();
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-(--heading-text) sm:text-2xl lg:text-3xl">
            Concierge
          </h1>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            System Operational
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-6"
        >
          <Plus size={16} />
          New Concierge
        </button>
      </div>

      {(error || actionError) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10">
          {error ?? actionError}
        </p>
      )}

      {/* Table (md+) */}
      <div className="hidden rounded-xl border border-(--border-color) md:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-(--border-color) text-xs font-medium text-(--paragraph-text)">
              <th className="w-[30%] px-4 py-3">Name</th>
              <th className="w-[25%] px-4 py-3">Phone Number</th>
              <th className="w-[35%] px-4 py-3">Email</th>
              <th className="w-[10%] px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-60" : ""}>
            {items.map((s) => (
              <tr
                key={s.id}
                className="border-b border-(--border-color) align-middle text-(--heading-text) last:border-b-0"
              >
                <td className="break-words px-4 py-4 font-medium">{s.name}</td>
                <td className="whitespace-nowrap px-4 py-4">{s.phone}</td>
                <td className="break-all px-4 py-4">{s.email}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end">
                    <DeleteButton
                      onClick={() => askDelete(s)}
                      disabled={deleting}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className={`space-y-3 md:hidden ${isLoading ? "opacity-60" : ""}`}>
        {items.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-(--border-color) p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-(--heading-text)">
                  {s.name}
                </p>
                <p className="mt-0.5 text-xs text-(--paragraph-text)">
                  {s.phone}
                </p>
              </div>
              <div className="shrink-0">
                <DeleteButton
                  onClick={() => askDelete(s)}
                  disabled={deleting}
                />
              </div>
            </div>

            <div className="mt-4 border-t border-(--border-color) pt-4 text-xs">
              <p className="text-(--paragraph-text)">Email</p>
              <p className="mt-0.5 break-all font-medium text-(--heading-text)">
                {s.email}
              </p>
            </div>
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
          No staff found.
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

      {/* New Concierge modal */}
      {showCreate && (
        <NewConciergeModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Delete confirmation modal */}
      {pending && (
        <ConfirmDeleteModal
          name={pending.name}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default ConciergePage;
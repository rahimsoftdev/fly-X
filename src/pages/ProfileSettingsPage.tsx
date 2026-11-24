import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Flag,
  Hash,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/* ---------------- Types ---------------- */
interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

type ModalKind = "profile" | "password";
type ModalStep = "confirm" | "saving" | "success" | "error";

interface ModalState {
  kind: ModalKind;
  step: ModalStep;
  error?: string;
}

const EMPTY_PROFILE: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

const EMPTY_PASSWORD: PasswordForm = { current: "", next: "", confirm: "" };

const MIN_PASSWORD_LENGTH = 6; // server (auth.ts) এর সাথে মিল রাখা

const inputClass =
  "w-full rounded-lg border border-transparent bg-gray-100 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white dark:bg-slate-800 dark:text-gray-50 dark:placeholder:text-slate-500 dark:focus:bg-slate-900";

/* ---------------- Small UI pieces ---------------- */
function Field({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon: LucideIcon;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-slate-200">
        <Icon size={13} className="text-gray-500 dark:text-slate-400" />
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mt-5 grid animate-pulse gap-5 md:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="mb-2 h-3 w-24 rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-10 rounded-lg bg-gray-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Modal ---------------- */
const MODAL_TEXT: Record<
  ModalKind,
  { confirmTitle: string; confirmBody: string; successTitle: string; successBody: string }
> = {
  profile: {
    confirmTitle: "Save profile changes?",
    confirmBody:
      "Your personal information will be updated. Please make sure everything looks correct before continuing.",
    successTitle: "Profile updated",
    successBody: "Your personal information has been saved successfully.",
  },
  password: {
    confirmTitle: "Change your password?",
    confirmBody:
      "You will use the new password the next time you sign in. Do you want to continue?",
    successTitle: "Password changed",
    successBody: "Your password has been updated successfully.",
  },
};

function Modal({
  state,
  onConfirm,
  onClose,
}: {
  state: ModalState;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const text = MODAL_TEXT[state.kind];
  const saving = state.step === "saving";

  // Esc চাপলে বন্ধ (saving চলাকালীন নয়)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saving, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={() => !saving && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-2xl dark:bg-slate-800"
      >
        {!saving && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        )}

        {state.step === "error" ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <AlertCircle size={34} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
              Could not save
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {state.error}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={onConfirm}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        ) : state.step !== "success" ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              {state.kind === "profile" ? (
                <User size={26} />
              ) : (
                <ShieldCheck size={26} />
              )}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {text.confirmTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {text.confirmBody}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={onClose}
                disabled={saving}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
              <CheckCircle2 size={34} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {text.successTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {text.successBody}
            </p>

            <button
              onClick={onClose}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Check size={16} />
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function ProfileSettingsPage() {
  const { user, isPending } = useCurrentUser();

  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [profileErrors, setProfileErrors] = useState<Partial<Profile>>({});

  const [password, setPassword] = useState<PasswordForm>(EMPTY_PASSWORD);
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordForm>>({});

  const [modal, setModal] = useState<ModalState | null>(null);

  // Database এর আসল data form এ বসাও।
  // serverKey ব্যবহার করা হয়েছে যাতে session refetch এ user এর অসম্পূর্ণ edit মুছে না যায়।
  const serverProfile: Profile | null = user
    ? {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        zipCode: user.zipCode ?? "",
      }
    : null;
  const serverKey = serverProfile ? JSON.stringify(serverProfile) : "";

  useEffect(() => {
    if (serverProfile) setProfile(serverProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  // modal খোলা থাকলে পেছনের পেজ scroll হবে না
  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal]);

  /* ---------- Validation ---------- */
  const validateProfile = () => {
    const e: Partial<Profile> = {};
    if (!profile.firstName.trim()) e.firstName = "First name is required";
    if (!profile.lastName.trim()) e.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(profile.email.trim()))
      e.email = "Enter a valid email address";
    if (profile.phone.replace(/\D/g, "").length < 7)
      e.phone = "Enter a valid phone number";
    if (!profile.address.trim()) e.address = "Address is required";
    if (!profile.city.trim()) e.city = "City is required";
    if (!profile.state.trim()) e.state = "State is required";
    if (!profile.zipCode.trim()) e.zipCode = "Zip code is required";
    setProfileErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePassword = () => {
    const e: Partial<PasswordForm> = {};
    if (!password.current) e.current = "Current password is required";
    if (password.next.length < MIN_PASSWORD_LENGTH)
      e.next = `New password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    else if (password.next === password.current)
      e.next = "New password must be different from the current one";
    if (password.confirm !== password.next)
      e.confirm = "Passwords do not match";
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- Submit handlers (modal খোলে) ---------- */
  const submitProfile = (e: FormEvent) => {
    e.preventDefault();
    if (validateProfile()) setModal({ kind: "profile", step: "confirm" });
  };

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (validatePassword()) setModal({ kind: "password", step: "confirm" });
  };

  /* ---------- Confirm: real save ---------- */
  const fail = (kind: ModalKind, message?: string) =>
    setModal({
      kind,
      step: "error",
      error: message ?? "Something went wrong. Please try again.",
    });

  const saveProfile = async () => {
    if (!user) return fail("profile", "You are not signed in.");

    const firstName = profile.firstName.trim();
    const lastName = profile.lastName.trim();

    // 1) name, phone, address, city, state, zipCode
    const { error } = await authClient.updateUser({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      city: profile.city.trim(),
      state: profile.state.trim(),
      zipCode: profile.zipCode.trim(),
    });
    if (error) return fail("profile", error.message);

    // 2) email (শুধু বদলালে)
    const newEmail = profile.email.trim();
    if (newEmail.toLowerCase() !== user.email.toLowerCase()) {
      const { error: emailError } = await authClient.changeEmail({ newEmail });
      if (emailError) return fail("profile", emailError.message);
    }

    setModal({ kind: "profile", step: "success" });
  };

  const savePassword = async () => {
    const { error } = await authClient.changePassword({
      currentPassword: password.current,
      newPassword: password.next,
      revokeOtherSessions: true, // অন্য device থেকে logout হবে
    });
    if (error) return fail("password", error.message);

    setPassword(EMPTY_PASSWORD);
    setPasswordErrors({});
    setModal({ kind: "password", step: "success" });
  };

  const handleConfirm = async () => {
    if (!modal) return;
    const kind = modal.kind;
    setModal({ kind, step: "saving" });

    try {
      if (kind === "profile") await saveProfile();
      else await savePassword();
    } catch {
      fail(kind);
    }
  };

  const setProfileField = (key: keyof Profile, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setProfileErrors((er) => ({ ...er, [key]: undefined }));
  };

  const setPasswordField = (key: keyof PasswordForm, value: string) => {
    setPassword((p) => ({ ...p, [key]: value }));
    setPasswordErrors((er) => ({ ...er, [key]: undefined }));
  };

  return (
    <div className="min-h-dvh w-full bg-white text-gray-900 dark:bg-slate-900 dark:text-gray-50">
      {/* Header */}
      <header>
        <h1 className="font-serif text-2xl font-medium sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-slate-400">
          Manage your account preferences and personal information
        </p>
      </header>

      <div className="mt-4 w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900">
        {/* ============ Personal Information ============ */}
        <form onSubmit={submitProfile} noValidate>
          <h2 className="border-b border-gray-200 pb-4 text-sm font-medium dark:border-slate-700">
            Personal Information
          </h2>

          {isPending ? (
            <ProfileSkeleton />
          ) : !user ? (
            <p className="mt-5 text-sm text-gray-500 dark:text-slate-400">
              Please sign in to view your profile.
            </p>
          ) : (
            <>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field icon={User} label="First Name" error={profileErrors.firstName}>
                  <input
                    value={profile.firstName}
                    onChange={(e) => setProfileField("firstName", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field icon={User} label="Last Name" error={profileErrors.lastName}>
                  <input
                    value={profile.lastName}
                    onChange={(e) => setProfileField("lastName", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field icon={Mail} label="Email Address" error={profileErrors.email}>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfileField("email", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field icon={Phone} label="Phone Number" error={profileErrors.phone}>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfileField("phone", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field icon={Home} label="Address" error={profileErrors.address}>
                    <input
                      value={profile.address}
                      onChange={(e) => setProfileField("address", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field icon={MapPin} label="City" error={profileErrors.city}>
                  <input
                    value={profile.city}
                    onChange={(e) => setProfileField("city", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field icon={Flag} label="State" error={profileErrors.state}>
                  <input
                    value={profile.state}
                    onChange={(e) => setProfileField("state", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field icon={Hash} label="Zip Code" error={profileErrors.zipCode}>
                  <input
                    value={profile.zipCode}
                    onChange={(e) => setProfileField("zipCode", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-700 sm:w-auto"
              >
                <Save size={14} />
                Save Changes
              </button>
            </>
          )}
        </form>

        {/* ============ Change Password ============ */}
        <form onSubmit={submitPassword} noValidate className="mt-10">
          <h2 className="flex items-center gap-2 border-b border-gray-200 pb-4 text-sm font-medium dark:border-slate-700">
            <ShieldCheck size={15} />
            Change your Password
          </h2>

          <div className="mt-5 space-y-3">
            <PasswordField
              value={password.current}
              onChange={(v) => setPasswordField("current", v)}
              placeholder="Current Password"
              error={passwordErrors.current}
            />
            <PasswordField
              value={password.next}
              onChange={(v) => setPasswordField("next", v)}
              placeholder="New Password"
              error={passwordErrors.next}
            />
            <PasswordField
              value={password.confirm}
              onChange={(v) => setPasswordField("confirm", v)}
              placeholder="Confirm Password"
              error={passwordErrors.confirm}
            />
          </div>

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Save size={14} />
            Save Changes
          </button>
        </form>
      </div>

      {modal && (
        <Modal
          state={modal}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import FormField from "@/components/ui/FormField";
import type { RegisterPayload } from "@/types/user.type";
import { register } from "@/utils/auth.util";

const initialForm: RegisterPayload = {
  firstName: "", lastName: "", address: "", zipCode: "", city: "",
  state: "", phone: "", email: "", password: "", confirmPassword: "",userId:null
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // register er por kothay jabe (/user, /admin ba /staff):
  const [redirectPath, setRedirectPath] = useState("/");

  // After success, go to dashboard (/role)
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate(redirectPath), 1500);
    return () => clearTimeout(timer);
  }, [success, redirectPath, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = register(form);
    if (!user) {
      setError("This email is already registered.");
      return;
    }
    setRedirectPath(`/${user.role}`);
    setSuccess(true);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5 border-b border-(--border-color) pb-4">
        <h1 className="font-playfair text-2xl font-semibold text-(--heading-text) md:text-3xl">
          Personal Information
        </h1>
        <p className="text-xs text-(--paragraph-text) md:text-sm">
          Please enter your details as they appear on your ID.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="firstName" name="firstName" label="First Name" required
            placeholder="Enter your first name" value={form.firstName} onChange={handleChange} />
          <FormField id="lastName" name="lastName" label="Last Name" required
            placeholder="Enter your last name" value={form.lastName} onChange={handleChange} />
        </div>

        <FormField id="address" name="address" label="Address" required
          placeholder="Enter your full address" value={form.address} onChange={handleChange} />

        <FormField id="zipCode" name="zipCode" label="Zip Code" required inputMode="numeric"
          placeholder="Enter Zip Code" value={form.zipCode} onChange={handleChange} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="city" name="city" label="City" required
            placeholder="New York City" value={form.city} onChange={handleChange} />
          <FormField id="state" name="state" label="State" required
            placeholder="New York" value={form.state} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="phone" name="phone" type="tel" label="Phone Number" required
            placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
          <FormField id="email" name="email" type="email" label="Email" required
            placeholder="Enter your email" value={form.email} onChange={handleChange} />
        </div>

        <FormField id="password" name="password" type="password" label="Password" required
          placeholder="Enter your password" value={form.password} onChange={handleChange} />

        <FormField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" required
          placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} />

        {/* Registration fee card */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-(--border-color) bg-white p-4 dark:bg-(--card) md:p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-(--heading-text)">Registration Fee</p>
              <p className="text-xs text-(--paragraph-text)">One-time registration fee</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-(--heading-text) md:text-3xl">$199</p>
            <p className="text-xs text-(--paragraph-text)">USD</p>
          </div>
        </div>

        <p className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2.5 text-xs text-primary">
          <Lock className="size-3.5 shrink-0" aria-hidden="true" />
          Your payment information is secure and encrypted.
        </p>

        {error && (
          <p role="alert" className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2.5 text-sm font-medium text-green-600 dark:text-green-400">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            Registration successful! Redirecting to dashboard...
          </p>
        )}

        <button
          type="submit"
          disabled={success}
          className="w-full cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-medium text-white
                     transition-all duration-300 hover:bg-secondary active:scale-[0.99]
                     disabled:cursor-not-allowed disabled:opacity-60"
        >
          {success ? "Redirecting..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import FormField from "@/components/ui/FormField";
import { login } from "@/utils/auth.util";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const user = login(email, password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    navigate(`/${user.role}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-playfair text-2xl font-semibold text-(--heading-text) md:text-3xl">
          Login Your Account
        </h1>
        <p className="text-xs text-(--paragraph-text) md:text-sm">
          Sign in to access your membership account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="login-email"
          type="email"
          label="Email"
          required
          placeholder="Enter Your E-mail here"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
        />
        <FormField
          id="login-password"
          type="password"
          label="Password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
        />

        {error && (
          <p role="alert" className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-medium
                     text-white transition-all duration-300 hover:bg-secondary active:scale-[0.99]"
        >
          Next
        </button>
      </form>

      <p className="text-center text-xs text-(--paragraph-text) md:text-sm">
        Not A Member Yet?{" "}
        <Link to="/register" className="font-medium text-(--heading-text) underline underline-offset-4 hover:text-primary">
          SignUp
        </Link>
      </p>
    </div>
  );
}
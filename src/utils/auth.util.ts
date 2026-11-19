import type { RegisterPayload } from "@/types/user.type";
import { authClient } from "@/lib/auth-client";

export type AuthResult =
  | { ok: true; role: string }
  | { ok: false; message: string };

// sign in/up er por useSession() er store e user ashar jonno opekkha kore.
// Eta na korle navigate er somoy layout user = null dekhe /login e pathay.
const waitForSession = (): Promise<void> =>
  new Promise((resolve) => {
    const atom = authClient.$store.atoms.session;
    let unsubscribe: (() => void) | undefined;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      unsubscribe?.();
      resolve();
    };

    // max 3 second, tar beshi atkabe na
    const timer = setTimeout(finish, 3000);

    unsubscribe = atom.subscribe((state: { data?: { user?: unknown } | null }) => {
      if (state?.data?.user) finish();
    });

    // session refetch trigger kore
    authClient.$store.notify("$sessionSignal");
  });

// Register: backend er better-auth e user create kore
export const register = async (data: RegisterPayload): Promise<AuthResult> => {
  const { confirmPassword: _confirm, userId: _userId, ...rest } = data;

  const { data: res, error } = await authClient.signUp.email({
    ...rest,
    email: rest.email.trim().toLowerCase(),
    name: `${rest.firstName} ${rest.lastName}`, // better-auth e name required
  });

  if (error || !res) {
    return { ok: false, message: error?.message || "Registration failed." };
  }

  await waitForSession();
  return { ok: true, role: (res.user as { role?: string }).role ?? "user" };
};

// Login: backend er better-auth diye sign in
export const login = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const { data: res, error } = await authClient.signIn.email({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !res) {
    return { ok: false, message: error?.message || "Invalid email or password." };
  }

  await waitForSession();
  return { ok: true, role: (res.user as { role?: string }).role ?? "user" };
};

// Logout: better-auth session clear kore
export const logout = async (): Promise<void> => {
  await authClient.signOut();
};
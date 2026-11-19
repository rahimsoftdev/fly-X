import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user as
    | (NonNullable<typeof data>["user"] & { role?: string })
    | undefined;

  return {
    user: user ?? null,
    role: user?.role ?? null,
    isPending,
  };
}
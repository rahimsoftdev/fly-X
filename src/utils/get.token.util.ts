import { authClient } from "@/lib/auth-client";

export const getTokenData = async () => {
    const { data, error } = await authClient.token();

    if (error) {
        console.error("Token generation failed:", error);
        return null;
    }

    console.log(data, "token data");

    return data?.token;
};
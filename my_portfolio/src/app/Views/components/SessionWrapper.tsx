// components/SessionWrapper.tsx
"use client";

import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";

export default function SessionWrapper() {
    const { data: session } = useSession();

    if (session) {
        return <p>Welcome, {session.user?.name}</p>;
    }

    return <LoginButton />;
}
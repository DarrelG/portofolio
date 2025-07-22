// components/SessionWrapper.tsx
"use client";

import { useSession } from "next-auth/react";

export default function SessionWrapper() {
    const { data: session } = useSession();

    if (session) {
        return <p>Welcome, {session.user?.name}</p>;
    }

    return <p>Not logged in</p>;
}

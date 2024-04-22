
"use client"

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <button onClick={handleLogout} className="button is-light">
            Log out
        </button>
    );
}

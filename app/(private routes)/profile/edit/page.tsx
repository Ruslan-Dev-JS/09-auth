"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "../EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const { setUser: setAuthUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const current = await getMe();
        if (cancelled) return;
        setUser(current);
        setUsername(current.username);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load profile");
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      setAuthUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/profile");
  }

  if (!user && !error) {
    return (
      <main className={css.mainContent}>
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email ?? "—"}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSubmitting}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && (
            <p style={{ color: "#dc3545", fontSize: 14, marginTop: 8 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}


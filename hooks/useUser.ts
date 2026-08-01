"use client";

import { useState, useEffect, useCallback } from "react";
import { getPocketBase } from "@/lib/pocketbase";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  created?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pb = getPocketBase();
    try {
      if (pb.authStore.isValid && pb.authStore.model) {
        setUser(pb.authStore.model as unknown as UserRecord);
      } else {
        // Clear invalid auth state silently
        pb.authStore.clear();
      }
    } catch {
      pb.authStore.clear();
    }
    setLoading(false);

    // Listen for auth changes
    const unsub = pb.authStore.onChange(() => {
      try {
        if (pb.authStore.isValid && pb.authStore.model) {
          setUser(pb.authStore.model as unknown as UserRecord);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  const logout = useCallback(() => {
    const pb = getPocketBase();
    pb.authStore.clear();
    setUser(null);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, phone?: string) => {
    const pb = getPocketBase();
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name,
        phone: phone || "",
        emailVisibility: true,
      });
      await pb.collection("users").authWithPassword(email, password);
      setUser(pb.authStore.model as unknown as UserRecord);
    } catch (err) {
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const pb = getPocketBase();
    await pb.collection("users").authWithPassword(email, password);
    setUser(pb.authStore.model as unknown as UserRecord);
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserRecord>) => {
    const pb = getPocketBase();
    if (!user) return;
    const updated = await pb.collection("users").update(user.id, data);
    setUser(updated as unknown as UserRecord);
  }, [user]);

  return { user, loading, logout, register, login, updateProfile };
}

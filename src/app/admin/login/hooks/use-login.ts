"use client";

import { signInAdmin } from "@/app/admin/login/services/login-service";
import { useState } from "react";

export function useLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submitLogin = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await signInAdmin({ email, password });
      onSuccess();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Falha ao autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    message,
    setEmail,
    setPassword,
    submitLogin,
  };
}
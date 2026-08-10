"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { AdminLoginFormData, adminLoginSchema } from "../types/login-types";
import { loginAdmin } from "../services/login-service";


export function useAdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: yupResolver(adminLoginSchema),
    mode: "onTouched",
  });

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (data: AdminLoginFormData) => {
      setAuthError(null);
      const authData = await loginAdmin(data);

      if (!authData?.user) {
        throw new Error("Usuário não encontrado");
      }

      return authData;
    },
    onSuccess: () => {
      setIsRedirecting(true);
      router.replace("/admin/dashboard");
      router.refresh();
    },
    onError: (error: Error) => {
      setIsRedirecting(false);
      const message =
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : "Ocorreu um erro ao acessar a conta. Tente novamente.";

      setAuthError(message);
    },
  });

  const handleInputChange = () => {
    if (authError) setAuthError(null);
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return {
    form,
    isPending: isPending || isRedirecting,
    authError,
    showPassword,
    togglePassword,
    handleInputChange,
    onSubmit: form.handleSubmit((data) => loginUser(data)),
  };
}
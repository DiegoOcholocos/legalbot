"use client";
import { menu } from "@/services/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Unauthorized({ user, permisos, children }) {
  const router = useRouter();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const hasAccess = permisos.includes(user.tipoUsuario);
  
    if (!hasAccess) {
      router.push("../pages/404");
      return;
    }
  return children
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ADMIN_USER = "admin";
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "senhaSuperSecreta";

export default function AdminLoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/pedidos");
    } else {
      setError("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ede3f6] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm border border-[#d4af37]/40 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-[#6d348b] mb-2 text-center">
          Login Admin
        </h1>
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border border-[#d4af37]/40 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d348b]/40"
          autoFocus
        />
        <input
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="border border-[#d4af37]/40 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6d348b]/40"
        />
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-[#6d348b] text-white rounded py-2 font-bold hover:bg-[#4b206b] transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

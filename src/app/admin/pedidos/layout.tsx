import Link from "next/link";
import React from "react";

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("admin_auth") !== "true"
  ) {
    window.location.href = "/admin/login";
    return null;
  }
  return <>{children}</>;
}

export default function AdminPedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar simples */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-4">
          <div className="text-xl font-bold mb-8">Painel Administrativo</div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/admin/pedidos"
              className="px-3 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Pedidos
            </Link>
          </nav>
        </aside>
        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-8 w-full">{children}</main>
      </div>
    </AdminProtectedRoute>
  );
}

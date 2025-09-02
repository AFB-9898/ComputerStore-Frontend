import { Link } from "react-router-dom";

export function AdminPanel() {
  const adminLinks = [
    {
      to: "/admin/productos",
      label: "Gestionar Productos",
      color: "from-blue-600 to-blue-500",
      icon: (
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
    {
      to: "/admin/categorias",
      label: "Gestionar Categorías",
      color: "from-green-600 to-green-500",
      icon: (
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      to: "/admin/tecnicos",
      label: "Gestionar Técnicos",
      color: "from-yellow-600 to-yellow-500",
      icon: (
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a2 2 0 00-2-2h-3m-6 4h-5v-2a2 2 0 012-2h3m-3-4h6m-6 0H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2h-3m-3 4h6"
          />
        </svg>
      ),
    },
    {
      to: "/admin/servicios",
      label: "Gestionar Servicios Técnicos",
      color: "from-purple-600 to-purple-500",
      icon: (
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      to: "/admin/inventario",
      label: "Gestionar de Usuarios",
      color: "from-red-600 to-red-500",
      icon: (
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0v6l-8 4m0-10L4 13m8 4v6m-8-6l8-4 8 4V7l-8-4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 animate-fade-in-down">
          Panel de Administración
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminLinks.map((link, idx) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative bg-gradient-to-r ${link.color} text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 flex items-center justify-center space-x-3 animate-fade-in-up delay-${idx * 100}`}
            >
              {link.icon}
              <span className="text-lg font-semibold">{link.label}</span>
              <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition duration-300 rounded-2xl"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
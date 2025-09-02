export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Créditos */}
        <p className="mb-4 md:mb-0 text-sm md:text-base">
          Desarrollado por{" "}
          <span className="text-blue-400 font-semibold">Abraham</span> y{" "}
          <span className="text-red-400 font-semibold">Yordy</span>
        </p>

        {/* Redes sociales */}
        <div className="flex gap-4 text-sm md:text-base">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-100 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">© 2025 GrupoTwo. Todos los derechos reservados.</p>
    </footer>
  );
}

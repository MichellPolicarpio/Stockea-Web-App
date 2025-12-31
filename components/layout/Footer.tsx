export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-t border-slate-200 dark:border-gray-700 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Copyright */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-gray-300 text-sm font-medium">
            © {currentYear} Sistema de Inventarios. Todos los derechos reservados.
          </p>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-2">
            Sistema de gestión de inventarios y verificaciones
          </p>
        </div>
      </div>
    </footer>
  )
}



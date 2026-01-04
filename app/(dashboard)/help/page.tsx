'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, User, Building2, Package, ClipboardCheck, Users, BarChart3, Settings, Shield, Key, Search, Mail, ArrowRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function HelpPage() {

  const faqs = [
    {
      question: "¿Cómo agrego un nuevo item al inventario?",
      answer: "Solo los administradores y propietarios pueden agregar items. Navega al departamento correspondiente, ve a la pestaña 'Inventario' y haz clic en el botón 'Agregar Item'. Completa el formulario con los detalles del artículo y guarda."
    },
    {
      question: "¿Cómo funciona el proceso de inspección?",
      answer: "Los verificadores asignados acceden al departamento y crean una 'Nueva Inspección'. Deben evaluar cada ítem del inventario marcándolo como 'Nuevo', 'Bueno', 'Regular', 'Malo' o 'Faltante'. Al finalizar, se genera un reporte con fecha y firma digital."
    },
    {
      question: "¿Puedo acceder desde mi celular?",
      answer: "Sí, la aplicación es totalmente responsiva. Puedes acceder desde el navegador de tu smartphone o tablet para realizar inspecciones en terreno, tomar fotos y gestionar el inventario cómodamente."
    },
    {
      question: "¿Quién puede ver los reportes financieros?",
      answer: "El acceso a reportes financieros y sensibles está restringido estrictamente a los usuarios con rol de 'Administrador'. Los propietarios solo ven datos relacionados con sus propiedades."
    },
    {
      question: "¿Cómo recupero mi contraseña?",
      answer: "Si olvidaste tu contraseña, contacta a un administrador para que resetee tus credenciales. Por seguridad, el sistema no envía contraseñas por correo automáticamente en esta versión."
    }
  ]

  const modules = [
    {
      title: 'Dashboard General',
      icon: BarChart3,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Vista general con métricas clave, ocupación y estados recientes.'
    },
    {
      title: 'Gestión de Edificios',
      icon: Building2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      description: 'Administración de estructuras, direcciones y departamentos asociados.'
    },
    {
      title: 'Control de Inventario',
      icon: Package,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      description: 'Registro detallado de bienes, estados de conservación y valores.'
    },
    {
      title: 'Usuarios y Roles',
      icon: Users,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      description: 'Control de acceso, creación de cuentas y asignación de permisos.'
    },
    {
      title: 'Inspecciones',
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      description: 'Auditorías de estado, reportes de daños y verificación de inventario.'
    },
    {
      title: 'Configuración',
      icon: Settings,
      color: 'text-slate-500',
      bg: 'bg-slate-50 dark:bg-slate-800',
      description: 'Ajustes del sistema, preferencias y personalización de cuenta.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 md:px-8 md:pb-12 space-y-10 animate-in fade-in duration-500">



      {/* Roles Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Roles y Permisos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-rose-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-600">
                <Key className="h-5 w-5" /> Administrador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Tiene control total sobre el sistema. Puede gestionar usuarios, crear edificios y ver todos los reportes.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 font-medium">
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>Gestión total de usuarios</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>Configuración del sistema</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-2"></span>Auditoría completa</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <User className="h-5 w-5" /> Propietario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Gestiona sus propiedades asignadas. Puede ver el estado de sus inventarios y reportes financieros.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 font-medium">
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>Vista de departamentos propios</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>Reportes de sus unidades</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>Gestión básica de items</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <ClipboardCheck className="h-5 w-5" /> Verificador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Encargado de realizar las inspecciones en terreno. Valida el estado físico del inventario.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 font-medium">
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Realizar Check-in/Check-out</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Reportar daños con fotos</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Sin acceso a datos sensibles</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modules Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Módulos del Sistema</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <div key={module.title} className="group p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-default">
                <div className={`w-12 h-12 rounded-lg ${module.bg} ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{module.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {module.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Preguntas Frecuentes</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Resolvemos tus dudas más comunes sobre la plataforma. Si no encuentras lo que buscas, contáctanos.
            </p>
            <div className="hidden md:block">
              <Mail className="h-24 w-24 text-slate-200 dark:text-slate-800 mb-4" />
              <p className="text-sm font-medium text-slate-900">¿Dudas técnicas?</p>
              <a href="mailto:soporte@inventario.com" className="text-sm text-primary hover:underline">soporte@inventario.com</a>
            </div>
          </div>

          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-slate-200 dark:border-b-slate-800">
                  <AccordionTrigger className="text-left font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer support */}
      <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
        <p className="text-slate-500 text-sm">
          Sistema de Gestión de Inventarios v1.0.0 &copy; 2025
        </p>
      </div>

    </div>
  )
}

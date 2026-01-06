'use client'

import { useState } from 'react'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    MoreVertical,
    ArrowUpRight,
    Calendar,
    Box,
    AlertTriangle,
    CheckCircle2,
    Download,
    ClipboardList,
    Building as BuildingIcon,
    Home,
    Clock,
    MapPin,
    Armchair,
    Tv,
    Utensils,
    Palette,
    Zap,
    TrendingUp,
    DollarSign,
    Wrench,
    Users,
    BadgePercent,
    ClipboardCheck,
    ChevronRight
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    LabelList,
    LineChart,
    Line,
    Legend
} from 'recharts'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

// --- MOCK DATA FOR VERIFIER ---
const MOCK_ASSIGNMENTS = [
    { id: 1, building: 'Casa Tortuga', apartment: '101', date: '2024-10-15', status: 'pending', priority: 'high', address: 'Av. Costera 123' },
    { id: 2, building: 'Villa Sol', apartment: '304', date: '2024-10-16', status: 'pending', priority: 'medium', address: 'Calle Sol 45' },
    { id: 3, building: 'Casa Bamba', apartment: '002', date: '2024-10-10', status: 'overdue', priority: 'high', address: 'Blvd. Las Palmas 88' },
    { id: 4, building: 'El Palmar', apartment: 'PH-1', date: '2024-10-20', status: 'completed', priority: 'low', address: 'Zona Hotelera Km 5' },
]

function VerifierDashboard({ user }: { user: any }) {
    const router = useRouter()
    const pendingCount = MOCK_ASSIGNMENTS.filter(a => a.status !== 'completed').length

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Buenos días, {user?.name?.split(' ')[0] || 'Verificador'}</h1>
                <p className="text-muted-foreground mt-1">Tienes {pendingCount} inspecciones pendientes. Aquí está tu agenda.</p>
            </div>

            {/* KPIs Rápidos */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6">
                <Card className="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 text-center md:text-left">
                    <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center justify-between gap-2">
                        <div>
                            <p className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest truncate">Pendientes</p>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1 md:mt-2">{pendingCount}</h3>
                        </div>
                        <div className="hidden md:flex h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center text-blue-600 dark:text-blue-400">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 text-center md:text-left">
                    <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center justify-between gap-2">
                        <div>
                            <p className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-widest truncate">Realizadas</p>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1 md:mt-2">12</h3>
                        </div>
                        <div className="hidden md:flex h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Listado Principal */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    Tu Agenda
                </h2>
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {MOCK_ASSIGNMENTS.map((task) => (
                            <div key={task.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex-shrink-0">
                                        <span className="text-[10px] font-bold uppercase">{new Date(task.date).toLocaleString('es-ES', { month: 'short' }).replace('.', '')}</span>
                                        <span className="text-lg font-bold leading-none">{new Date(task.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                            {task.building} <span className="text-slate-400 font-normal">/ {task.apartment}</span>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {task.address}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {task.status === 'completed' ? 'Completado' : task.status === 'overdue' ? 'Atrasado' : 'Pendiente'}
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => router.push(`/inspections/${task.id}`)} className="hidden sm:flex">
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

// --- OWNER DASHBOARD (NEW) ---
function OwnerDashboard({ user }: { user: any }) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [selectedProp, setSelectedProp] = useState('Casa Tortuga')

    // Mock Data for Owner
    const maintenanceCosts = [
        { month: 'Ene', costo: 12000, ingreso: 45000 },
        { month: 'Feb', costo: 8500, ingreso: 42000 },
        { month: 'Mar', costo: 15000, ingreso: 48000 },
        { month: 'Abr', costo: 9000, ingreso: 46000 },
        { month: 'May', costo: 11000, ingreso: 51000 },
        { month: 'Jun', costo: 7500, ingreso: 49000 },
    ]

    const propertyStatus = [
        { name: 'Casa Tortuga', occupied: 8, vacant: 2, maintenance: 0 },
        { name: 'Depto Centro', occupied: 1, vacant: 0, maintenance: 0 },
        { name: 'Villa Sol', occupied: 3, vacant: 1, maintenance: 1 },
    ]

    const recentInspections = [
        { id: 1, property: 'Casa Tortuga', date: 'Hoy, 09:00 AM', verifier: 'Carlos V.', status: 'Completada', issues: 0 },
        { id: 2, property: 'Depto Centro', date: 'Ayer, 16:30 PM', verifier: 'Ana M.', status: 'Completada', issues: 3 },
        { id: 3, property: 'Villa Sol', date: 'Pendiente', verifier: 'Carlos V.', status: 'Pendiente', issues: 0 },
        { id: 4, property: 'Casa Tortuga', date: '12 Ene', verifier: 'Roberto G.', status: 'Completada', issues: 1 },
    ]

    // Data for the toggle widget 
    // We map generic IDs here to match gradients defined in the chart
    const propertyHealthData: Record<string, any[]> = {
        'Casa Tortuga': [
            { name: 'Buen Estado', value: 85, fillUrl: 'url(#gradientBlue)' },
            { name: 'Desgaste', value: 10, fillUrl: 'url(#gradientAmber)' },
            { name: 'Dañado', value: 5, fillUrl: 'url(#gradientRed)' },
        ],
        'Depto Centro': [
            { name: 'Buen Estado', value: 95, fillUrl: 'url(#gradientBlue)' },
            { name: 'Desgaste', value: 3, fillUrl: 'url(#gradientAmber)' },
            { name: 'Dañado', value: 2, fillUrl: 'url(#gradientRed)' },
        ]
    }

    const currentHealthData = propertyHealthData[selectedProp] || propertyHealthData['Casa Tortuga']

    return (
        <div className="animate-in fade-in duration-700 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

                {/* 1. WIDGET "AUDITA" (Izquierda Arriba) 
                    - ROW SPAN 2: Ocupa la altura de los KPIs + Gráfico Financiero
                */}
                <div className="xl:col-span-4 xl:row-span-2 order-last xl:order-none">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg p-6 text-white shadow-xl h-full flex flex-col justify-between group">
                        {/* Decoracion */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500 opacity-10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold tracking-tight mb-2 leading-tight">Tu Propiedad,<br />Bajo Control.</h2>
                            <p className="text-blue-200 text-sm">Gestiona incidencias al instante y mantén el valor de tu inversión.</p>
                        </div>

                        {/* Imagen Hero */}
                        <div className="flex-1 flex items-center justify-center w-full relative z-10 mt-4 min-h-[220px]">
                            <img src="/Imagen_PortadaClaro.png" alt="Portada" className="w-full h-auto object-contain max-h-[250px] scale-110 drop-shadow-2xl brightness-110" />
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 mt-4 font-semibold shadow-lg shadow-blue-900/50">
                            Auditar Ahora <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 2. KPIs GROUP (Derecha Arriba - Fila 1) */}
                <div className="xl:col-span-8 order-1 xl:order-none">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-full">
                        {/* KPI 1 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2 justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <BadgePercent className="h-4 w-4 text-emerald-500" /> Ocupación
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">92%</span>
                                <span className="text-xs font-medium text-emerald-500">+4%</span>
                            </div>
                        </div>
                        {/* KPI 2 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2 justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <DollarSign className="h-4 w-4 text-blue-500" /> Ingresos (Est.)
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">$45k</span>
                                <span className="text-xs font-medium text-slate-400">Mensual</span>
                            </div>
                        </div>
                        {/* KPI 3 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2 justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <Wrench className="h-4 w-4 text-orange-500" /> Mantenimiento
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">3</span>
                                <span className="text-xs font-medium text-orange-500">Tickets</span>
                            </div>
                        </div>
                        {/* KPI 4 */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-2 justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <Box className="h-4 w-4 text-orange-600" /> Valor Inv.
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">$1.2M</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. GRÁFICO FINANCIERO (Derecha Medio - Fila 2) */}
                <div className="xl:col-span-8 order-2 xl:order-none">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[300px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rendimiento Financiero</h3>
                                <p className="text-sm text-slate-500">Ingresos vs Gastos</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Ingreso
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 rounded-full bg-orange-500"></span> Gasto
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={maintenanceCosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngresoOwner" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGastoOwner" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                                    />
                                    <Area type="monotone" dataKey="ingreso" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresoOwner)" name="Ingresos" />
                                    <Area type="monotone" dataKey="costo" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorGastoOwner)" name="Gastos" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. LISTA PROPIEDADES (Izquierda Abajo - Fila 3) */}
                <div className="xl:col-span-4 order-last xl:order-none">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-5 shadow-sm border border-slate-200 dark:border-slate-800 h-full">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Mis Propiedades</h3>
                        <div className="space-y-4">
                            {propertyStatus.map((prop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-slate-700 p-2 rounded-md shadow-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                                            <BuildingIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{prop.name}</p>
                                            <p className="text-xs text-slate-500">{(prop.occupied + prop.vacant + prop.maintenance)} unidades</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${prop.vacant === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {prop.vacant === 0 ? '100% Ocupado' : `${prop.vacant} Disp.`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. GRÁFICOS SECUNDARIOS (Derecha Abajo - Fila 3) */}
                <div className="xl:col-span-8 order-3 xl:order-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">

                        {/* Gráfico 5.1: VISOR INSPECCIONES */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[250px] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Visor de Inspecciones</h3>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 rounded-md">
                                    Ver todas <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-auto pr-1 space-y-3 custom-scrollbar">
                                {recentInspections.map((insp, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full shadow-sm ${insp.status === 'Completada' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {insp.status === 'Completada' ? <ClipboardCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{insp.property}</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{insp.date} • {insp.verifier}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {insp.status === 'Completada' ? (
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${insp.issues === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                    {insp.issues === 0 ? 'Aprobada' : `${insp.issues} Daños`}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                                    Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gráfico 5.2: Toggle & Pie (Admin Style) */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 h-full min-h-[250px] flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Estado de Activos</h3>
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    <button
                                        onClick={() => setSelectedProp('Casa Tortuga')}
                                        className={`text-xs font-medium px-3 py-1 rounded-md transition-all ${selectedProp === 'Casa Tortuga' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Casa Tortuga
                                    </button>
                                    <button
                                        onClick={() => setSelectedProp('Depto Centro')}
                                        className={`text-xs font-medium px-3 py-1 rounded-md transition-all ${selectedProp === 'Depto Centro' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Centro
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-4 items-center mt-2 justify-between">
                                {/* Chart Clean Style */}
                                <div className="relative h-[120px] w-[120px] mx-auto md:mx-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="gradientAmber" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                            <Pie
                                                data={currentHealthData}
                                                innerRadius={40}
                                                outerRadius={55}
                                                cornerRadius={6}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {currentHealthData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fillUrl} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                                            {currentHealthData[0].value}%
                                        </span>
                                        <span className="text-[8px] uppercase font-bold text-slate-400">OK</span>
                                    </div>
                                </div>

                                {/* Legend Right Side */}
                                <div className="flex flex-col gap-2 flex-1 min-w-[100px] justify-center">
                                    {currentHealthData.map((item, i) => {
                                        let dotColor = '#3b82f6';
                                        if (item.name === 'Desgaste') dotColor = '#f59e0b';
                                        if (item.name === 'Dañado') dotColor = '#ef4444';

                                        return (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor }} />
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                                            </div>
                                        )
                                    })}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                                        <p className="text-[10px] text-slate-400 text-right">Total: 142</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}


function AdminDashboard() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    // DATA
    const inventoryByBuilding = [
        { name: 'Casa Tortuga', items: 85, totalValue: 120000, growth: '+12.5%' },
        { name: 'Casa Bamba', items: 62, totalValue: 85000, growth: '+8.2%' },
        { name: 'Villa Sol', items: 58, totalValue: 72000, growth: '+5.1%' },
        { name: 'Vista Mar', items: 45, totalValue: 95000, growth: '+3.7%' },
        { name: 'El Palmar', items: 92, totalValue: 45000, growth: '+15.3%' },
    ]

    const conditionData = [
        { name: 'Buen estado', value: 75, color: '#3b82f6' }, // Blue-500
        { name: 'Inactivo', value: 10, color: '#10b981' }, // Emerald-500
        { name: 'Faltante', value: 10, color: '#ef4444' }, // Red-500
        { name: 'Dañado', value: 5, color: '#f59e0b' }, // Amber-500
    ]

    const activityData = [
        { month: 'Ene', inspections: 12 },
        { month: 'Feb', inspections: 18 },
        { month: 'Mar', inspections: 15 },
        { month: 'Abr', inspections: 25 },
        { month: 'May', inspections: 20 },
        { month: 'Jun', inspections: 32 },
    ]

    return (
        <div className="animate-in fade-in duration-700 space-y-6">

            {/* SQUARED BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

                {/* --- COLUMNA IZQUIERDA (HERO & RESUMEN) --- */}
                <div className="xl:col-span-4 flex flex-col gap-2 order-last xl:order-none">

                    {/* 1. HERO CARD (Blue Gradient) - SQUARED & CLEAN */}
                    <div className="relative overflow-hidden bg-gradient-to-b from-blue-400 to-blue-50 dark:from-blue-950 dark:to-slate-900 rounded-lg p-6 text-white shadow-lg shadow-blue-100/50 dark:shadow-none min-h-[540px] hidden md:flex flex-col justify-between group">

                        {/* Decoracion de fondo abstracta */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:opacity-15 transition-opacity duration-700" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 opacity-5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                        <div className="relative z-10 text-center w-full mt-4">
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2 leading-tight">Audita tu inmueble.<br />Cuida tu inversión.</h2>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-1 flex items-center justify-center w-full relative z-10">
                            <img src="/Imagen_PortadaClaro.png" alt="Portada" className="w-full h-auto object-contain max-h-[400px] scale-125 animate-in zoom-in-75 fade-in duration-1000 delay-200 fill-mode-both transition-transform duration-500 ease-out group-hover:scale-[1.3] dark:hidden" />
                            <img src="/ImagenPortada_ModoOscuro.png" alt="Portada" className="w-full h-auto object-contain max-h-[400px] scale-125 animate-in zoom-in-75 fade-in duration-1000 delay-200 fill-mode-both transition-transform duration-500 ease-out group-hover:scale-[1.3] hidden dark:block" />
                        </div>


                    </div>

                    {/* 2. Categorías Top (Lista Estilizada) - SQUARED */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200/50 dark:border-slate-800 flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Categorías Top</h3>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Mobiliario', items: 450, color: 'bg-blue-500', icon: Armchair },
                                { name: 'Electrónicos', items: 210, color: 'bg-emerald-500', icon: Tv },
                                { name: 'Cocina', items: 185, color: 'bg-orange-500', icon: Utensils },
                            ].map((cat, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg ${cat.color} bg-opacity-10 flex items-center justify-center text-${cat.color.split('-')[1]}-600 dark:text-${cat.color.split('-')[1]}-400 group-hover:scale-110 transition-transform duration-300`}>
                                                <cat.icon className={`h-5 w-5 text-${cat.color.replace('bg-', '')}`} style={{ color: 'var(--tw-text-opacity)' }} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{cat.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">Inventario activo</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">{cat.items}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(cat.items / 500) * 100}%`,
                                                background: `linear-gradient(to right, ${cat.color === 'bg-blue-500' ? '#2563eb' : cat.color === 'bg-emerald-500' ? '#059669' : '#ea580c'}, ${cat.color === 'bg-blue-500' ? '#bfdbfe' : cat.color === 'bg-emerald-500' ? '#a7f3d0' : '#fed7aa'})`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA (GRAPHS & DATA) --- */}
                <div className="xl:col-span-8 flex flex-col gap-2">

                    {/* FILA 1: KPIs Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                        {/* KPI 1: Estado Inventario (Donut Rediseñado) */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200/50 dark:border-slate-800 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Estado Activos</h3>
                                    <p className="text-xs text-slate-400">Salud global</p>
                                </div>
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full">
                                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-1">
                                <div className="relative h-[120px] w-[120px] mx-auto md:mx-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="gradientAmber" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2} />
                                                </linearGradient>
                                                <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                            <Pie
                                                data={conditionData}
                                                innerRadius={40}
                                                outerRadius={55}
                                                cornerRadius={6}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {conditionData.map((entry, index) => {
                                                    let fillUrl = `url(#gradientBlue)`;
                                                    if (entry.color === '#10b981') fillUrl = `url(#gradientEmerald)`;
                                                    if (entry.color === '#f59e0b') fillUrl = `url(#gradientAmber)`;
                                                    if (entry.color === '#ef4444') fillUrl = `url(#gradientRed)`;
                                                    if (entry.color === '#3b82f6') fillUrl = `url(#gradientBlue)`;

                                                    return <Cell key={`cell-${index}`} fill={fillUrl} />;
                                                })}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">75%</span>
                                        <span className="text-[8px] uppercase font-bold text-slate-400">Buen Estado</span>
                                    </div>
                                </div>

                                {/* Legend Compacta a la derecha */}
                                <div className="flex flex-col gap-2 flex-1 min-w-[90px]">
                                    {conditionData.slice(0, 4).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* KPI 2: Inspecciones (Area Chart Clean) */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Inspecciones</h3>
                                    <p className="text-xs text-slate-400">Rendimiento mensual</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">142</p>
                                    <p className="text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full inline-block">+18%</p>
                                </div>
                            </div>

                            <div className="h-[120px] w-full -ml-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="colorInsp2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                        <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInsp2)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* FILA 2: Wide Bar Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200/50 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Distribución por Edificio</h3>
                                <p className="text-xs text-slate-400">Total de items registrados</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full cursor-pointer">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Res.
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 text-slate-400 rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Com.
                                </span>
                            </div>
                        </div>

                        <div className="h-[230px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryByBuilding} barCategoryGap={0} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="orangeBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={30} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px 16px', backgroundColor: isDark ? '#1e293b' : '#fff' }}
                                    />
                                    <Bar dataKey="items"
                                        shape={(props: any) => {
                                            const { fill, x, y, width, height, index } = props; // Destructure index
                                            const isBlue = index % 2 === 0; // Use index for consistent coloring with Cells
                                            const strokeColor = isBlue ? '#3b82f6' : '#f97316';
                                            return (
                                                <g>
                                                    <rect x={x} y={y} width={width} height={height} fill={fill} rx={0} ry={0} />
                                                    <rect x={x} y={y} width={width} height={5} fill={strokeColor} /> {/* Increased height to 6 */}
                                                </g>
                                            );
                                        }}
                                    >
                                        <LabelList
                                            dataKey="items"
                                            position="top"
                                            style={{ fontSize: '24px', fontWeight: 400, fill: isDark ? '#fff' : '#0f172a' }}
                                            dy={-5}
                                        />
                                        <LabelList
                                            dataKey="items"
                                            position="insideBottom"
                                            content={(props: any) => {
                                                const { x, y, width, height, index } = props;
                                                const isBlue = index % 2 === 0;
                                                const bgColor = isBlue ? '#3b82f6' : '#f97316';

                                                return (
                                                    <g>
                                                        <rect x={x + width / 2 - 22} y={y + height - 26} width={44} height={18} rx={9} fill={bgColor} />
                                                        <text x={x + width / 2} y={y + height - 14} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
                                                            {inventoryByBuilding[index].growth}
                                                        </text>
                                                    </g>
                                                );
                                            }}
                                        />
                                        {inventoryByBuilding.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#blueBarGradient)" : "url(#orangeBarGradient)"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* FILA 3: Métricas Secundarias Estilo "Tarjetitas" */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 order-first md:order-none">
                        {/* Card Mini 1 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 md:p-5 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="mb-1.5 md:mb-2 p-2 md:p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg group-hover:scale-110 transition-transform">
                                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">4</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5 md:mt-1">Dañados</span>
                        </div>

                        {/* Card Mini 2 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 md:p-5 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="mb-1.5 md:mb-2 p-2 md:p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                                <BuildingIcon className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">5</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5 md:mt-1">Edificios</span>
                        </div>

                        {/* Card Mini 3 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 md:p-5 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="mb-1.5 md:mb-2 p-2 md:p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                                <Home className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">24</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5 md:mt-1">Deptos</span>
                        </div>

                        {/* Card Mini 4 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 md:p-5 shadow-sm border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="mb-1.5 md:mb-2 p-2 md:p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">98%</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-400 mt-0.5 md:mt-1">Salud</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { user } = useAuth()

    if (user?.role === 'verifier') {
        return <VerifierDashboard user={user} />
    }

    // NUEVO: Renderizar si es Owner
    if (user?.role === 'owner') {
        return <OwnerDashboard user={user} />
    }

    return <AdminDashboard />
}

'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    Palette
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
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

// MOCK DATA FOR VERIFIER
const MOCK_ASSIGNMENTS = [
    { id: 1, building: 'Casa Tortuga', apartment: '101', date: '2024-10-15', status: 'pending', priority: 'high', address: 'Av. Costera 123' },
    { id: 2, building: 'Villa Sol', apartment: '304', date: '2024-10-16', status: 'pending', priority: 'medium', address: 'Calle Sol 45' },
    { id: 3, building: 'Casa Bamba', apartment: '002', date: '2024-10-10', status: 'overdue', priority: 'high', address: 'Blvd. Las Palmas 88' },
    { id: 4, building: 'El Palmar', apartment: 'PH-1', date: '2024-10-20', status: 'completed', priority: 'low', address: 'Zona Hotelera Km 5' },
]

function VerifierDashboard({ user }: { user: any }) {
    const router = useRouter()
    const pendingCount = MOCK_ASSIGNMENTS.filter(a => a.status !== 'completed').length
    const nextAssignment = MOCK_ASSIGNMENTS.find(a => a.status === 'pending')

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Buenos días, {user?.name?.split(' ')[0] || 'Verificador'}</h1>
                <p className="text-muted-foreground mt-1">Tienes {pendingCount} inspecciones pendientes. Aquí está tu agenda.</p>
            </div>

            {/* KPIs Rápidos - Compacto Móvil */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6">
                {/* Card 1: Pendientes */}
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

                {/* Card 2: Realizadas */}
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
                            // Row Item Design
                            <div key={task.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors gap-4">
                                {/* Left: Info */}
                                <div className="flex gap-4">
                                    {/* Date Box */}
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

                                {/* Right: Status and Action */}
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

function AdminDashboard() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // MOCK DATA: Inventory Focus
    // 1. Inventory Volume per Building
    // 1. Inventory Volume per Building
    const inventoryByBuilding = [
        { name: 'Casa Tortuga', items: 85, totalValue: 120000 },
        { name: 'Casa Bamba', items: 62, totalValue: 85000 },
        { name: 'Villa Sol', items: 58, totalValue: 72000 },
        { name: 'Vista Mar', items: 45, totalValue: 95000 },
        { name: 'El Palmar', items: 92, totalValue: 45000 },
    ]

    // 2. Condition Status
    // 2. Condition Status
    const conditionData = [
        { name: 'Nuevo', value: 45, color: '#00A699' },
        { name: 'Bueno', value: 30, color: '#484848' },
        { name: 'Regular', value: 15, color: '#FC642D' },
        { name: 'Malo', value: 10, color: '#FF5A5F' },
    ]

    // 3. Activity Trend (Inspections Monthly)
    const activityData = [
        { month: 'Ene', inspections: 12 },
        { month: 'Feb', inspections: 18 },
        { month: 'Mar', inspections: 15 },
        { month: 'Abr', inspections: 25 },
        { month: 'May', inspections: 20 },
        { month: 'Jun', inspections: 32 },
    ]

    // 4. Radar Data: Wear & Tear by Zone (Incidents)
    const zoneHealthData = [
        { subject: 'Cocina', A: 65, fullMark: 100 },
        { subject: 'Sala', A: 45, fullMark: 100 },
        { subject: 'Baño', A: 30, fullMark: 100 },
        { subject: 'Recámaras', A: 25, fullMark: 100 },
        { subject: 'Terraza', A: 55, fullMark: 100 },
        { subject: 'Comedor', A: 20, fullMark: 100 },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. TOP METRICS ROW - Inventory Focused */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {/* Metric 1 */}
                <div className="flex flex-col gap-1 md:gap-2 p-2 md:p-0 bg-slate-50 dark:bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none">
                    <div className="flex items-center gap-2 md:justify-start">
                        <Box className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left leading-tight">Total Items</span>
                    </div>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">342</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-2 text-[10px] md:text-sm mt-1">
                        <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">
                            <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                            +12
                        </span>
                        <span className="text-slate-400 hidden sm:inline">nuevos</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col gap-1 md:gap-2 p-2 md:p-0 bg-slate-50 dark:bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none">
                    <div className="flex items-center gap-2 md:justify-start">
                        <ClipboardList className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left leading-tight">Inspecciones</span>
                    </div>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">14</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-2 text-[10px] md:text-sm mt-1">
                        <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium text-center leading-none">
                            Este mes
                        </span>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col gap-1 md:gap-2 p-2 md:p-0 bg-slate-50 dark:bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none">
                    <div className="flex items-center gap-2 md:justify-start">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left leading-tight">Atención</span>
                    </div>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">4</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-2 text-[10px] md:text-sm mt-1">
                        <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">
                            3 Dañados
                        </span>
                    </div>
                </div>

                {/* Metric 4 - Properties */}
                <div className="flex flex-col gap-1 md:gap-2 p-2 md:p-0 bg-slate-50 dark:bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none">
                    <div className="flex items-center gap-2 md:justify-start">
                        <BuildingIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center md:text-left leading-tight">Propiedades</span>
                    </div>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">5</h2>
                        <span className="text-sm text-slate-400 font-medium">Edificios</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-2 text-[10px] md:text-sm mt-1">
                        <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md">
                            <Home className="h-3 w-3 mr-1" />
                            24 Deptos
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (2/3) - Main Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* INVENTORY DISTRIBUTION CHART */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center pb-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Items por Edificio</h3>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryByBuilding} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                                        contentStyle={{
                                            backgroundColor: isDark ? '#0f172a' : '#fff',
                                            borderRadius: '8px',
                                            border: isDark ? '1px solid #1e293b' : 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            color: isDark ? '#fff' : '#000'
                                        }}
                                    />
                                    <Bar
                                        dataKey="items"
                                        fill="#FF5A5F"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    {/* BOTTOM ROW SPLIT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                        {/* DONUT CHART: Condition */}
                        <div className="space-y-4">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white text-center pb-2">Estado del Inventario</h4>
                            <div className="flex items-center gap-4 h-[180px]">
                                <div className="w-[180px] h-full flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={conditionData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {conditionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="relative -top-[105px] text-center pointer-events-none">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">75%</span>
                                        <p className="text-xs text-slate-400">Operativo</p>
                                    </div>
                                </div>

                                {/* Custom Legend */}
                                <div className="flex flex-col gap-2 text-sm flex-1">
                                    {conditionData.map((item) => (
                                        <div key={item.name} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 min-w-[80px]">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-slate-900 dark:text-white font-bold text-xs">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>



                        {/* AREA CHART: Verification Activity */}
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center pb-2">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white">Inspecciones</h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Historial Semestral</span>
                            </div>
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00A699" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#00A699" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value}`, 'Inspecciones']}
                                            contentStyle={{
                                                backgroundColor: isDark ? '#0f172a' : '#fff',
                                                borderRadius: '8px',
                                                border: isDark ? '1px solid #1e293b' : 'none',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                color: isDark ? '#fff' : '#000'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="inspections"
                                            stroke="#00A699"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorInspections)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>


                {/* RIGHT COLUMN (1/3) - Categories & Actions */}
                <div className="space-y-8">

                    {/* Top Categories */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-center pb-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Categorías Top</h3>
                        </div>

                        <div className="space-y-5">
                            {/* Category 1 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Armchair className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">Mobiliario</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">450 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 w-[65%] rounded-full" />
                                </div>
                            </div>

                            {/* Category 2 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Tv className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">Electrónicos</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">210 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500 w-[35%] rounded-full" />
                                </div>
                            </div>

                            {/* Category 3 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Utensils className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">Cocina</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">185 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[25%] rounded-full" />
                                </div>
                            </div>
                            {/* Category 4 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Palette className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">Decoración</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">120 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-600 w-[15%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Incidents by Zone Card */}
                    <div className="pt-2">
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white text-center">Incidencias por Zona</h3>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={zoneHealthData}>
                                    <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <Radar
                                        name="Incidencias"
                                        dataKey="A"
                                        stroke="#FF5A5F"
                                        strokeWidth={2}
                                        fill="#FF5A5F"
                                        fillOpacity={0.4}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#0f172a' : '#fff',
                                            borderRadius: '8px',
                                            border: isDark ? '1px solid #1e293b' : 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            color: isDark ? '#fff' : '#000'
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default function DashboardPage() {
    const { user } = useAuth()

    // Si es verificador, mostrar dashboard personalizado
    if (user?.role === 'verifier') {
        return <VerifierDashboard user={user} />
    }

    return <AdminDashboard />
}

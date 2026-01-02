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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hola, {user?.name?.split(' ')[0] || 'Verificador'}</h1>
                    <p className="text-muted-foreground mt-1">Tienes {MOCK_ASSIGNMENTS.filter(a => a.status !== 'completed').length} inspecciones pendientes para esta semana.</p>
                </div>
                <div className="flex gap-3">
                    <Card className="px-4 py-2 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400">
                        <ClipboardList className="h-5 w-5" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase">Pendientes</span>
                            <span className="text-lg font-bold leading-none">3</span>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Próximas Asignaciones
                    </h2>

                    <div className="grid gap-4">
                        {MOCK_ASSIGNMENTS.map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4" style={{
                                borderLeftColor: task.status === 'overdue' ? '#ef4444' : task.status === 'completed' ? '#10b981' : '#3b82f6'
                            }}>
                                <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {task.status === 'overdue' && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Atrasado</span>}
                                            {task.status === 'completed' && <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Completado</span>}
                                            {task.status === 'pending' && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Pendiente</span>}

                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(task.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {task.building} <span className="text-slate-300">•</span> Depto {task.apartment}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {task.address}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto" onClick={() => router.push(`/inspections/${task.id}`)}>
                                            Iniciar Inspección
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none">
                        <CardHeader>
                            <CardTitle>Rendimiento</CardTitle>
                            <CardDescription className="text-slate-400">Tu actividad este mes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span>Inspecciones Realizadas</span>
                                <span className="font-bold text-xl">12</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span>Tiempo Promedio</span>
                                <span className="font-bold text-xl">45m</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Precisión</span>
                                <span className="font-bold text-xl text-green-400">98%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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

    // 3. Activity Trend (Items Verified)
    const activityData = [
        { day: 'Lun', verified: 12 },
        { day: 'Mar', verified: 18 },
        { day: 'Mie', verified: 15 },
        { day: 'Jue', verified: 25 },
        { day: 'Vie', verified: 20 },
        { day: 'Sab', verified: 8 },
        { day: 'Dom', verified: 5 },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Metric 1 */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Items</span>
                        <Box className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">342</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12
                        </span>
                        <span className="text-slate-400">nuevos este mes</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Inspecciones Totales</span>
                        <ClipboardList className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">14</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                            Realizadas este mes
                        </span>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Requieren Atención</span>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">4</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">
                            3 Dañados
                        </span>
                        <span className="text-slate-400">1 Faltante</span>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (2/3) - Main Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* INVENTORY DISTRIBUTION CHART */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Items por Edificio</h3>
                            </div>
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
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Estado del Inventario</h4>
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
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-slate-400 dark:text-slate-500">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>



                        {/* AREA CHART: Verification Activity */}
                        <div className="space-y-4">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">Actividad de Verificación</h4>
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00A699" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#00A699" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
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
                                            dataKey="verified"
                                            stroke="#00A699"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorVerified)"
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
                        <div className="flex items-center justify-between">
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
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Mobiliario</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">450 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-airbnb-rausch w-[65%] rounded-full" />
                                </div>
                            </div>

                            {/* Category 2 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Tv className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Electrónicos</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">210 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-airbnb-babu w-[35%] rounded-full" />
                                </div>
                            </div>

                            {/* Category 3 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Utensils className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Cocina</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">185 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-airbnb-arches w-[25%] rounded-full" />
                                </div>
                            </div>
                            {/* Category 4 */}
                            <div className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Palette className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">Decoración</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">120 items</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-airbnb-hof w-[15%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Incidents by Zone Card */}
                    <div className="pt-2">
                        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Incidencias por Zona</h3>
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

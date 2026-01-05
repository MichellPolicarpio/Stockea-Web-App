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
    PolarRadiusAxis,
    LabelList
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
                                                    let fillUrl = `url(#gradientBlue)`; // Default to Blue
                                                    if (entry.color === '#10b981') fillUrl = `url(#gradientEmerald)`;
                                                    if (entry.color === '#f59e0b') fillUrl = `url(#gradientAmber)`;
                                                    if (entry.color === '#ef4444') fillUrl = `url(#gradientRed)`;
                                                    // Explicitly map Blue if needed, though default handles it
                                                    if (entry.color === '#3b82f6') fillUrl = `url(#gradientBlue)`;

                                                    return <Cell key={`cell-${index}`} fill={fillUrl} />;
                                                })}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Text */}
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

    // Si es verificador, mostrar dashboard personalizado
    if (user?.role === 'verifier') {
        return <VerifierDashboard user={user} />
    }

    return <AdminDashboard />
}

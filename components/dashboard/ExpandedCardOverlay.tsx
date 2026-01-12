'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    X,
    BarChart2,
    Filter,
    Download,
    Calendar,
    Search,
    ArrowUpDown,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    HelpCircle,
    ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
    Legend
} from 'recharts'

// --- MOCK DATA ---
const CATEGORIES_DATA = [
    { name: 'Mobiliario', items: 450, value: 45000, color: '#3b82f6', status: 'Estable' },
    { name: 'Electrónicos', items: 210, value: 32500, color: '#10b981', status: 'Crítico' },
    { name: 'Cocina', items: 185, value: 12000, color: '#f97316', status: 'Estable' },
    { name: 'Arte y Decoración', items: 95, value: 15000, color: '#8b5cf6', status: 'Estable' },
    { name: 'Blancos', items: 320, value: 8500, color: '#ec4899', status: 'Revisión' },
    { name: 'Jardinería', items: 45, value: 3200, color: '#14b8a6', status: 'Estable' },
    { name: 'Herramientas', items: 120, value: 6800, color: '#64748b', status: 'Revisión' },
]

const ASSETS_DATA = [
    { id: 'ACT-001', name: 'Sofá Cama Premium', category: 'Mobiliario', status: 'Dañado', location: 'Apt 101', value: 1200 },
    { id: 'ACT-023', name: 'Microondas LG', category: 'Electrónicos', status: 'Inactivo', location: 'Bodega', value: 150 },
    { id: 'ACT-045', name: 'Smart TV 55"', category: 'Electrónicos', status: 'Buen estado', location: 'Apt 204', value: 450 },
    { id: 'ACT-089', name: 'Silla Eames', category: 'Mobiliario', status: 'Faltante', location: 'Apt 305', value: 80 },
    { id: 'ACT-112', name: 'Cafetera Industrial', category: 'Cocina', status: 'Buen estado', location: 'Apt 102', value: 300 },
    { id: 'ACT-134', name: 'Lámpara de Pie', category: 'Mobiliario', status: 'Buen estado', location: 'Apt 201', value: 120 },
    { id: 'ACT-156', name: 'Cortinas Blackout', category: 'Blancos', status: 'Dañado', location: 'Apt 105', value: 200 },
    { id: 'ACT-178', name: 'Juego de Sábanas', category: 'Blancos', status: 'Buen estado', location: 'Apt 101', value: 50 },
    { id: 'ACT-190', name: 'Cuadro Abstracto', category: 'Arte', status: 'Buen estado', location: 'Lobby', value: 800 },
]

const INSPECTIONS_DATA = [
    { month: 'Jul', total: 45, items_checked: 1200, pass_rate: 98 },
    { month: 'Ago', total: 48, items_checked: 1250, pass_rate: 97 },
    { month: 'Sep', total: 52, items_checked: 1300, pass_rate: 95 },
    { month: 'Oct', total: 49, items_checked: 1280, pass_rate: 99 },
    { month: 'Nov', total: 60, items_checked: 1400, pass_rate: 96 },
    { month: 'Dic', total: 65, items_checked: 1550, pass_rate: 98 },
]

const BUILDINGS_DATA = [
    { name: 'Casa Tortuga', items: 1250, damaged: 12, alerts: 3 },
    { name: 'Casa Bamba', items: 850, damaged: 5, alerts: 1 },
    { name: 'Torre Residencial A', items: 850, damaged: 15, alerts: 2 },
    { name: 'Complejo Comercial', items: 340, damaged: 28, alerts: 12 },
    { name: 'Villas del Mar', items: 120, damaged: 2, alerts: 0 },
]

const BUILDING_DETAILS_DATA: Record<string, any[]> = {
    'Casa Tortuga': [
        { unit: '101', floor: '1', items: 350, condition: 'Excelente', alerts: 0, items_damaged: 0 },
        { unit: '102', floor: '1', items: 340, condition: 'Bueno', alerts: 1, items_damaged: 1 },
        { unit: '201', floor: '2', items: 280, condition: 'Revisión', alerts: 8, items_damaged: 8 },
        { unit: 'PH', floor: '3', items: 280, condition: 'Excelente', alerts: 3, items_damaged: 3 },
    ],
    'Casa Bamba': [
        { unit: 'A', floor: 'PB', items: 420, condition: 'Excelente', alerts: 0, items_damaged: 0 },
        { unit: 'B', floor: 'PB', items: 430, condition: 'Bueno', alerts: 5, items_damaged: 5 },
    ],
    'default': [
        { unit: '101', floor: '1', items: 150, condition: 'Bueno', alerts: 2, items_damaged: 5 },
        { unit: '102', floor: '1', items: 145, condition: 'Bueno', alerts: 3, items_damaged: 10 },
        { unit: '201', floor: '2', items: 160, condition: 'Excelente', alerts: 0, items_damaged: 0 },
        { unit: '202', floor: '2', items: 155, condition: 'Malo', alerts: 10, items_damaged: 12 },
    ]
}

interface ExpandedCardOverlayProps {
    activeCard: string
    onClose: () => void
}

export function ExpandedCardOverlay({ activeCard, onClose }: ExpandedCardOverlayProps) {
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const normalizedCard = activeCard.includes('mini') ? activeCard.split('-')[0] : activeCard

    const getTitle = (card: string) => {
        const type = card.includes('mini') ? card.split('-')[0] : card
        switch (type) {
            case 'categories': return 'Análisis de Categorías'
            case 'status': return 'Monitor de Estado de Activos'
            case 'inspections': return 'Centro de Inspecciones'
            case 'buildings': return 'Gestión por Edificios'
            case 'damaged': return 'Reporte de Daños y Alertas'
            case 'units': return 'Inventario por Unidades'
            default: return 'Detalle'
        }
    }

    const renderContent = () => {
        const type = activeCard.includes('mini') ? activeCard.split('-')[0] : activeCard
        switch (type) {
            case 'categories':
                return <CategoriesView filter={filter} setFilter={setFilter} />
            case 'status':
            case 'damaged':
                return <AssetsStatusView filter={type === 'damaged' ? 'damaged' : filter} setFilter={setFilter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            case 'inspections':
            case 'health': // Reusing inspections/health logic
                return <InspectionsView />
            case 'buildings':
            case 'units':
                return <BuildingsView subview={type === 'units'} />
            default:
                return <div className="p-10 text-center text-slate-500">Contenido en desarrollo</div>
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                layoutId={`card-${activeCard}`}
                className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
                {/* Header Customizado */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-col">
                        <motion.h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {getTitle(activeCard)}
                            <Badge variant="outline" className="ml-2 font-normal text-slate-500">Tiempo Real</Badge>
                        </motion.h2>
                        <p className="text-sm text-slate-500">Vista detallada y herramientas de gestión</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex gap-2 mr-4">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Calendar className="h-4 w-4" /> Últimos 30 días
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" /> Exportar
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 hover:bg-slate-200 dark:hover:bg-slate-800">
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Main Content Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30 dark:bg-slate-950/30">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

// --- SUB-COMPONENTS FOR VIEWS ---

function CategoriesView({ filter, setFilter }: { filter: string, setFilter: any }) {
    const sortedData = [...CATEGORIES_DATA].sort((a, b) =>
        filter === 'value' ? b.value - a.value : b.items - a.items
    )

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Panel */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-blue-500" />
                            Distribución de Inventario
                        </h3>
                        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setFilter('items')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter !== 'value' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                Por Items
                            </button>
                            <button
                                onClick={() => setFilter('value')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'value' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                                Por Valor ($)
                            </button>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload
                                            return (
                                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
                                                    <p className="font-bold mb-1">{data.name}</p>
                                                    <p className="text-sm">Items: <b>{data.items}</b></p>
                                                    <p className="text-sm">Valor: <b>${data.value.toLocaleString()}</b></p>
                                                    <Badge variant="outline" className="mt-2 text-[10px]">{data.status}</Badge>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar dataKey={filter === 'value' ? 'value' : 'items'} fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                                    {sortedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium mb-1">Valor Total Inventario</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-100">$107,315</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <p className="text-sm text-emerald-600 dark:text-emerald-300 font-medium mb-1">Categoría Top (Valor)</p>
                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-100 lg:truncate">Mobiliario ($45k)</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-sm mb-3">Recomendaciones</h4>
                        <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span>
                                Revisar stock de "Blancos" por alta rotación.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                "Cocina" mantiene buen estado general.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                            <TableHead>Categoría</TableHead>
                            <TableHead>Items Totales</TableHead>
                            <TableHead>Valor Estimado</TableHead>
                            <TableHead>Estado General</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((cat, i) => (
                            <TableRow key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <TableCell className="font-medium flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </TableCell>
                                <TableCell>{cat.items}</TableCell>
                                <TableCell>${cat.value.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={cat.status === 'Crítico' ? 'destructive' : cat.status === 'Revisión' ? 'secondary' : 'outline'}>
                                        {cat.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Detalles</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function AssetsStatusView({ filter, setFilter, searchTerm, setSearchTerm }: any) {
    // Logic for filtering
    const isDamagedMode = filter === 'damaged'

    // Process chart data
    const statusCounts = [
        { name: 'Buen estado', value: 75, color: '#3b82f6' },
        { name: 'Inactivo', value: 10, color: '#94a3b8' },
        { name: 'Faltante', value: 10, color: '#f59e0b' },
        { name: 'Dañado', value: 5, color: '#ef4444' },
    ]

    const filteredAssets = ASSETS_DATA.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.location.toLowerCase().includes(searchTerm.toLowerCase())

        if (isDamagedMode) {
            return matchesSearch && (asset.status === 'Dañado' || asset.status === 'Faltante')
        }

        if (filter !== 'all' && filter !== 'damaged') {
            return matchesSearch && asset.status === filter
        }

        return matchesSearch
    })

    return (
        <div className="space-y-6">
            {!isDamagedMode && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {statusCounts.map((stat, i) => (
                        <div
                            key={i}
                            onClick={() => setFilter(stat.name === filter ? 'all' : stat.name)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${filter === stat.name ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md'}`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-2xl">{stat.value}%</span>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{stat.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar activo por ID, nombre o ubicación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-50 dark:bg-slate-950"
                    />
                </div>
                <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Más Filtros</Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Activo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-mono text-xs font-bold text-slate-500">{asset.id}</TableCell>
                                <TableCell className="font-medium">{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.location}</TableCell>
                                <TableCell>
                                    <Badge className={`${asset.status === 'Buen estado' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300' :
                                        asset.status === 'Dañado' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' :
                                            asset.status === 'Faltante' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}>
                                        {asset.status === 'Buen estado' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        {asset.status === 'Dañado' && <XCircle className="w-3 h-3 mr-1" />}
                                        {asset.status === 'Faltante' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {asset.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Ver Ficha</Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    No se encontraron activos con los filtros actuales.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function InspectionsView() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold mb-4">Tendencia de Inspecciones</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={INSPECTIONS_DATA}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold mb-4 flex items-end gap-2">
                        Inspecciones Perfectas (%)
                        <span className="text-xs font-normal text-slate-500 mb-0.5">(0 Daños)</span>
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={INSPECTIONS_DATA}>
                            <defs>
                                <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar
                                dataKey="pass_rate"
                                name="Tasa de Perfección"
                                fill="url(#colorPassRate)"
                                shape={(props: any) => {
                                    const { fill, x, y, width, height } = props;
                                    return (
                                        <g>
                                            <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />
                                            <rect x={x} y={y} width={width} height={4} fill="#059669" rx={2} ry={2} />
                                        </g>
                                    );
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold mb-4">Próximas Inspecciones Programadas</h3>
                <div className="space-y-3">
                    {[
                        { id: 1, building: 'Casa Tortuga', unit: '101', date: 'Mañana, 09:00 AM' },
                        { id: 2, building: 'Casa Bamba', unit: 'PH', date: '18 Ene, 11:30 AM' },
                        { id: 3, building: 'Torre Residencial', unit: '5B', date: '22 Ene, 15:00 PM' }
                    ].map((inspection) => (
                        <div key={inspection.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Inspección - {inspection.building}</p>
                                    <p className="text-xs text-slate-500">Unidad {inspection.unit} • {inspection.date}</p>
                                </div>
                            </div>
                            <Button size="sm">Detalles</Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold">Historial Reciente</h3>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-950/50">
                            <TableHead>Fecha</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Auditor</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Informe</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { id: 101, date: '10 Ene, 2026', building: 'Casa Tortuga', unit: '102', status: 'Aprobada', auditor: 'Carlos V.' },
                            { id: 102, date: '08 Ene, 2026', building: 'Torre Residencial', unit: '3A', status: 'Con Observaciones', issues: 2, auditor: 'Ana M.' },
                            { id: 103, date: '05 Ene, 2026', building: 'Villas del Mar', unit: 'V-12', status: 'Aprobada', auditor: 'Roberto G.' },
                            { id: 104, date: '02 Ene, 2026', building: 'Casa Bamba', unit: 'A', status: 'Aprobada', auditor: 'Carlos V.' },
                        ].map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                <TableCell className="font-medium text-slate-600 dark:text-slate-400">{item.date}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white">{item.building}</span>
                                        <span className="text-xs text-slate-500">Unidad {item.unit}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{item.auditor}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Aprobada' ? 'secondary' : 'destructive'} className={item.status === 'Aprobada' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}>
                                        {item.status === 'Aprobada' ? (
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Aprobada</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {item.issues} Obs.</span>
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Download className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function BuildingsView({ subview }: { subview: boolean }) {
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

    if (selectedBuilding) {
        const apartments = BUILDING_DETAILS_DATA[selectedBuilding] || BUILDING_DETAILS_DATA['default']

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBuilding(null)} className="pl-0 gap-2 hover:bg-transparent hover:text-blue-600">
                        <ChevronLeft className="h-5 w-5" /> Volver a Edificios
                    </Button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <h3 className="font-bold text-xl">{selectedBuilding}</h3>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                                <TableHead>Unidad</TableHead>
                                <TableHead>Piso</TableHead>
                                <TableHead>Total Items</TableHead>
                                <TableHead>Estado Items</TableHead>
                                <TableHead className="text-right">Alertas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apartments.map((apt, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-bold">{apt.unit}</TableCell>
                                    <TableCell>{apt.floor}</TableCell>
                                    <TableCell>{apt.items}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-emerald-600 font-medium">Ok: {apt.items - (apt.items_damaged || 0)}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-amber-600 font-medium">Dañados: {apt.items_damaged || 0}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${((apt.items - (apt.items_damaged || 0)) / apt.items) * 100}%` }} />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {apt.alerts > 0 ? (
                                            <Badge variant="destructive">{apt.alerts}</Badge>
                                        ) : (
                                            <span className="text-slate-400 text-xs text-center block">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUILDINGS_DATA.map((building, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        onClick={() => setSelectedBuilding(building.name)}
                        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <Search className="h-5 w-5" />
                            </div>
                            {building.alerts > 0 && (
                                <Badge variant="destructive" className="animate-pulse">{building.alerts} Alertas</Badge>
                            )}
                        </div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{building.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Registrados</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{building.items}</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">En Revisión</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{building.damaged}</p>
                                    {building.damaged > 0 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

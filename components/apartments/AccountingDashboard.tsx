'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Zap,
    Droplets,
    Wifi,
    Flame,
    FileText,
    Upload,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Pencil,
    RefreshCw,
    Trash2,
    MoreVertical,
    Download,
    Users,
    Calendar,
    ArrowRight
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import { ExpandedCardOverlay } from '@/components/dashboard/ExpandedCardOverlay'

export function AccountingDashboard({ apartmentId }: { apartmentId: string }) {
    const isDemo = apartmentId === 'apt-2'

    // --- State Initialization ---
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
    const [expandedCard, setExpandedCard] = useState<string | null>(null)

    // Form States
    const [formData, setFormData] = useState({
        serviceInfo: '',
        amount: '',
        frequency: 'monthly',
        dueDate: '',
        periodStart: '',
        periodEnd: ''
    })

    // Financial Data State
    const [financialData, setFinancialData] = useState({
        income: 0,
        expenses: 0,
        balance: 0
    })

    // Transactions State
    const [transactions, setTransactions] = useState<any[]>([])

    // Services State
    const [services, setServices] = useState<any[]>([])

    // --- Effects for Initial Data Loading ---
    // --- Effects for Initial Data Loading ---
    useEffect(() => {
        const loadData = () => {
            const stored = localStorage.getItem(`accounting-data-${apartmentId}`)
            if (stored) {
                try {
                    const data = JSON.parse(stored)
                    setFinancialData(data.financialData || { income: 0, expenses: 0, balance: 0 })
                    setServices(data.services || [])
                    setTransactions(data.transactions || [])
                    return
                } catch (e) {
                    console.error("Error loading mock data", e)
                }
            }

            if (isDemo) {
                const initialFinancials = {
                    income: 24500,
                    expenses: 4350,
                    balance: 20150
                }
                const initialServices = [
                    { id: 'admin-fee', name: 'Administración', icon: Users, status: 'pending', amount: 1500, dueDate: '2025-01-30', lastPaid: '2024-12-30', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
                    { id: 'cleaning', name: 'Limpieza', icon: RefreshCw, status: 'paid', amount: 800, dueDate: '2025-01-15', lastPaid: '2025-01-08', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
                    { id: 'cfe', name: 'Luz', icon: Zap, status: 'paid', amount: 850, dueDate: '2025-01-15', lastPaid: '2024-12-14', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
                    { id: 'water', name: 'Agua', icon: Droplets, status: 'pending', amount: 420, dueDate: '2025-01-20', lastPaid: '2024-12-18', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    { id: 'internet', name: 'Internet', icon: Wifi, status: 'paid', amount: 1100, dueDate: '2025-01-05', lastPaid: '2025-01-04', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
                    { id: 'gas', name: 'Gas', icon: Flame, status: 'paid', amount: 650, dueDate: '2025-01-10', lastPaid: '2025-01-08', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
                ]
                const initialTransactions = [
                    { id: 1, type: 'income', category: 'Renta', description: 'Renta Enero - Reserva #8823', amount: 18000, date: '2025-01-02', status: 'completed' },
                    { id: 2, type: 'expense', category: 'Servicios', description: 'Pago Internet Enero', amount: 1100, date: '2025-01-04', status: 'completed' },
                    { id: 3, type: 'income', category: 'Depósito', description: 'Depósito Garantía - Reserva #8823', amount: 6500, date: '2025-01-02', status: 'held' },
                    { id: 4, type: 'expense', category: 'Mantenimiento', description: 'Cambio de cerradura digital', amount: 2400, date: '2024-12-28', status: 'completed' },
                    { id: 5, type: 'expense', category: 'Servicios', description: 'Recibo CFE Dic-Ene', amount: 850, date: '2024-12-14', status: 'completed' },
                ]

                setFinancialData(initialFinancials)
                setServices(initialServices)
                setTransactions(initialTransactions)
            } else {
                setFinancialData({ income: 0, expenses: 0, balance: 0 })
                setServices([])
                setTransactions([])
            }
        }
        loadData()
    }, [isDemo, apartmentId])

    // --- Handlers ---

    const [selectedService, setSelectedService] = useState<any>(null)
    const [uploadType, setUploadType] = useState<'income' | 'expense'>('expense')

    const handleOpenUpload = (type: 'income' | 'expense', serviceId: string = '') => {
        setUploadType(type)
        setFormData({
            serviceInfo: serviceId === 'new' ? '' : serviceId,
            amount: '',
            frequency: 'monthly',
            dueDate: '',
            periodStart: '',
            periodEnd: ''
        })
        setSelectedFile(null)
        setIsUploadOpen(true)
    }

    const handleSaveRecord = () => {
        if (!formData.amount || !formData.serviceInfo) {
            alert("Por favor ingresa un monto y selecciona un tipo de movimiento.")
            return
        }

        const amountVal = parseFloat(formData.amount) || 0
        const isIncome = uploadType === 'income'

        // 1. Add to Transactions
        const newTransaction = {
            id: Date.now(),
            type: isIncome ? 'income' : 'expense',
            category: isIncome ? 'Ingreso' : 'Egreso / Servicio',
            description: mapServiceToName(formData.serviceInfo) || 'Movimiento Manual',
            amount: amountVal,
            date: formData.dueDate || new Date().toISOString().split('T')[0],
            status: 'completed',
            receiptName: selectedFile ? selectedFile.name : null
        }

        const updatedTransactions = [newTransaction, ...transactions]
        setTransactions(updatedTransactions)

        // 2. Update Financial Summary
        const updatedFinancials = {
            income: financialData.income + (isIncome ? amountVal : 0),
            expenses: financialData.expenses + (!isIncome ? amountVal : 0),
            balance: financialData.balance + (isIncome ? amountVal : -amountVal)
        }
        setFinancialData(updatedFinancials)

        // 3. Persist to Local Storage
        const payload = {
            transactions: updatedTransactions,
            financialData: updatedFinancials,
            services: services // Keep services syncing too if modified later
        }
        localStorage.setItem(`accounting-data-${apartmentId}`, JSON.stringify(payload))

        setIsUploadOpen(false)
        setFormData({ serviceInfo: '', amount: '', frequency: 'monthly', dueDate: '', periodStart: '', periodEnd: '' }) // Reset form
        setSelectedFile(null)
    }

    const mapServiceToName = (val: string) => {
        const map: Record<string, string> = {
            'rent': 'Renta Mensual',
            'deposit': 'Depósito de Garantía',
            'cfe': 'Pago de Luz',
            'water': 'Pago de Agua',
            'internet': 'Pago de Internet',
            'gas': 'Pago de Gas',
            'admin-fee': 'Honorarios Administración',
            'cleaning': 'Servicio de Limpieza',
            'predial': 'Pago de Predial',
            'other': 'Otro Gasto',
            'income': 'Ingreso Varios',
            'maintenance': 'Mantenimiento General'
        }
        return map[val] || val
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Tabs defaultValue="month" className="w-full sm:w-[400px]" onValueChange={(val) => setViewMode(val as 'month' | 'year')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="month">Vista Mensual</TabsTrigger>
                        <TabsTrigger value="year">Vista Anual</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="text-sm text-slate-500 w-full sm:w-auto text-right">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 inline-block w-full sm:w-auto text-center sm:text-left">
                        {viewMode === 'month' ? 'Periodo Actual' : 'Acumulado Anual (YTD)'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* LEFT COLUMN: Main Content (KPIs, Chart, Transactions) */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* 1. Minimalist KPIs (Compact) */}
                    {/* 1. KPIs Cards (Inventory Style) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <motion.div
                            layoutId="card-balance"
                            onClick={() => setExpandedCard('balance')}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center gap-1 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer relative"
                        >
                            <span className="text-2xl font-bold text-slate-900 dark:text-white px-1">${financialData.balance.toLocaleString()}</span>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div> Balance Total
                            </div>
                        </motion.div>

                        <motion.div
                            layoutId="card-income"
                            onClick={() => setExpandedCard('income')}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center gap-1 group hover:border-blue-300 dark:hover:border-blue-900 transition-colors cursor-pointer relative"
                        >
                            <span className="text-2xl font-bold text-slate-900 dark:text-white px-1">${financialData.income.toLocaleString()}</span>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Ingresos
                            </div>
                        </motion.div>

                        <motion.div
                            layoutId="card-expenses"
                            onClick={() => setExpandedCard('expenses')}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center gap-1 group hover:border-rose-300 dark:hover:border-rose-900 transition-colors cursor-pointer relative"
                        >
                            <span className="text-2xl font-bold text-slate-900 dark:text-white px-1">${financialData.expenses.toLocaleString()}</span>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div> Gastos
                            </div>
                        </motion.div>

                        <motion.div
                            layoutId="card-margin"
                            onClick={() => setExpandedCard('margin')}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center gap-1 group hover:border-emerald-300 dark:hover:border-emerald-900 transition-colors cursor-pointer relative"
                        >
                            <span className="text-2xl font-bold text-slate-900 dark:text-white px-1">
                                {financialData.income > 0 ? Math.round((financialData.balance / financialData.income) * 100) : 0}%
                            </span>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> Margen
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. Finances Chart (Compact) */}
                    <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tendencia Financiera</h3>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    <span className="text-slate-500">Ingresos</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                    <span className="text-slate-500">Gastos</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[160px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { name: '1', inc: 12000, exp: 3000 },
                                    { name: '2', inc: 18000, exp: 4500 },
                                    { name: '3', inc: 15000, exp: 3200 },
                                    { name: '4', inc: 24000, exp: 6000 },
                                    { name: '5', inc: 21000, exp: 4800 },
                                    { name: '6', inc: 28000, exp: 5200 },
                                ]}>
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                                    <XAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="inc" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                                    <Area type="monotone" dataKey="exp" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Transaction History (Very Compact) */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500 hover:text-slate-900 px-2" onClick={() => handleOpenUpload('income', 'rent')}>
                                + Nuevo
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {transactions.slice(0, 4).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between group py-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                            {tx.type === 'income' ? <DollarSign className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white leading-none">{tx.description}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{tx.category} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar (Services/My Cards style) */}
                <div className="lg:col-span-1 border-l border-slate-100 dark:border-slate-800 pl-0 lg:pl-6 space-y-6">

                    {/* Actions / Services Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Servicios</h3>
                        <Button size="icon" variant="ghost" className="h-6 w-6 bg-slate-100 dark:bg-slate-800 rounded-md" onClick={() => handleOpenUpload('expense', 'new')}>
                            <Upload className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Services 'Cards' List (Compact Grid 2 Cols) */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {services.map((service) => (
                            <motion.div
                                key={service.id}
                                layoutId={`card-service-${service.id}`}
                                onClick={() => setExpandedCard(`service-${service.id}`)}
                                className="group relative bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 cursor-pointer hover:bg-white hover:shadow-md hover:shadow-slate-200/50 dark:hover:bg-slate-800 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 flex flex-col justify-between h-[80px]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-1.5 rounded-lg ${service.color} bg-opacity-20`}>
                                        <service.icon className="h-4 w-4" />
                                    </div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${service.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                                        {service.status === 'paid' ? 'OK' : 'PEND'}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white leading-none mb-1">${service.amount}</div>
                                    <h4 className="font-medium text-[10px] text-slate-500 truncate" title={service.name}>{service.name}</h4>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add New Service Placeholder */}
                        <div
                            onClick={() => handleOpenUpload('expense', 'new')}
                            className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors h-[80px]"
                        >
                            <TrendingUp className="h-5 w-5 text-slate-400 mb-1" />
                            <span className="text-[10px] font-medium text-slate-500">Agregar</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog Form: TRANSACTION UPLOAD (Existing) */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{uploadType === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto / Servicio'}</DialogTitle>
                        <DialogDescription>
                            {uploadType === 'income'
                                ? 'Registra un pago de renta o depósito.'
                                : 'Registra un gasto operativo o pago de servicio.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="service-type">Tipo de Movimiento</Label>
                            <Select
                                value={formData.serviceInfo}
                                onValueChange={(val) => setFormData({ ...formData, serviceInfo: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uploadType === 'income' ? (
                                        <>
                                            <SelectItem value="rent">Cobro de Renta</SelectItem>
                                            <SelectItem value="deposit">Depósito de Garantía</SelectItem>
                                            <SelectItem value="income">Otro Ingreso</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                                            <SelectItem value="admin-fee">Honorarios Administración</SelectItem>
                                            <SelectItem value="cleaning">Limpieza</SelectItem>
                                            <SelectItem value="maintenance">Mantenimiento General</SelectItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Servicios Básicos</DropdownMenuLabel>
                                            <SelectItem value="cfe">Luz</SelectItem>
                                            <SelectItem value="water">Agua</SelectItem>
                                            <SelectItem value="internet">Internet</SelectItem>
                                            <SelectItem value="gas">Gas</SelectItem>
                                            <SelectItem value="predial">Predial</SelectItem>
                                            <SelectItem value="other">Otro Gasto</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="frequency">Frecuencia de Pago</Label>
                            <Select
                                value={formData.frequency}
                                onValueChange={(val) => setFormData({ ...formData, frequency: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona frecuencia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Mensual</SelectItem>
                                    <SelectItem value="bimonthly">Bimestral</SelectItem>
                                    <SelectItem value="annual">Anual</SelectItem>
                                    <SelectItem value="one-time">Pago Único</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Monto ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Fecha Pago / Vencimiento</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Periodo (Opcional)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1">
                                    <Label htmlFor="periodStart" className="text-xs text-slate-500">Desde</Label>
                                    <Input
                                        id="periodStart"
                                        type="date"
                                        value={formData.periodStart}
                                        onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="periodEnd" className="text-xs text-slate-500">Hasta</Label>
                                    <Input
                                        id="periodEnd"
                                        type="date"
                                        value={formData.periodEnd}
                                        onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="file">Comprobante / Recibo</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed ${selectedFile ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800'} rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors`}
                            >
                                {selectedFile ? (
                                    <>
                                        <FileText className="h-8 w-8 text-blue-500 mb-2" />
                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selectedFile.name}</span>
                                        <span className="text-xs text-blue-500 mt-1">Click para cambiar archivo</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Click para subir archivo</span>
                                        <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSelectedFile(e.target.files[0])
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveRecord}>Guardar Movimiento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Service Detail Dialog */}
            {selectedService && (
                <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${selectedService.color}`}>
                                    <selectedService.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <DialogTitle>{selectedService.name}</DialogTitle>
                                    <DialogDescription>Historial y gestión de servicio</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="grid gap-6 py-2">
                            {/* CHART SECTION */}
                            <div className="h-[200px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Historial de Gasto (6 Meses)</h4>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getServiceHistory(selectedService.id)}>
                                        <defs>
                                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => [`$${value}`, 'Costo']}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* DETAILS & ACTIONS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Estatus Actual</Label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={selectedService.status === 'paid' ? 'default' : 'outline'} className={selectedService.status === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'text-amber-600 border-amber-200'}>
                                                {selectedService.status === 'paid' ? 'Pagado' : 'Pendiente de Pago'}
                                            </Badge>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={`h-6 text-xs px-2 ${selectedService.status === 'paid' ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                                onClick={() => {
                                                    // Toggle status
                                                    const newStatus = selectedService.status === 'paid' ? 'pending' : 'paid'
                                                    const updated = { ...selectedService, status: newStatus }
                                                    const newServices = services.map(s => s.id === updated.id ? updated : s)
                                                    setServices(newServices)
                                                    setSelectedService(updated)
                                                }}
                                            >
                                                {selectedService.status === 'paid' ? 'Marcar Pendiente' : 'Marcar Pagado'}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Monto del Periodo</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white">${selectedService.amount}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                                        <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                            <Upload className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Subir Recibo PDF</span>
                                    </div>
                                    <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                                        <Download className="h-3.5 w-3.5 mr-2" />
                                        Ver Último Recibo
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                                        <FileText className="h-3.5 w-3.5 mr-2" />
                                        Historial de Pagos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* EXPANDED CARD OVERLAY */}
            <AnimatePresence>
                {expandedCard && (
                    <ExpandedCardOverlay activeCard={expandedCard} onClose={() => setExpandedCard(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}

// Helper to generate fake history data based on service type
function getServiceHistory(serviceId: string) {
    const months = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene']
    return months.map((month, index) => {
        let amount = 0

        if (serviceId === 'cfe') {
            // LUZ: Bimestral (Pagos fuertes en meses alternos)
            // En meses de "no corte" simulamos cargo mínimo o cero dependiendo de la región,
            // pero pondremos un cargo mínimo de $58 para que la gráfica no toque el suelo totalmente
            if (index % 2 !== 0) {
                amount = 850 + (Math.random() * 200 - 50)
            } else {
                amount = 58 // Cargo mínimo fijo
            }
        } else if (serviceId === 'water') {
            // AGUA: Anual (Solo Enero - Pago Único)
            if (month === 'Ene') {
                amount = 4500
            } else {
                amount = 0
            }
        } else if (serviceId === 'predial') {
            // PREDIAL: Anual
            if (month === 'Ene') {
                amount = 12000
            } else {
                amount = 0
            }
        } else {
            // MENSUALES (Internet, Gas, Manto)
            // Evitar caídas a 0 irrealistas
            const baseAmount = serviceId === 'internet' ? 600 :
                serviceId === 'gas' ? 450 : 1500

            // Variación pequeña pero siempre positiva
            amount = baseAmount + (Math.random() * 80)
        }

        return {
            month,
            amount: Math.max(0, Math.round(amount))
        }
    })
}

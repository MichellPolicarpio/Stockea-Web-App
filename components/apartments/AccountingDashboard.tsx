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

export function AccountingDashboard({ apartmentId }: { apartmentId: string }) {
    const isDemo = apartmentId === 'apt-2'

    // --- State Initialization ---
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month')

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

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Ingresos Totales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${financialData.income.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                            +12% vs mes anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-rose-900 dark:text-rose-100">Gastos Operativos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">${financialData.expenses.toLocaleString()}</div>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
                            Servicios, Gestión y Manto.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Balance Neto</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">${financialData.balance.toLocaleString()}</div>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                            {financialData.income > 0 ? `Margen: ${Math.round((financialData.balance / financialData.income) * 100)}%` : 'Sin ingresos'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gastos y Servicios</h3>
                        <p className="text-sm text-slate-500">Gestión de propiedad, mantenimiento y servicios básicos.</p>
                    </div>
                </div>

                {services.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3">
                                <Zap className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Sin servicios configurados</h3>
                            <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">Registra luz, agua, administración o internet.</p>
                            <Button variant="outline" size="sm" onClick={() => handleOpenUpload('expense', 'new')}>
                                <Upload className="h-4 w-4 mr-2" /> Agregar Primer Gasto
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2.5 rounded-2xl ${service.color} bg-opacity-20 transition-transform group-hover:scale-105`}>
                                        <service.icon className="h-5 w-5" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Pencil className="h-4 w-4 mr-2" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <RefreshCw className="h-4 w-4 mr-2" /> Proveedor
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="mb-3">
                                    <div className="font-semibold text-slate-900 dark:text-white leading-tight pr-2 truncate" title={service.name}>{service.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {service.status === 'paid' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 h-5">Pagado</Badge>}
                                        {service.status === 'pending' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 h-5">Pendiente</Badge>}
                                        <span className="text-xs text-slate-500">Vence: {new Date(service.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-xs text-slate-400">Último: {new Date(service.lastPaid).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
                                    <div className="font-bold text-lg text-slate-900 dark:text-white">${service.amount}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Transactions Table */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Registro de Movimientos</CardTitle>
                            <CardDescription>Consolidado de ingresos y egresos del periodo.</CardDescription>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2">
                            <Button variant="default" size="sm" onClick={() => handleOpenUpload('income', 'rent')} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                                <DollarSign className="h-4 w-4 mr-2" />
                                <span className="sm:hidden">Ingreso</span>
                                <span className="hidden sm:inline">Registrar Ingreso</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleOpenUpload('expense', 'new')} className="flex-1 sm:flex-none">
                                <Upload className="h-4 w-4 mr-2" />
                                <span className="sm:hidden">Gasto</span>
                                <span className="hidden sm:inline">Registrar Gasto</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <Table>
                        <TableHeader className="hidden sm:table-header-group">
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Concepto</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                                <TableHead className="text-center">Evidencia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                        No hay movimientos registrados en este periodo.
                                    </TableCell>
                                </TableRow>
                            )}
                            {transactions.map((tx) => (
                                <TableRow key={tx.id} className="block sm:table-row border-b border-slate-100 dark:border-slate-800 last:border-0 p-4 sm:p-0">
                                    <TableCell className="hidden sm:table-cell font-medium text-slate-600">{tx.date}</TableCell>
                                    <TableCell className="block sm:table-cell p-4 sm:p-4">
                                        <div className="flex justify-between items-start mb-1 sm:hidden">
                                            <span className="text-xs text-slate-400">{tx.date}</span>
                                            <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-white mb-1 sm:mb-0">{tx.description}</div>
                                        <div className="flex items-center gap-2 sm:hidden">
                                            <Badge variant="outline" className="font-normal text-[10px] h-5 px-1.5 text-slate-500">
                                                {tx.category}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="outline" className="font-normal text-xs text-slate-500">
                                            {tx.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`hidden sm:table-cell text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-center">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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

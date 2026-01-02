'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// MOCK DATA (Duplicated for standalone access - in real app would be fetched)
const MOCK_INVENTORY = {
    mobiliario: [
        { id: 'm1', name: 'Sofá Cama Gris', area: 'Sala', status: 'good' },
        { id: 'm2', name: 'Mesa de Centro', area: 'Sala', status: 'bad', comment: 'Rayadura visible en pata derecha.' },
        { id: 'm3', name: 'Comedor 6 Sillas', area: 'Comedor', status: 'good' },
        { id: 'm4', name: 'Cama King Size', area: 'Recámara Principal', status: 'good' },
    ],
    electrodomesticos: [
        { id: 'e1', name: 'Smart TV 55"', area: 'Sala', status: 'good' },
        { id: 'e2', name: 'Refrigerador Samsung', area: 'Cocina', status: 'good' },
        { id: 'e3', name: 'Microondas', area: 'Cocina', status: 'good' },
        { id: 'e4', name: 'Aire Acondicionado', area: 'Recámara Principal', status: 'good' },
    ],
    decoracion: [
        { id: 'd1', name: 'Cuadro Abstracto Azul', area: 'Sala', found: true },
        { id: 'd2', name: 'Jarrón de Cerámica', area: 'Comedor', found: true },
        { id: 'd3', name: 'Lámpara de Pie', area: 'Sala', found: false },
    ]
}

const MOCK_AREAS = [
    { id: 'a1', name: 'Sala', elements: ['Piso', 'Techo', 'Paredes', 'Ventanas', 'Iluminación'] },
    { id: 'a2', name: 'Cocina', elements: ['Piso', 'Techo', 'Paredes', 'Gabinetes', 'Grifería'] },
    { id: 'a3', name: 'Recámara Principal', elements: ['Piso', 'Techo', 'Paredes', 'Closet', 'Puerta'] },
    { id: 'a4', name: 'Baño', elements: ['Piso', 'Azulejos', 'Inodoro', 'Lavabo', 'Ducha'] },
    { id: 'a5', name: 'Terraza', elements: ['Piso', 'Barandal', 'Techo'] },
]

export default function InspectionReportParams() {
    const params = useParams()
    const inspectionId = params.id as string
    const [mounted, setMounted] = useState(false)

    // Demo State for Report
    const physicalProblems = [
        { area: 'Sala', element: 'Paredes', comment: 'Mancha de humedad en esquina superior.' }
    ]

    useEffect(() => {
        setMounted(true)
        // Auto-print after a brief delay to ensure rendering
        const timer = setTimeout(() => {
            window.print()
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-8 md:p-12 max-w-4xl mx-auto print:p-0 print:max-w-none">

            {/* CORPORATE HEADER */}
            <header className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 text-white font-black px-2 py-0.5 text-xl tracking-tighter">S</div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Reporte de Inspección</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest pl-9">Departamento de Verificación</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-slate-900 tracking-tighter mix-blend-multiply">
                        Stockea
                    </div>
                </div>
            </header>

            {/* METADATA GRID COMPACT */}
            <section className="bg-slate-50 border border-slate-200 rounded p-4 mb-6 grid grid-cols-4 gap-4 text-xs print:bg-transparent print:border-slate-300 print:p-0 print:mb-4">
                <div>
                    <h3 className="font-bold text-slate-500 uppercase mb-0.5">Propiedad</h3>
                    <p className="font-bold text-slate-900 text-sm">Casa Tortuga</p>
                </div>
                <div>
                    <h3 className="font-bold text-slate-500 uppercase mb-0.5">Unidad</h3>
                    <p className="font-bold text-slate-900 text-sm">Depto 101</p>
                </div>
                <div>
                    <h3 className="font-bold text-slate-500 uppercase mb-0.5">Verificador</h3>
                    <p className="font-medium text-slate-900">Carlos Rodríguez</p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-slate-500 mb-0.5">FOLIO: {(inspectionId || '001').slice(0, 6)}</p>
                    <p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                </div>
            </section>

            {/* FINDINGS BODY */}
            <div className="space-y-5">

                {/* 1. RESUMEN DE ESTADO */}
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="bg-green-50 rounded p-4 border border-green-100 print:border-slate-200 print:bg-transparent">
                        <div className="text-2xl font-bold text-green-700">92%</div>
                        <div className="text-xs font-bold text-green-800 uppercase">Estado General</div>
                    </div>
                    <div className="bg-red-50 rounded p-4 border border-red-100 print:border-slate-200 print:bg-transparent">
                        <div className="text-2xl font-bold text-red-700">3</div>
                        <div className="text-xs font-bold text-red-800 uppercase">Incidencias Reportadas</div>
                    </div>
                    <div className="bg-amber-50 rounded p-4 border border-amber-100 print:border-slate-200 print:bg-transparent">
                        <div className="text-2xl font-bold text-amber-700">1</div>
                        <div className="text-xs font-bold text-amber-800 uppercase">Faltantes</div>
                    </div>
                </div>

                {/* 2. TABLAS DETALLADAS */}

                {/* Mobiliario */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                        Mobiliario y Equipo
                    </h3>
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs">
                                <th className="py-2 pr-4 font-semibold">Elemento</th>
                                <th className="py-2 px-2 font-semibold">Ubicación</th>
                                <th className="py-2 px-2 font-semibold text-center h-10 w-24">Estado</th>
                                <th className="py-2 pl-4 font-semibold w-1/2">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_INVENTORY.mobiliario.map(item => (
                                <tr key={item.id} className="group">
                                    <td className="py-3 pr-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="py-3 px-2 text-slate-500">{item.area}</td>
                                    <td className="py-3 px-2 text-center">
                                        {item.status === 'good' ? (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-green-700 bg-green-100 rounded print:bg-transparent print:text-black print:border print:border-slate-300">
                                                BUENO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-red-700 bg-red-100 rounded print:bg-transparent print:text-black print:border print:border-black">
                                                DAÑO
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 pl-4 text-slate-600 italic">
                                        {item.status === 'bad' ? item.comment : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Electrodomésticos - Simplified List if all good */}
                <div>
                    <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                        Electrodomésticos
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {MOCK_INVENTORY.electrodomesticos.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b border-slate-50 py-2">
                                <span className="text-slate-700">{item.name}</span>
                                <div className="flex items-center text-green-700 text-xs font-bold gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> FUNCIONAL
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incidencias Específicas (Faltantes y Daños Físicos) */}
                <div className="break-inside-avoid">
                    <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4 flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        Incidencias Registradas
                    </h3>

                    <div className="space-y-4">
                        {/* Faltantes */}
                        <div className="bg-amber-50 border border-amber-200 rounded p-4 print:bg-transparent print:border-slate-300">
                            <h4 className="text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Elementos Faltantes
                            </h4>
                            <ul className="list-disc list-inside text-sm text-slate-800">
                                {MOCK_INVENTORY.decoracion.filter(d => d.found === false).map(d => (
                                    <li key={d.id}><span className="font-semibold">{d.name}</span> ({d.area}) - No localizado durante la inspección.</li>
                                ))}
                            </ul>
                        </div>

                        {/* Daños Físicos */}
                        <div className="bg-red-50 border border-red-200 rounded p-4 print:bg-transparent print:border-slate-300">
                            <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Daños en Estructura / Físico
                            </h4>
                            <ul className="space-y-2">
                                {physicalProblems.map((p, idx) => (
                                    <li key={idx} className="text-sm flex gap-3">
                                        <span className="font-bold min-w-[120px] text-slate-900">{p.area} / {p.element}:</span>
                                        <span className="text-slate-700">{p.comment}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-8 text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2">
                <p>Reporte generado automáticamente por Stockea App.</p>
                <p className="font-mono">ID: {inspectionId} | IMPRESO: {new Date().toLocaleString()}</p>
            </footer>

            <style jsx global>{`
                @media print {
                    @page {
                        size: letter;
                        margin: 0mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        
                        /* Fix Alignment: Scale from top-left corner to avoid centering shifts */
                        transform: scale(0.75);
                        transform-origin: top left;
                        width: 133.33%; /* Precise compensation for 0.75 scale */
                        
                        /* Margins & Padding */
                        margin: 0;
                        padding: 12mm 15mm; /* Adjusted padding */
                    }
                    html { background-color: white; }
                }
            `}</style>
        </div>
    )
}

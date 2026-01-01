'use client'

import { useState, useEffect } from 'react'
import { AreaName, AreaIssueType, AreaEvaluation } from '@/types/area'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { AlertTriangle, CheckCircle, Plus } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface AreaEvaluatorProps {
    apartmentId: string
    onSave?: (evaluations: AreaEvaluation[]) => void
}

const DEFAULT_AREAS: AreaName[] = ['Sala', 'Cocina', 'Comedor', 'Recamara', 'Baño', 'Pasillo', 'Patio/Terraza']

const ISSUES: AreaIssueType[] = [
    'Paredes', 'Piso', 'Techo', 'Iluminacion', 'Ventanas',
    'Puertas', 'Enchufes', 'Zoclos', 'Apagadores', 'Olor/Humedad/Plaga'
]

export function AreaEvaluator({ apartmentId, onSave }: AreaEvaluatorProps) {
    const [areas, setAreas] = useState<AreaName[]>(DEFAULT_AREAS)

    // State map: areaName -> evaluation details
    const [evaluations, setEvaluations] = useState<Record<string, { good: boolean; issues: AreaIssueType[]; notes: string }>>(
        DEFAULT_AREAS.reduce((acc, area) => ({
            ...acc,
            [area]: { good: true, issues: [], notes: '' }
        }), {})
    )

    const [newAreaName, setNewAreaName] = useState('')
    const [isAddAreaOpen, setIsAddAreaOpen] = useState(false)
    const { toast } = useToast()

    // Load
    useEffect(() => {
        const savedAreas = localStorage.getItem(`areas_list_${apartmentId}`)
        const savedEvals = localStorage.getItem(`area_evaluations_${apartmentId}`)
        if (savedAreas) {
            try { setAreas(JSON.parse(savedAreas)) } catch (e) { console.error(e) }
        }
        if (savedEvals) {
            try { setEvaluations(JSON.parse(savedEvals)) } catch (e) { console.error(e) }
        }
    }, [apartmentId])

    // Auto-save logic (or inside handleSave?)
    // The user asked "que se queden aqui en storage local". Auto-save is best.
    useEffect(() => {
        localStorage.setItem(`areas_list_${apartmentId}`, JSON.stringify(areas))
        localStorage.setItem(`area_evaluations_${apartmentId}`, JSON.stringify(evaluations))
    }, [areas, evaluations, apartmentId])

    const handleAddArea = () => {
        if (!newAreaName.trim()) return
        const name = newAreaName.trim()
        if (areas.includes(name)) return // Prevent duplicates

        setAreas([...areas, name])
        setEvaluations(prev => ({
            ...prev,
            [name]: { good: true, issues: [], notes: '' }
        }))
        setNewAreaName('')
        setIsAddAreaOpen(false)

        toast({
            title: "Sección agregada",
            description: `Se ha añadido "${name}" a la lista de áreas.`
        })
    }

    const handleToggleGood = (area: AreaName, isGood: boolean) => {
        setEvaluations(prev => ({
            ...prev,
            [area]: { ...prev[area], good: isGood, issues: isGood ? [] : prev[area].issues }
        }))
    }

    const handleToggleIssue = (area: AreaName, issue: AreaIssueType) => {
        setEvaluations(prev => {
            const currentIssues = prev[area].issues
            const newIssues = currentIssues.includes(issue)
                ? currentIssues.filter(i => i !== issue)
                : [...currentIssues, issue]
            return {
                ...prev,
                [area]: { ...prev[area], issues: newIssues }
            }
        })
    }

    const handleNoteChange = (area: AreaName, note: string) => {
        setEvaluations(prev => ({
            ...prev,
            [area]: { ...prev[area], notes: note }
        }))
    }

    const handleSave = () => {
        // Convert map to array
        const result: AreaEvaluation[] = areas.map(area => ({
            id: `eval-${area}-${Date.now()}`,
            apartmentId,
            areaName: area,
            isGoodCondition: evaluations[area].good,
            issues: evaluations[area].issues,
            notes: evaluations[area].notes,
            lastEvaluatedAt: new Date(),
            evaluatedBy: 'admin' // Placeholder
        }))
        onSave?.(result)

        toast({
            title: "Evaluación guardada",
            description: "Los datos se han registrado correctamente."
        })
    }

    // Calcular resumen
    const areasWithIssues = Object.entries(evaluations).filter(([_, data]) => !data.good).length
    const totalIssues = Object.values(evaluations).reduce((acc, data) => acc + data.issues.length, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-lg font-medium">Evaluación de Áreas Físicas</h3>
                    <p className="text-sm text-muted-foreground">
                        {areasWithIssues === 0
                            ? "Todas las áreas están en buen estado."
                            : `${areasWithIssues} área(s) con ${totalIssues} desperfecto(s) reportado(s).`
                        }
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Dialog open={isAddAreaOpen} onOpenChange={setIsAddAreaOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Sección
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Agregar Nueva Sección/Área</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Label>Nombre de la sección</Label>
                                <Input
                                    placeholder="Ej. Cuarto de Juegos, Balcón Trasero..."
                                    value={newAreaName}
                                    onChange={(e) => setNewAreaName(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddArea}>Agregar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleSave}>
                        Guardar Evaluación
                    </Button>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {areas.map((area) => {
                    const data = evaluations[area]
                    // If newly added area doesn't have state yet (sync issue safety), fallback
                    if (!data) return null

                    return (
                        <AccordionItem key={area} value={area} className="border rounded-lg bg-white dark:bg-slate-950 px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="font-medium">{area}</span>
                                    <div className="flex items-center gap-2">
                                        {data.good ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Buen Estado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Con Detalles
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <Label htmlFor={`switch-${area}`} className="font-medium cursor-pointer">
                                        ¿El área se encuentra en buenas condiciones?
                                    </Label>
                                    <Switch
                                        id={`switch-${area}`}
                                        checked={data.good}
                                        onCheckedChange={(checked) => handleToggleGood(area, checked)}
                                    />
                                </div>

                                {!data.good && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-3">
                                            <Label className="text-sm text-slate-500">Seleccione los elementos con desperfectos:</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {ISSUES.map(issue => (
                                                    <div key={issue} className="flex items-center space-x-2 border p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                                        <Checkbox
                                                            id={`check-${area}-${issue}`}
                                                            checked={data.issues.includes(issue)}
                                                            onCheckedChange={() => handleToggleIssue(area, issue)}
                                                        />
                                                        <Label
                                                            htmlFor={`check-${area}-${issue}`}
                                                            className="text-sm font-normal cursor-pointer w-full"
                                                        >
                                                            {issue}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`notes-${area}`}>Notas adicionales sobre los desperfectos:</Label>
                                            <Textarea
                                                id={`notes-${area}`}
                                                placeholder="Describa el detalle del daño..."
                                                value={data.notes}
                                                onChange={(e) => handleNoteChange(area, e.target.value)}
                                                className="resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

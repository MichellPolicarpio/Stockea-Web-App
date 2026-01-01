export type AreaName = string

export type AreaIssueType =
    | 'Paredes'
    | 'Piso'
    | 'Techo'
    | 'Iluminacion'
    | 'Ventanas'
    | 'Puertas'
    | 'Enchufes'
    | 'Zoclos'
    | 'Apagadores'
    | 'Olor/Humedad/Plaga'
    | 'Otro'

export interface AreaEvaluation {
    id: string
    apartmentId: string
    areaName: AreaName
    isGoodCondition: boolean
    issues: AreaIssueType[]
    notes?: string
    lastEvaluatedAt: Date
    evaluatedBy?: string // ID del usuario (admin)
}

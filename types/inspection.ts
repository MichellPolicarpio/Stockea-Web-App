export type InspectionItemStatus = 'ok' | 'issue' | 'missing'

export interface InspectionItem {
  inventoryItemId: string
  status: InspectionItemStatus
  notes?: string
}

export type InspectionStatus = 'pending' | 'completed' | 'cancelled'

export interface Inspection {
  id: string
  apartmentId: string
  verifierId: string
  status: InspectionStatus
  items: InspectionItem[]
  generalNotes?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}



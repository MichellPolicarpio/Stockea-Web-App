// Asignaciones: ownerId -> apartmentIds
export const ownerAssignments: Record<string, string[]> = {
  'owner-1': ['apt-1', 'apt-2', 'apt-5'],
  'owner-2': ['apt-3', 'apt-6', 'apt-8'],
}

// Asignaciones: verifierId -> apartmentIds (departamentos a verificar)
export const verifierAssignments: Record<string, string[]> = {
  'verifier-1': ['apt-1', 'apt-2', 'apt-3', 'apt-5'],
  'verifier-2': ['apt-6', 'apt-8'],
}



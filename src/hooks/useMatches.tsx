import { useState } from "react"
import { toast } from "sonner";
import { updateMatchById, deleteMatchById } from '@/services/matches'

export default function useMatches(initialMatches: []) {
  const [matches, setMatches] = useState(initialMatches)

  const deleteMatch = async ({idMatch}: {idMatch: number}) => {
    try {
      const response = await deleteMatchById({idMatch})
      if(!response.ok) {
        const errorMessage = (await response.json()).error
        const errToThrow =  new Error(errorMessage)
        errToThrow.name = 'NotFound'
        throw errToThrow;
      }
      toast.success("Match eliminadao con exito");
      setMatches((prevMatches: any) => {
        return prevMatches.filter((match: any) => {
          return match.match_id !== idMatch
        })
      })
    } catch (error: any) {
      if(error.name === 'NotFound') {
        toast.error(error.message)
        return;
      }
      toast.error('Error al tratar de eliminar la pareja')
    }
  }

  const updateMatch = async ({idMatch, updateData}: {idMatch: number, updateData: any}) => {
    try {
      const response = await updateMatchById({idMatch: idMatch, updateData})

      if(!response.ok) {
        const errorMessage = (await response.json()).error
        const errToThrow =  new Error(errorMessage)
        errToThrow.name = 'NotFound'
        throw errToThrow;
      }
      toast.success("Match actualizado con exito");

      // Update the state
      // const  { matches: matchesUpdated } = await getMatches()
      setMatches((prevMatches: any) => {
        const updatedMatches = prevMatches.map((match: any) => {
          if(match.match_id === idMatch) {
            return {
              ...match,
              points_d1: updateData.points_d1,
              points_d2: updateData.points_d2
            }
          }
          return match;
        })
        return updatedMatches
      })
    } catch (error: any) {
      if(error.name === 'NotFound') {
        toast.error(error.message)
        return;
      }
      toast.error('Error al tratar de actualizar la pareja')
    }
  }

  return {matches, updateMatch, deleteMatch}
}

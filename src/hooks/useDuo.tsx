import { useEffect, useState } from "react"
import { toast } from "sonner";
import { getDuos, deleteDuoById, updateDuoById } from '@/services/duos'

import type { DuoTable } from "@/lib/types";

export function useDuo() {
  const [duos, setDuos] = useState<DuoTable[] | []>([])
  const [loading, setLoading] = useState<Boolean| null>(null)

  const deleteDuo = async ({idDuo}: {idDuo: number}) => {
    try {
      const response = await deleteDuoById({idDuo})
      if(!response.ok) {
        const errorMessage = (await response.json()).error
        const errToThrow =  new Error(errorMessage)
        errToThrow.name = 'NotFound'
        throw errToThrow;
      }
      toast.success("Pareja eliminada con exito");
      const newDuos = duos.filter(duo => duo.id !== idDuo)
      setDuos(newDuos)
    } catch (error: any) {
      if(error.name === 'NotFound') {
        toast.error(error.message)
        return;
      }
      toast.error('Error al tratar de eliminar la pareja')
    }
  }

  const updateDuo = async ({idDuo, updateData}: {idDuo: number, updateData: any}) => {
    try {
      const response = await updateDuoById({idDuo, updateData})

      if(!response.ok) {
        const errorMessage = (await response.json()).error
        const errToThrow =  new Error(errorMessage)
        errToThrow.name = 'NotFound'
        throw errToThrow;
      }
      toast.success("Pareja actualizada con exito");

      // Update the state
      const  { duos: duosUpdated } = await getDuos()
      setDuos(duosUpdated)
    } catch (error: any) {
      if(error.name === 'NotFound') {
        toast.error(error.message)
        return;
      }
      toast.error('Error al tratar de actualizar la pareja')
    }
  }

  useEffect(() => {
    setLoading(true)
    getDuos()
      .then(dataDuos => {
        if(!dataDuos) throw new Error('Error al cargar las parejas')
        const { duos: allDuos } = dataDuos
        setDuos(allDuos)
      })
      .catch(err => toast.error(err))
      .finally(() => {
        setTimeout(() => setLoading(false), 1000)
      })
  }, [])

  return {duos, loading, deleteDuo, updateDuo}
}

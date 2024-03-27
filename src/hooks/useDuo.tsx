import { useEffect, useState } from "react"
import { toast } from "sonner";

import type { DatabaseDuo } from "@/lib/db";

export function useDuo() {
  const [duos, setDuos] = useState<DatabaseDuo[] | []>([])
  const [loading, setLoading] = useState<Boolean| null>(null)
  const API_URL = '/api/duos';

  const getDuos = () => {
    return fetch(API_URL)
      .then(response => response.json())
      .then(data => data)
      .catch(err => {
        console.log(err)
      })
  }

  const deleteDuo = async ({idDuo}: {idDuo: number}) => {
    const sessionId = window.localStorage.getItem("TF2024")
    const fetchOpts =  {
      method: 'DELETE',
      body: JSON.stringify({id: idDuo}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      }
    }

    try {
      const response = await fetch('/api/duos', fetchOpts)
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

    const sessionId = window.localStorage.getItem("TF2024")
    const fetchOpts =  {
      method: 'PATCH',
      body: JSON.stringify({id: idDuo, data: updateData}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      }
    }

    try {
      const response = await fetch('/api/duos', fetchOpts)
      if(!response.ok) {
        const errorMessage = (await response.json()).error
        const errToThrow =  new Error(errorMessage)
        errToThrow.name = 'NotFound'
        throw errToThrow;
      }
      toast.success("Pareja actualizada con exito");
      // Update the state
      const duosUpdated = duos.map(duo => {
        if(duo.id === idDuo) {
          const duoEdited = {
            ...duo,
            ...updateData
          }
          return duoEdited;
        }
        return duo
      })
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
      .then(data => {
        const { duos: allDuos } = data
        setDuos(allDuos)
      })
      .catch(err => console.log(err))
      .finally(() => {
        setTimeout(() => setLoading(false), 1000)
      })
  }, [])

  return {duos, loading, getDuos, deleteDuo, updateDuo}
}

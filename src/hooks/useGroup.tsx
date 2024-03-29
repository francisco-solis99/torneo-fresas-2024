import { useEffect, useState } from "react"

import type { GroupTable } from "@/lib/types";

export function useGroup() {
  const [groups, setGroups] = useState<GroupTable[] | []>([])
  const API_URL = '/api/groups';

  const getGroups = () => {
    return fetch(API_URL)
      .then(response => response.json())
      .then(data => data)
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getGroups()
      .then(dataGroups => {
        const { groups: allGroups } = dataGroups
        setGroups(allGroups)
      })
      .catch(err => console.log(err))
  }, [])

  return { groups }
}

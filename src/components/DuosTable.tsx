import { useDuo } from "@/hooks/useDuo"
import { useGroup } from "@/hooks/useGroup"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { UndoDot, Trash2 } from 'lucide-react';
import type React from "react"



export default function DuosTable(props: any) {
  const {duos, loading, deleteDuo, updateDuo} = useDuo()
  const { groups } = useGroup()

  const handlerDelete = ({idDuo}: {idDuo: number}) => {
    deleteDuo({idDuo})
  }

  const handlerUpdate = (e: React.FormEvent, {idDuo}:{idDuo: number}) => {
    e.preventDefault()
    const updateData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    updateDuo({idDuo, updateData})
  }

  return (
    <div>
      {
        loading || loading === null
        ? (
          <>
            {props.loader}
          </>
        )
        : (
          <Table className="overflow-x-auto">
            <TableCaption>Lista de parejas para el torneo de las fresas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center xs:text-left text-sm xs:text-base">Jugador 1</TableHead>
                <TableHead className="text-center xs:text-left text-sm xs:text-base">Jugador 2</TableHead>
                <TableHead className="text-center xs:text-left text-sm xs:text-base">Grupo</TableHead>
                <TableHead className="text-center xs:text-left text-sm xs:text-base">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
            {
                duos.map((duo) => (
                  <TableRow key={duo.id}>
                    <TableCell>{duo.player1}</TableCell>
                    <TableCell>{duo.player2}</TableCell>
                    <TableCell>{duo.groupName}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* Update */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button title="Actualizar pareja" size={'icon'} variant={'secondary'} aria-label="Actualizar pareja">
                              <span className="sr-only">Actualizar</span>
                              <UndoDot className="h-3 m-3 sm:h-4 w-4"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Actulizar pareja</DialogTitle>
                              <DialogDescription>
                                Haz cambios de la pareja. Da click en guardar al finalizar
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="grid gap-4 py-4"
                              id="update-duo-form"
                              onSubmit={(e) => {
                                handlerUpdate(e, {idDuo: duo.id})
                              }}
                            >
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="player1" className="text-right">
                                  Jugador 1
                                </label>
                                <Input
                                  id="player1"
                                  name="player1"
                                  defaultValue={duo.player1}
                                  maxLength={45}
                                  className="col-span-3" required />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="player2" className="text-right">
                                  Jugador 2
                                </label>
                                <Input
                                  id="player2"
                                  name="player2"
                                  defaultValue={duo.player2}
                                  maxLength={45}
                                  className="col-span-3" required />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="group_id" className="text-right">
                                  Grupo
                                </label>
                                <select className="col-span-3 bg-card border border-input px-3 py-1 text-sm shadow-sm transition-colors rounded-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" name="group_id" id="group_id" required>
                                  <option
                                    value={[duo.groupId?.toString(), duo.groupName]}
                                  >
                                    {duo.groupName ?? 'Selecciona grupo'}
                                  </option>
                                  {
                                    groups.map(group => {
                                      return (
                                        <option
                                          key={group.id}
                                          value={[group.id.toString(), group.name]}
                                          className={group.id === duo.groupId ? 'hidden' : ''}
                                        >
                                            {group.name}
                                        </option>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                            </form>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button form="update-duo-form" type="submit">
                                  Guardar cambios
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button title="Eliminar pareja" size={'icon'} variant={'secondary'} aria-label="Eliminar pareja">
                              <span className="sr-only">Eliminar</span>
                              <Trash2 className="h-3 m-3 sm:h-4 w-4"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Confirmar eliminación</DialogTitle>
                              <DialogDescription>
                                ¿Estás seguro que deseas eliminar esta pareja?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                  Cancelar
                                </Button>
                              </DialogClose>
                              <Button type="button" onClick={() => handlerDelete({idDuo: duo.id})}>
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>


            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total Parejas</TableCell>
                <TableCell>{duos.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )
      }
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import useMatches from '@/hooks/useMatches';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"


export default function MatchDialog(
    { matchId, duo1Id, duo2Id, phaseId, pointsDuo1, pointsDuo2, updateMatchFn, deleteMatchFn}
    :
    { matchId: number, duo1Id: number, duo2Id: number, phaseId: number,
      pointsDuo1: number, pointsDuo2: number,
      updateMatchFn: Function, deleteMatchFn: Function
    }
)
{
  const handleUpdateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    const updateData: any = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    // set the other info to the match
    updateData['duo1_id'] = duo1Id
    updateData['duo2_id'] = duo2Id
    updateData['phase_id'] = phaseId
    await updateMatchFn({idMatch: matchId, updateData})
  }

  const handleDeleteMatch = async () => {
    await deleteMatchFn({idMatch: matchId})
  }

  return (
    <div className="absolute -top-5 -right-0">
      <Dialog>
        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Match</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Options */}
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <span>Registrar score</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem>
              <Button size={'sm'} variant={'ghost'} className="text-left p-0 m-0" onClick={handleDeleteMatch}>Eliminar Match</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog content */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registra el score</DialogTitle>

            <DialogDescription>
              Actualiza el score. Da click en guardar al finalizar
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4 py-4"
            id="update-match-form"
            onSubmit={(e) => {
              handleUpdateMatch(e)
            }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="points_d1" className="text-right">
                Pareja 1
              </label>
              <Input
                id="points_d1"
                name="points_d1"
                defaultValue={pointsDuo1}
                maxLength={2}
                className="col-span-3"
                pattern="\d{1,2}"
                required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="points_d2" className="text-right">
                Pareja 2
              </label>
              <Input
                id="points_d2"
                name="points_d2"
                defaultValue={pointsDuo2}
                maxLength={2}
                className="col-span-3"
                pattern="\d{1,2}"
                required />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button form="update-match-form" type="submit">
                Guardar cambios
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MatchDialog() {
  return (
    <div className="absolute -top-10 right-0">
      <Dialog>
        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="h-8 w-8 p-0">
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
            <DropdownMenuItem>Eliminar Match</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this file from our servers?
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

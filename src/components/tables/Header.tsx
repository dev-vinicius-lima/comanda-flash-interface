// components/TableGrid/TableHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Image from "next/image"

export interface TableHeaderProps {
  onMenuClick?: () => void
}

export const TableHeader = ({ onMenuClick }: TableHeaderProps) => {
  return (
    <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20for%20Comanda%20Flash%20digital%20ordering%20system,%20dramatic%20cinematic%20style,%20geometric%20shapes,%20clean%20lines,%20balance,%20symmetry,%20visual%20clarity,%20warm%20inspired,%20reds,%20oranges,%20yellows,%20film-like%20composition.jpg-0fRS4KWzN4sQtJYrBlRHsRc81tn4bM.jpeg"
            width={100}
            height={100}
            alt="Comanda Flash Logo"
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-[#FFD700] font-semibold">Mesas</h1>
      </div>
    </header>
  )
}

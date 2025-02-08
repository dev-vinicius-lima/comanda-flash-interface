import React from "react"
import { X } from "lucide-react" // Importando o ícone X

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md mx-4 shadow-[0_0_50px_rgba(255,77,0,0.15)] animate-in fade-in-0 zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-800 hover:text-zinc-950 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          <X className="h-7 w-7" />
          <span className="sr-only">Fechar</span>
        </button>

        <div className="p-6 mt-2">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] bg-clip-text text-transparent">
            Comanda Flash
          </h2>

          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal

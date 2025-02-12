import { Button } from "@/components/ui/button"
import { useUserRole } from "@/hooks/useUserRole"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export interface TableHeaderProps {
  onMenuClick?: () => void
}

export const TableHeader = () => {
  const userRole = useUserRole()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {userRole === "ADMIN" && (
              <Button
                variant="ghost"
                onClick={toggleMenu}
                size="lg"
                className="bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 p-3"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
                <span className="sr-only">Menu</span>
              </Button>
            )}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-b from-zinc-900 to-black border border-orange-900/20 backdrop-blur-lg"
                >
                  <div className="py-2">
                    {[
                      { label: "Mesas", href: "#" },
                      { label: "Produtos", href: "#" },
                      { label: "Pedidos", href: "#" },
                      { label: "Relatórios", href: "#" },
                      { label: "Configurações", href: "#" },
                    ].map((item, index) => (
                      <motion.a
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        href={item.href}
                        className="block px-4 py-3 text-sm text-zinc-300 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-transparent hover:text-orange-400 transition-colors duration-200"
                      >
                        {item.label}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

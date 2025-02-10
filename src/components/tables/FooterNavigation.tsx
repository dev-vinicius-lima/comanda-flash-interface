import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function FooterNavigation() {
  const router = useRouter()

  return (
    <footer className="fixed bottom-0 w-full border-t border-zinc-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-4">
          <Button
            variant="ghost"
            className="text-[#FF6B2B]"
            onClick={() => router.push("/openOrder")}
          >
            Abrir Comanda
          </Button>
          <Button variant="ghost" className="text-[#FFD700]">
            Consulta produtos
          </Button>
          <Button variant="ghost" className="text-[#4CAF50]">
            Resumo pedidos
          </Button>
        </div>
      </div>
    </footer>
  )
}

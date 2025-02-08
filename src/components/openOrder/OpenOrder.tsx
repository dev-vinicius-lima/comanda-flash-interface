"use client"

import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Utensils, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { TablesContext } from "@/context/TablesContext"
import { Order } from "../../app/types/types"

export default function OpenOrder() {
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setTables } = useContext(TablesContext)

  const router = useRouter()

  const handleOpenOrder = async () => {
    if (!customerName || !tableNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = sessionStorage.getItem("token")
      const response = await fetch(
        `https://comanda-flash-production.up.railway.app/orders/open?number=${tableNumber}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: customerName }),
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao abrir a comanda")
      }

      const data = await response.json()
      console.log("Comanda aberta com sucesso:", data)

      toast({
        title: "Comanda aberta com sucesso!",
        description: `ID da comanda: ${data.idOrder}`,
      })

      router.push("/tables")
      setTables((prev: Order[]) => [
        ...prev.filter((t) => t.id !== Number(tableNumber)),
        {
          id: Number(tableNumber),
          orderId: data.orderId,
          totalValue: 0,
          formattedTotalValue: "",
          customerName,
          tableNumber: Number(tableNumber),
          status: "occupied",
          items: [],
        },
      ])
    } catch (error) {
      console.error("Erro ao abrir a comanda:", error)
      toast({
        title: "Erro",
        description: "Erro ao abrir a comanda. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] bg-clip-text text-transparent">
          Abrir Comanda
        </h1>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Nome do Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Número da Mesa"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleOpenOrder}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF4D00] to-[#FF0000] hover:from-[#FF6D00] hover:to-[#FF2000] text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isLoading ? (
              "Processando..."
            ) : (
              <>
                Abrir Comanda
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

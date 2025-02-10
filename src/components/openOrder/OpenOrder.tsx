"use client"
import { useContext, useState } from "react"
import { motion } from "framer-motion"
import { Utensils, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TablesContext } from "@/context/TablesContext"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function OpenOrder() {
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setTables } = useContext(TablesContext)
  const router = useRouter()

  const fetchTables = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await fetch(
        "https://comanda-flash-production.up.railway.app/tables",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao buscar as mesas")
      }

      const data = await response.json()
      setTables(data) // Atualiza o estado das mesas
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error)
    }
  }

  const handleOpenOrder = async () => {
    if (!customerName || !tableNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        className: "bg-red-600 text-white font-semibold",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = sessionStorage.getItem("token")

      // Verifique se a mesa existe
      const tableResponse = await fetch(
        `https://comanda-flash-production.up.railway.app/tables/${tableNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (tableResponse.status === 404) {
        toast({
          title: "Mesa não encontrada",
          description: `A mesa ${tableNumber} não existe.`,
          className: "bg-red-600 text-white font-semibold",
        })
        return
      }
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

      if (response.status === 400) {
        toast({
          title: "Erro",
          description: "Mesa ocupada. Por favor, escolha outra mesa.",
          className: "bg-red-600 text-white font-semibold",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Erro ao abrir a comanda")
      }

      const data = await response.json()
      console.log("Comanda aberta com sucesso:", data)

      toast({
        title: "Comanda aberta com sucesso!",
        description: `ID da comanda: ${data.idOrder}`,
        className: "bg-green-600 text-white font-semibold",
      })
      await fetchTables()

      router.push("/tables")
    } catch (error) {
      console.error("Erro ao abrir a comanda:", error)
      toast({
        title: "Erro",
        description: "Erro ao abrir a comanda. Tente novamente.",
        className: "bg-red-600 text-white font-semibold",
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
              placeholder="N° da Mesa"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleOpenOrder}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Abrindo..." : "Abrir Comanda"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

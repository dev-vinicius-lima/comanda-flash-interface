"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Order, OrderDetail } from "@/app/types/types"
import Image from "next/image"
import Modal from "./modal/Modal"
import { useRouter } from "next/navigation"

export default function TableGrid() {
  const [tables, setTables] = useState<Order[]>([])
  const [tableDetails, setTableDetails] = useState<OrderDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTableNumber, setSearchTableNumber] = useState("")
  const [searchOrderNumber, setSearchOrderNumber] = useState("")

  const router = useRouter()

  useEffect(() => {
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
        const fetchedTables = data.flatMap(
          (section: { number: number; orders: Order[] }) =>
            section.orders.length > 0
              ? section.orders.map((order: Order) => ({
                  id: order.id,
                  orderId: order.id,
                  tableNumber: order.tableNumber,
                  status: order.status === "Aberta" ? "available" : "occupied",
                }))
              : [{ id: section.number, status: "available" }]
        )
        setTables(fetchedTables)
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error)
      }
    }

    fetchTables()
  }, [])

  // Função para buscar detalhes de uma mesa específica
  const fetchTableDetails = async (tableId: number) => {
    if (isNaN(tableId)) {
      console.error("ID de mesa inválido:", tableId)
      return
    }
    try {
      const token = sessionStorage.getItem("token")

      const response = await fetch(
        `https://comanda-flash-production.up.railway.app/tables/${tableId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!response.ok) {
        const errorDetails = await response.text()
        console.error("Erro na requisição:", errorDetails)
        throw new Error("Erro ao buscar detalhes da mesa")
      }
      const data = await response.json()
      console.log("📊 Dados recebidos da API:", data)

      const openOrders = data.orders.filter(
        (order: Order) => order.status === "Aberta"
      )
      if (
        data &&
        Array.isArray(openOrders.orders) &&
        openOrders.orders.length > 0
      ) {
        const order = openOrders.orders[0]

        const formattedData: OrderDetail = {
          id: order.id,
          number: order.number,
          customerId: order.customerId,
          customerName: order.customerName || "Sem nome",
          status: data.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items || [],
          totalValue: order.totalValue,
          formattedTotalValue: order.formattedTotalValue,
          orders: openOrders.orders,
        }

        setIsModalOpen(true)
        setTableDetails(formattedData)

        if (data && Array.isArray(data.orders)) {
          setTableDetails(data)
        } else {
          console.error("Estrutura de dados inesperada:", data)
        }
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da mesa:", error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTableDetails(null)
  }

  const uniqueTables = tables.filter(
    (table, index, self) => index === self.findIndex((t) => t.id === table.id)
  )

  const getStatusColor = (status: string) => {
    if (status === "available") {
      return "bg-[#4CAF50] hover:bg-[#43A047] text-white"
    } else if (status === "occupied") {
      return "bg-[#FF6B2B] hover:bg-[#E31837] text-white"
    }
    return ""
  }

  const filteredTables = uniqueTables.filter(
    (table) =>
      table.tableNumber.toString().includes(searchTableNumber) &&
      (searchOrderNumber
        ? table.orderId.toString().includes(searchOrderNumber)
        : true)
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-zinc-400">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            {/* Search Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Mesa"
                value={searchTableNumber}
                onChange={(e) => setSearchTableNumber(e.target.value)}
                className="bg-black/50 border border-zinc-800 rounded-md px-4 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
              />
              <input
                type="text"
                placeholder="Comanda"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                className="bg-black/50 border border-zinc-800 rounded-md px-4 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
              />
            </div>

            {/* Table Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredTables.map((table) => (
                <Button
                  key={table.id}
                  className={`h-24 text-2xl font-bold text-white ${getStatusColor(
                    table.status
                  )}`}
                  variant="ghost"
                  onClick={() => fetchTableDetails(table.id)}
                >
                  {table.tableNumber}
                </Button>
              ))}
            </div>
            {/* Exibir detalhes da mesa ao clicar */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              {tableDetails ? (
                <div className="text-zinc-200 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                  <div>
                    <h2 className="text-lg font-semibold text-black">
                      Detalhes da Mesa Nº {tableDetails.number}
                    </h2>
                    <p className="text-zinc-700">
                      <strong>Status:</strong>{" "}
                      {tableDetails.status || "Desconhecido"}
                    </p>
                    <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-4"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-black">
                    Informações do Pedido:
                  </h3>
                  {tableDetails.orders.length > 0 ? (
                    tableDetails.orders.map((order) => (
                      <div key={order.id} className="mb-4 flex flex-col gap-1">
                        <p className="text-zinc-700">
                          <strong>Comanda:</strong> {order.id}
                        </p>
                        <p className="text-zinc-700">
                          <strong>Cliente:</strong>{" "}
                          {order.customerName || "Sem nome"}
                        </p>
                        <p className="text-zinc-700">
                          <strong>Status do pedido:</strong>{" "}
                          {order.status || "Desconhecido"}
                        </p>
                        <p className="text-zinc-700">
                          <strong>Total:</strong>{" "}
                          {order.formattedTotalValue || "R$0,00"}
                        </p>

                        <h4 className="text-lg font-semibold text-black">
                          Itens:
                        </h4>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, itemIndex) => (
                            <>
                              <p
                                key={`${item.productName}-${itemIndex}`}
                                className="text-zinc-700"
                              >
                                {item.productName} - {item.quantity}x R${" "}
                                {item.unitPrice.toFixed(2)} (Total: R${" "}
                                {item.totalPrice.toFixed(2)})
                              </p>
                              <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-4"></div>
                            </>
                          ))
                        ) : (
                          <>
                            <p className="text-zinc-700">
                              Nenhum item nesta comanda.
                            </p>
                            <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-4"></div>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-700">Nenhuma comanda disponível.</p>
                  )}
                </div>
              ) : (
                <p className="text-zinc-700">Carregando detalhes da mesa...</p>
              )}
            </Modal>
          </CardContent>
        </Card>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 w-full border-t border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Button
              variant="ghost"
              className="text-[#FF6B2B]"
              onClick={() => router.push("/openOrder")}
            >
              Lançar pedidos
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
    </div>
  )
}

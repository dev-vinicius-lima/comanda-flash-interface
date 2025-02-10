import { Order, OrderDetail } from "@/app/types/types"
import { Button } from "../ui/button"
import { useState } from "react"
import Modal from "./modal/Modal"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SearchInputs } from "./SearchBar"

interface TableListProps {
  tables: Order[]
  onTableClick: (tableId: number) => void
}

export default function TableList({ tables }: TableListProps) {
  const router = useRouter()
  const [searchTableNumber, setSearchTableNumber] = useState("")
  const [searchOrderNumber, setSearchOrderNumber] = useState("")
  const [tableDetails, setTableDetails] = useState<OrderDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

      const tableNumber: number = data.number

      if (openOrders.length > 0) {
        const order = openOrders[0]

        const formattedData: OrderDetail = {
          id: order.id,
          number: tableNumber,
          customerId: order.customerId,
          customerName: order.customerName || "Sem nome",
          status: data.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items || [],
          totalValue: order.totalValue,
          formattedTotalValue: order.formattedTotalValue,
          orders: openOrders,
        }

        setIsModalOpen(true)
        setTableDetails(formattedData)
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da mesa:", error)
    }
  }

  const filteredTables = tables.filter(
    (table) =>
      table.tableNumber.toString().includes(searchTableNumber) &&
      (searchOrderNumber
        ? table.orderId?.toString().includes(searchOrderNumber)
        : true)
  )
  const getStatusColor = (status: string) => {
    if (status === "available") {
      return "bg-[#4CAF50] hover:bg-[#43A047] text-white"
    } else if (status === "occupied") {
      return "bg-[#FF6B2B] hover:bg-[#E31837] text-white"
    }
    return ""
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTableDetails(null)
  }

  function handleDeleteOrder(id: number) {
    if (!id) {
      toast({
        title: "Erro ao excluir ordem",
        description: "Erro ao excluir ordem",
        className: "bg-red-600 text-white font-semibold",
      })
      return
    }
    if (confirm("Tem certeza que deseja excluir essa ordem?")) {
      router.push("/orderClosed/" + id)
    } else {
      toast({
        title: "Exclusão cancelada",
        description: "Exclusão foi cancelada",
        className: "bg-red-600 text-white font-semibold",
      })
    }
  }

  return (
    <>
      <SearchInputs
        searchTableNumber={searchTableNumber}
        setSearchTableNumber={setSearchTableNumber}
        searchOrderNumber={searchOrderNumber}
        setSearchOrderNumber={setSearchOrderNumber}
      />
      <div className="grid grid-cols-3 gap-4">
        {filteredTables.map((table) => (
          <Button
            key={`${table.id !== null ? table.id : "no-id"}-${
              table.tableNumber
            }`}
            className={`h-24 text-2xl font-bold text-white ${getStatusColor(
              table.status
            )}`}
            variant="ghost"
            onClick={() => {
              if (table.id !== null) {
                fetchTableDetails(table.id)
              } else {
                console.warn(`Mesa ${table.tableNumber} não tem ID associado.`)
              }
            }}
            disabled={table.id === null}
          >
            {table.tableNumber}
          </Button>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {tableDetails ? (
          <div className="text-zinc-200 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
            <div>
              <h2 className="text-lg font-semibold text-black">
                Detalhes da Mesa Nº {tableDetails.number}
              </h2>
              <p className="text-zinc-700">
                <strong>Status:</strong> {tableDetails.status || "Desconhecido"}
              </p>
              <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-6"></div>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">
                Informações do Pedido:
              </h3>
            </div>
            {tableDetails &&
            Array.isArray(tableDetails.orders) &&
            tableDetails.orders.length > 0 ? (
              tableDetails.orders.map((order) => (
                <div key={order.id} className="mb-4 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-700">
                      <strong>Comanda:</strong> {order.id}
                    </p>
                    <Button
                      variant="ghost"
                      className="text-white  bg-gradient-to-r from-[#FF4D00] to-[#FF0000] hover:bg-red/30 w-1/3 h-8 transition-colors text-sm font-semibold mx-2"
                      size="icon"
                      onClick={() => handleDeleteOrder(order.id as number)}
                    >
                      <p className="text-sm">Fechar Comanda</p>
                    </Button>
                  </div>
                  <p className="text-zinc-700">
                    <strong>Cliente:</strong> {order.customerName || "Sem nome"}
                  </p>
                  <p className="text-zinc-700">
                    <strong>Status do pedido:</strong>{" "}
                    {order.status || "Desconhecido"}
                  </p>
                  <p className="text-zinc-700">
                    <strong>Total:</strong>{" "}
                    {order.formattedTotalValue || "R$0,00"}
                  </p>
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-black">Itens:</h4>
                    <Button
                      variant="ghost"
                      className="text-white bg-green-600 hover:bg-red/30 w-1/3 h-8 transition-colors text-sm font-semibold mx-2"
                      size="icon"
                    >
                      <p className="text-sm">Adicionar item</p>
                    </Button>
                  </div>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => (
                      <div key={`${item.productName}-${itemIndex}`}>
                        <p className="text-zinc-700">
                          {item.productName} - {item.quantity}x R${" "}
                          {item.unitPrice.toFixed(2)} (Total: R${" "}
                          {item.totalPrice.toFixed(2)})
                        </p>
                        <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-5"></div>
                      </div>
                    ))
                  ) : (
                    <>
                      <p className="text-zinc-700">
                        Nenhum item nesta comanda.
                      </p>
                      <div className="h-[1px] bg-gradient-to-r from-[#FF4D00] via-[#FF0000] to-[#FFD700] my-5"></div>
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
    </>
  )
}

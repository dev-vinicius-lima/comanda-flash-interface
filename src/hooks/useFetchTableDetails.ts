import { useState, useEffect } from "react"
import { Order, OrderDetail } from "@/app/types/types"

interface UseFetchTableDetailsResult {
  tableDetails: OrderDetail | null
  loading: boolean
  error: string | null
}

const useFetchTableDetails = (
  tableId: number | null
): UseFetchTableDetailsResult => {
  const [tableDetails, setTableDetails] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!tableId || isNaN(tableId)) {
        setError("ID de mesa inválido")
        setLoading(false)
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
          setError(`Erro na requisição: ${errorDetails}`)
        } else {
          const data = await response.json()

          const openOrders = data.orders.filter(
            (order: Order) => order.status === "Aberta"
          )

          if (openOrders.length > 0) {
            const order = openOrders[0]
            const formattedData: OrderDetail = {
              id: order.id,
              number: data.number,
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
            setTableDetails(formattedData)
          }
        }
      } catch (error) {
        setError(`Erro ao buscar detalhes da mesa: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [tableId])

  return { tableDetails, loading, error }
}

export default useFetchTableDetails

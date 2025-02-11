import { useState, useEffect } from "react"
import { Table, TableSection } from "@/app/types/types"

const useFetchTables = (): Table[] => {
  const [tables, setTables] = useState<Table[]>([])

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
        const data: TableSection[] = await response.json()
        setTables(transformDataToTables(data))
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error)
      }
    }

    fetchTables()
  }, [])

  return tables
}

const transformDataToTables = (data: TableSection[]): Table[] => {
  return data.map((section) => ({
    id: section.id,
    orderId: section.orders.length > 0 ? section.orders[0].id : null,
    number: section.number,
    tableNumber: section.number,
    status: section.orders.some((order) => order.status === "Aberta")
      ? "occupied"
      : "available",
    totalValue: 0,
    formattedTotalValue: "R$ 0,00",
    customerName: "",
    items: [],
  }))
}

export default useFetchTables

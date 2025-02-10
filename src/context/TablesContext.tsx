// tablesContext.ts
import { Item, Order } from "@/app/types/types"
import { createContext, useEffect, useState } from "react"
type OrderShape =
  | {
      id: number
      orderId: string
      totalValue: number
      formattedTotalValue: string
      customerName: string
      tableNumber: number
      status: string
      items: Item[]
    }
  | { tableNumber: number; status: string }

type OrderArray = OrderShape[]
// In TablesContext.tsx
export const TablesContext = createContext<{
  tables: OrderArray
  setTables: (newTables: OrderArray) => void
  fetchTables: () => void
}>({
  tables: [],
  setTables: () => {},
  fetchTables: () => {},
})

export const TablesProvider = ({ children }: { children: React.ReactNode }) => {
  const [tables, setTables] = useState<
    { tableNumber: number; status: string }[]
  >([])

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
      console.log("📊 Dados recebidos da API GET ALL:", data)

      const tablesMap = new Map<number, Order[]>()

      data.forEach((section: { number: number; orders: Order[] }) => {
        section.orders.forEach((order: Order) => {
          if (!tablesMap.has(section.number)) {
            tablesMap.set(section.number, [])
          }
          tablesMap.get(section.number)?.push(order)
        })
      })

      const fetchedTables: Order[] = data.map(
        (section: { number: number; orders: Order[] }) => {
          const orders = section.orders
          const firstOrder = orders[0]

          return {
            id: firstOrder ? Number(firstOrder.id) : null, // ID da primeira ordem ou null
            orderId: firstOrder ? firstOrder.id : null, // ID da primeira ordem ou null
            tableNumber: section.number,
            status: orders.some((order) => order.status === "Aberta")
              ? "occupied"
              : "available",
            totalValue: 0,
            formattedTotalValue: "R$ 0,00",
            customerName: "",
            items: [],
          }
        }
      )

      // Adicionar mesas sem ordens
      const existingTableNumbers = new Set(
        fetchedTables.map((table) => table.tableNumber)
      )
      data.forEach((section: { number: number; orders: Order[] }) => {
        if (
          section.orders.length === 0 &&
          !existingTableNumbers.has(section.number)
        ) {
          fetchedTables.push({
            id: null,
            orderId: null,
            tableNumber: section.number,
            status: "available",
            totalValue: 0,
            formattedTotalValue: "R$ 0,00",
            customerName: "",
            items: [],
          })
        }
      })

      const uniqueTables = Array.from(
        new Set(fetchedTables.map((table) => table.tableNumber))
      )
      console.log("Mesas únicas:", uniqueTables)

      setTables(
        uniqueTables.map((tableNumber) => ({
          tableNumber,
          status: "available",
        }))
      )
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error)
    }
  }
  useEffect(() => {
    fetchTables()
  }, [])
  return (
    <TablesContext.Provider value={{ tables, setTables, fetchTables }}>
      {children}
    </TablesContext.Provider>
  )
}

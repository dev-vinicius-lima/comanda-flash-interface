// hooks/useFetchTables.ts
import { Order, OrderDetail } from "@/app/types/types"
import { useState, useEffect } from "react"

export function useFetchTables() {
  const [tables, setTables] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const data = await response.json()
        setTables(data)
      } catch (error) {
        setError("Erro ao buscar as mesas" + error)
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  return { tables, loading, error }
}

// hooks/useFetchTableDetails.ts
export function useFetchTableDetails(tableId: number) {
  const [details, setDetails] = useState<OrderDetail | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
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
        const data = await response.json()
        setDetails(data)
      } catch (error) {
        console.error("Erro ao buscar detalhes da mesa:", error)
      }
    }

    if (tableId) {
      fetchDetails()
    }
  }, [tableId])

  return details
}

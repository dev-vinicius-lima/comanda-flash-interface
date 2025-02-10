"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Order } from "@/app/types/types"

import { TableHeader } from "./Header"
import FooterNavigation from "./FooterNavigation"
import TableList from "./TableList"

export default function TableGrid() {
  const [tables, setTables] = useState<Order[]>([])
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
          (section: { id: number; number: number; orders: Order[] }) => {
            const orders = section.orders

            return {
              id: section.id,
              orderId: orders.length > 0 ? orders[0].id : null,
              number: section.number,
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
        data.forEach(
          (section: { id: number; number: number; orders: Order[] }) => {
            if (
              section.orders.length === 0 &&
              !existingTableNumbers.has(section.number)
            ) {
              fetchedTables.push({
                id: section.id,
                orderId: null,
                number: section.number,
                tableNumber: section.number,
                status: "available",
                totalValue: 0,
                formattedTotalValue: "R$ 0,00",
                customerName: "",
                items: [],
              })
            }
          }
        )

        const uniqueTables = Array.from(
          new Set(fetchedTables.map((table) => table.tableNumber))
        )
        console.log("Mesas únicas:", uniqueTables)

        setTables(fetchedTables)
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error)
      }
    }

    fetchTables()
  }, [])

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
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da mesa:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <TableHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            {/* Search Inputs */}
            {/* Table Grid */}
            <TableList tables={tables} onTableClick={fetchTableDetails} />

            {/* Modal */}
          </CardContent>
        </Card>
      </main>
      <FooterNavigation />
    </div>
  )
}

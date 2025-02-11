"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TableHeader } from "./Header"
import FooterNavigation from "./FooterNavigation"
import TableList from "./TableList"
import useFetchTables from "@/hooks/useFetchTables"

export default function TableGrid() {
  const tables = useFetchTables()

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
      <TableHeader />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <TableList tables={tables} onTableClick={fetchTableDetails} />
          </CardContent>
        </Card>
      </main>
      <FooterNavigation />
    </div>
  )
}

// components/TableGrid/TablesGrid.tsx
"use client"

import { Order } from "@/app/types/types"
import { Button } from "@/components/ui/button"

interface TablesGridProps {
  tables: Order[]
  onTableClick: (tableId: number) => void
}

const getStatusColor = (status: string): string => {
  if (status === "available") {
    return "bg-[#4CAF50] hover:bg-[#43A047] text-white"
  } else if (status === "occupied") {
    return "bg-[#FF6B2B] hover:bg-[#E31837] text-white"
  }
  return ""
}

export const TablesGrid = ({ tables, onTableClick }: TablesGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {tables.map((table) => (
        <Button
          key={`${table.id !== null ? table.id : "no-id"}-${table.tableNumber}`}
          className={`h-24 text-2xl font-bold text-white ${getStatusColor(
            table.status
          )}`}
          variant="ghost"
          onClick={() => {
            if (table.id !== null) {
              onTableClick(table.id)
            }
          }}
          disabled={!table.id}
        >
          {table.tableNumber}
        </Button>
      ))}
    </div>
  )
}

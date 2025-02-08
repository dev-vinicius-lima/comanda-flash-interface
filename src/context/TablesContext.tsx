// tablesContext.ts
import { Order } from "@/app/types/types"
import { createContext, useState } from "react"

export const TablesContext = createContext<{
  tables: Order[]
  setTables: React.Dispatch<React.SetStateAction<Order[]>>
}>({
  tables: [],
  setTables: () => null,
})

export const TablesProvider = ({ children }: { children: React.ReactNode }) => {
  const [tables, setTables] = useState<Order[]>([])

  return (
    <TablesContext.Provider value={{ tables, setTables }}>
      {children}
    </TablesContext.Provider>
  )
}

export interface Order {
  orderId: number
  formattedTotalValue: string
  customerName: string
  tableNumber: number
  status: string
  id: number
  items: Item[]
}

export interface Item {
  productId: number
  productName: string
  quantity: number
  totalPrice: number
  unitPrice: number
}
export interface OrderDetail {
  number: number
  id: number
  customerId: number
  customerName: string
  status: string
  createdAt: string | null
  updatedAt: string
  items: Item[]
  totalValue: number
  formattedTotalValue: string
  orders: Order[]
}

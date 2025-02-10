export interface Order {
  number: number
  id: number | null
  orderId: number | null
  tableNumber: number
  status: string
  totalValue: number
  formattedTotalValue: string
  customerName: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
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
  orders?: Order[]
}
export type NewOrderItem = {
  id: number
  orderId: string
  totalValue: number
  formattedTotalValue: string
  customerName: string
  tableNumber: number
  status: string
  items: Item[]
}

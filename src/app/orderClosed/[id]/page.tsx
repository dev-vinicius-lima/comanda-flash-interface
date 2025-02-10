"use client"

import { useParams } from "next/navigation"
import OrderDetails from "@/components/OrderDetails/OrderDetails"

const OrderDetailsPage = () => {
  const params = useParams()
  const orderId = params.id // Captura o ID da rota

  // Aqui você pode buscar os detalhes do pedido usando o `orderId`
  const order = {
    id: Number(orderId),
    tableNumber: 1,
    customerId: 1,
    customerName: "Cliente Exemplo",
    status: "Fechada",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:30:00Z",
    items: [
      {
        productId: 1,
        productName: "Produto 1",
        quantity: 2,
        totalPrice: 20,
        unitPrice: 10,
      },
    ],
    totalValue: 20,
    formattedTotalValue: "R$ 20,00",
  }

  return <OrderDetails order={order} />
}

export default OrderDetailsPage

"use client"

import { useParams } from "next/navigation"
import OrderDetails, {
  OrderDetailsProps,
} from "@/components/OrderDetails/OrderDetails"
import { useEffect, useState } from "react"

const OrderDetailsPage = () => {
  const params = useParams()
  const orderId = params.id // Captura o ID da rota
  const [orderData, setOrderData] = useState<OrderDetailsProps | null>(null)

  const fetchOrderDetails = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const response = await fetch(
        `https://comanda-flash-production.up.railway.app/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes do pedido")
      }
      const data = await response.json()
      console.log(data)
      setOrderData(data)
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error)
      return null
    }
  }
  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  return (
    <>
      {orderData ? <OrderDetails order={orderData} /> : <div>Loading...</div>}
    </>
  )
}

export default OrderDetailsPage

"use client"

import type React from "react"
import { useState } from "react"
import {
  ArrowLeft,
  Receipt,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderItem {
  productId: number
  productName: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

interface OrderDetails {
  id: number
  tableNumber: number
  customerId: number
  customerName: string
  status: string
  createdAt: string | null
  updatedAt: string
  items: OrderItem[]
  totalValue: number
  formattedTotalValue: string
}

const OrderDetails: React.FC<{ order: OrderDetails }> = ({ order }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF4D00]/5 to-[#FF0000]/5 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto border-[#FF4D00]/20">
        <CardHeader className="bg-gradient-to-r from-[#FF4D00] to-[#FF0000] text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#FFD700]"
              onClick={() => {
                window.history.back()
              }}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="text-2xl font-bold">
              Detalhes do Pedido
            </CardTitle>
            <div className="w-6" />
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-semibold text-gray-800">
                  Pedido #{order.id}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Fechada"
                    ? "bg-[#FFD700] text-gray-800"
                    : "bg-gradient-to-r from-[#FF4D00] to-[#FF0000] text-white"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#FF4D00]" />
                <span className="text-gray-600">{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#FF4D00]" />
                <span className="text-gray-600">
                  {order.updatedAt || "Data não disponível"}
                </span>
              </div>
            </div>

            <Separator className="bg-[#FF4D00]/20" />

            <div>
              <h3 className="font-semibold mb-2 text-gray-800">
                Itens do Pedido
              </h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="font-medium text-[#FF4D00]">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="bg-[#FF4D00]/20" />

            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg text-gray-800">Total</span>
              <span className="font-bold text-xl text-[#FF4D00]">
                {order.formattedTotalValue}
              </span>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-800">
                Método de Pagamento
              </label>
              <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className="w-full border-[#FF4D00]/20 hover:border-[#FF4D00] transition-colors">
                  <SelectValue placeholder="Selecione o método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-[#FF4D00]" />
                      Débito
                    </div>
                  </SelectItem>
                  <SelectItem value="credit">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-[#FF4D00]" />
                      Crédito
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4 text-[#FF4D00]" />À
                      Vista
                    </div>
                  </SelectItem>
                  <SelectItem value="pix">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4 text-[#FF4D00]" />
                      PIX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#FF4D00] to-[#FF0000] hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!paymentMethod}
            >
              <DollarSign className="mr-2 h-4 w-4" /> Finalizar Pagamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderDetails

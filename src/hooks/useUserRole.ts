import { useEffect, useState } from "react"
import { decodeJWT } from "../utils/decodeJWT"

export const useUserRole = (): string | null => {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const decodedToken = decodeJWT(token)
    setUserRole(decodedToken?.role || null)
  }, [])

  return userRole
}

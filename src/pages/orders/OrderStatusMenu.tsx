import type { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNextOrderStatuses } from "@/lib/order-utils"
import { ORDER_STATUS_META } from "@/mocks/orders.mock"
import type { OrderStatus } from "@/types/order"

interface OrderStatusMenuProps {
  status: OrderStatus
  onSelect: (status: OrderStatus) => void
  trigger: ReactNode
  align?: "start" | "end"
}

/** Menu chuyển trạng thái dùng chung cho list và detail; page tự xác nhận trước khi gọi callback. */
export function OrderStatusMenu({ status, onSelect, trigger, align = "end" }: OrderStatusMenuProps) {
  const options = getNextOrderStatuses(status)
  if (!options.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuLabel>Chuyển trạng thái</DropdownMenuLabel>
        {options.map((next) => (
          <DropdownMenuItem
            key={next}
            variant={next === "cancelled" ? "destructive" : "default"}
            onSelect={() => onSelect(next)}
          >
            {ORDER_STATUS_META[next].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

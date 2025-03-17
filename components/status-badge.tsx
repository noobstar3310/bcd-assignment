import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = "pending" | "delivering" | "completed"

interface StatusBadgeProps {
  status: StatusType | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-500"
      case "delivering":
        return "bg-blue-900/30 text-blue-500"
      case "completed":
        return "bg-green-900/30 text-green-500"
      default:
        return "bg-gray-800 text-gray-400"
    }
  }

  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status))}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}


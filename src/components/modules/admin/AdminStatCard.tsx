import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminStatCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
  trend?: "positive" | "negative"
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full bg-muted p-2 ${trend === "positive" ? "text-green-600" : ""}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
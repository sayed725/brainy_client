"use client"

import { Badge } from "../ui/badge"

const SectionHeader = ({title, description, badge, descriptionClassName}: {title: string, description?: string, badge?: string, descriptionClassName?: string}) => {
  return (
    <div>
      {badge && (
        <Badge className="mb-2 bg-[#1cb89e] text-white border-none py-1 px-3 font-bold text-xs tracking-wider">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-[#1cb89e] to-[#1cb89e]/70 bg-clip-text text-transparent hover:from-[#1cb89e]/90 hover:to-[#1cb89e]/60 transition-all">
        {title}
      </h2>
      {description && (
        <p className={`text-muted-foreground text-lg leading-relaxed max-w-2xl ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeader

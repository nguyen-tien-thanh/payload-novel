import Link from 'next/link'

interface Props {
  title: string
  href?: string
}

export function SectionHeader({ title, href }: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-base font-bold text-foreground">{title}</h2>
      {href && (
        <Link href={href} className="text-xs font-medium text-primary hover:underline">
          Xem tất cả →
        </Link>
      )}
    </div>
  )
}

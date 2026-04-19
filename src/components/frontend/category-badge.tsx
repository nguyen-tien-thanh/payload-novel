import Link from 'next/link'

interface CategoryBadgeProps {
  id: number
  name: string
  size?: 'sm' | 'md'
}

export function CategoryBadge({ id, name, size = 'md' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/?category=${id}`}
      className={
        size === 'sm'
          ? 'inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/15'
          : 'inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15'
      }
    >
      {name}
    </Link>
  )
}

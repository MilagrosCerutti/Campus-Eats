import { CardSkeleton } from '@/shared/components/Skeleton'
import MenuCard from './MenuCard'

export default function MenuGrid({ menus, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {menus.map((menu) => (
        <div key={menu.id}>
          <MenuCard menu={menu} />
        </div>
      ))}
    </div>
  )
}

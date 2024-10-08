'use client'

import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

export function TableSkeleton() {
  return (
    <div className="flex flex-col items-center space-x-4">
      <Skeleton className="w-full h-6 bg-gray-300 ml-4" />

      <Separator className="my-4" />

      {[...Array(8)].map((_, index) => (
        <Skeleton
          key={String(index)}
          className="w-full h-16 mb-2 bg-gray-300"
        />
      ))}
    </div>
  )
}

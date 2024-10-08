'use client'

import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function MenuSkeleton() {
  return (
    <>
      <div className="w-full relative">
        <Skeleton className="w-full h-60 bg-gray-300" />

        <Skeleton className="bg-gray-400 shadow-2xl h-44 w-44 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="flex flex-col p-6">
        <Skeleton className="h-8 w-48 bg-gray-300" />

        <div className="grid grid-cols-2 gap-4 mt-4 max-[800px]:grid-cols-1">
          {[...Array(6)].map((_, index) => (
            <Card key={String(index)} className="flex p-4">
              <Skeleton className="w-24 h-24 aspect-square rounded-md bg-gray-400" />

              <CardContent className="p-0 ml-2 w-full">
                <Skeleton className="h-4 w-40 bg-gray-300" />
                <Skeleton className="bg-gray-300 min-h-[60px] mt-2 w-full" />

                <div className="flex mt-2 justify-end">
                  <Skeleton className="bg-gray-300 h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'

import type { Product } from '@/app/dashboard/page'
import { useSocket } from '@/hooks/use-socket'

import { Card, CardContent } from '@/components/ui/card'
import { MenuSkeleton } from '@/components/skeletons/menu'

interface ParamsProps {
  menuToken: string
}

interface Menu {
  bannerURL: string
  logoURL: string
}

export default function Menu() {
  const [menu, setMenu] = useState<Menu>({} as Menu)
  const [products, setProducts] = useState<Array<Product>>([])

  const [isLoading, setIsLoading] = useState(true)

  const socket = useSocket()
  const { menuToken } = useParams() as unknown as ParamsProps

  useEffect(() => {
    if (socket) {
      socket.emit('send_me_menu', { menuToken })
      socket.on('menu', data => {
        setMenu(data.menu)
        setProducts(data.products)
        setIsLoading(false)
      })
    }
  }, [menuToken, socket])

  return (
    <div className="flex flex-col w-full min-h-screen">
      {isLoading ? (
        <MenuSkeleton />
      ) : (
        <>
          <div className="w-full relative">
            <Image
              alt="banner"
              src={menu.bannerURL}
              className="w-full h-60 object-cover"
              height={240}
              width={240}
              priority
            />

            <Image
              src={menu.logoURL}
              alt="logo"
              className="shadow-2xl h-44 w-44 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              priority
              width={176}
              height={176}
            />
          </div>

          <div className="flex flex-col p-6">
            <h1 className="text-xl font-bold">Produtos</h1>

            <div className="grid grid-cols-2 gap-4 mt-4 max-[800px]:grid-cols-1">
              {products.map(product => (
                <Card key={product.id} className="flex p-4">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 aspect-square rounded-md object-cover"
                  />

                  <CardContent className="p-0 ml-2 -mt-1">
                    <h2 className="font-bold">{product.name}</h2>

                    <p className="text-sm text-gray-600 min-h-[60px]">
                      {product.description}
                    </p>

                    <div className="flex mt-4 justify-end">
                      <span className="font-medium">{product.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

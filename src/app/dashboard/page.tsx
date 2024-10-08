'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

import { useSocket } from '@/hooks/use-socket'
import { toast } from '@/hooks/use-toast'
import { TableSkeleton } from '@/components/skeletons/table'

export interface Product {
  id: number
  name: string
  price: number
  status: string
  image_url: string
  description: string
}

export default function Dashboard() {
  const [products, setProducts] = useState<Array<Product>>([])
  const [isLoading, setIsLoading] = useState(false)

  const socket = useSocket()

  const fetchProducts = useCallback(() => {
    setIsLoading(true)

    const token = localStorage.getItem('@clippcardapiodigital:token')

    try {
      if (token && socket) {
        socket.emit('send_me_products', { token })
        socket.on('products', data => {
          setProducts(data.products)
          localStorage.setItem(
            '@clippcardapiodigital:products',
            JSON.stringify(data.products)
          )
        })

        return setTimeout(
          () =>
            toast({
              title: 'Produtos atualizados',
              description: 'Produtos atualizados com sucesso',
              duration: 3000,
            }),
          500
        )
      }
    } catch (error) {
      console.log(error)

      return toast({
        title: 'Algo deu errado',
        description:
          'Verifique se o servidor está executando e tente novamente',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [socket])

  useEffect(() => {
    setIsLoading(true)
    const products = localStorage.getItem('@clippcardapiodigital:products')

    if (products) {
      setTimeout(() => {
        setProducts(JSON.parse(products))
        setIsLoading(false)
      }, 500)
      return
    }

    fetchProducts()
  }, [fetchProducts])

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Produtos</CardTitle>
          <CardDescription>
            Visualize os produtos que aparecerão no cardápio digital
          </CardDescription>
        </div>

        <Button variant="outline" onClick={fetchProducts}>
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isLoading && 'animate-spin'}`}
          />
          <span>Atualizar</span>
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center mt-4">
            <p className="text-center text-gray-500 text-sm">
              Nenhum produto encontrado. Atualize para sincronizar.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      width="64"
                      src={product.image_url}
                    />
                  </TableCell>

                  <TableCell className="font-medium">{product.name}</TableCell>

                  <TableCell>
                    <Badge variant="outline">Ativo</Badge>
                  </TableCell>

                  <TableCell>{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

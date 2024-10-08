'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCcw } from 'lucide-react'
import Image from 'next/image'

import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/use-toast'
import { useSocket } from '@/hooks/use-socket'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  token: z.string().nonempty('Token é obrigatório'),
})

type FormData = z.infer<typeof schema>

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const socket = useSocket()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = ({ token }: FormData) => {
    setIsLoading(true)

    try {
      if (!socket) {
        throw new Error('Socket não está disponível')
      }

      socket.emit('connect_clippcheff', { token })
      socket.on('connect_clippcheff_response', data => {
        if (data.connected) {
          localStorage.setItem('@clippcardapiodigital:token', token)
          localStorage.setItem('@clippcardapiodigital:apiKey', data.apiKey)

          return router.push('/dashboard')
        }

        return toast({
          title: 'Token inválido',
          description: 'Verifique os dados e tente novamente',
          variant: 'destructive',
          duration: 3000,
        })
      })
    } catch (error) {
      return toast({
        title: 'Erro ao verificar token',
        description: 'Verifique os dados e tente novamente',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('@clippcardapiodigital:token')

    if (token && socket) {
      socket.emit('connect_clippcheff', { token })
      socket.on('connect_clippcheff_response', data => {
        if (data.connected) {
          localStorage.setItem('@clippcardapiodigital:apiKey', data.apiKey)
          router.push('/dashboard')
        }
      })
    }
  }, [socket, router])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-yellow_zucchetti" />
      <div className="flex-1 bg-white" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Image
              alt="ClippCheff Logo"
              className="-mt-32"
              src="/logo-white.png"
              width={277}
              height={200}
              priority
            />
          </div>
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-zinc-600">
                Cardápio Digital
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  placeholder="Token"
                  className="placeholder:text-zinc-400 focus-visible:ring-yellow-500"
                  {...register('token')}
                  error={errors.token?.message}
                />

                <Button
                  className="w-full mt-6 uppercase font-bold bg-yellow_zucchetti hover:bg-yellow_zucchetti_hover text-white transition-colors duration-300"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

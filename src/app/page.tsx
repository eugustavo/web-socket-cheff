'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

import { api } from '@/services/api'
import { AxiosError } from 'axios'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

interface LoginResponse {
  token: string
}

export default function Home() {
  const [inviteUser, setInviteUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [serial, setSerial] = useState('')
  const [email, setEmail] = useState('')

  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }: FormData) => {
    setIsLoading(true)

    try {
      const { data } = await api.post<LoginResponse>('/sessions', {
        email,
        password,
      })

      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast({
          title: error.response?.data.message,
          description: 'Verifique os dados e tente novamente',
        })
      }

      return toast({
        title: 'Erro ao realizar login',
        description: 'Verifique os dados e tente novamente',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const inviteUserTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await api.post('/users/invite', {
        email,
        serial,
      })

      if (data.url) {
        return toast({
          title: 'Usuário convidado com sucesso',
          description: 'Clique no link para completar o cadastro',
          action: (
            <Button
              className="bg-[#e9a84d] hover:bg-[#d99b3e] text-white"
              onClick={() => window.open(data.url)}
            >
              Abrir link
            </Button>
          ),
        })
      }
    } catch (error) {
      return toast({
        title: 'Erro ao enviar convite',
        description: 'Verifique os dados e tente novamente',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-[#e9a84d]" />
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
              {inviteUser ? (
                <form onSubmit={inviteUserTest}>
                  <div className="space-y-4">
                    <Input
                      placeholder="E-mail"
                      className="placeholder:text-zinc-400 focus-visible:ring-yellow-500"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />

                    <Input
                      placeholder="Serial"
                      className="placeholder:text-zinc-400 focus-visible:ring-yellow-500"
                      value={serial}
                      onChange={e => setSerial(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full mt-6 uppercase font-bold bg-[#e9a84d] hover:bg-[#d99b3e] text-white transition-colors duration-300"
                      type="submit"
                      disabled={isLoading}
                    >
                      Enviar
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full mt-6 uppercase font-bold border-[#e9a84d] text-[#d99b3e] transition-colors duration-300 hover:bg-[#e9a84d] hover:text-white"
                      onClick={() => setInviteUser(false)}
                    >
                      Voltar para login
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <Input
                      placeholder="E-mail"
                      className="placeholder:text-zinc-400 focus-visible:ring-yellow-500"
                      {...register('email')}
                      error={errors.email?.message}
                    />

                    <Input
                      placeholder="Senha"
                      type="password"
                      className="placeholder:text-zinc-400 "
                      {...register('password')}
                      error={errors.password?.message}
                    />
                  </div>

                  <Link
                    className="mt-2 text-sm text-gray-600 hover:underline block text-right"
                    href="#"
                  >
                    Esqueceu a senha?
                  </Link>

                  <div className="space-y-2">
                    <Button
                      className="w-full mt-6 uppercase font-bold bg-[#e9a84d] hover:bg-[#d99b3e] text-white transition-colors duration-300"
                      type="submit"
                    >
                      Entrar
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full mt-6 uppercase font-bold border-[#e9a84d] text-[#d99b3e] transition-colors duration-300 hover:bg-[#e9a84d] hover:text-white"
                      onClick={() => setInviteUser(true)}
                    >
                      Teste invite
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

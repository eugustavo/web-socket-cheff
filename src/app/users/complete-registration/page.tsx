'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { api } from '@/services/api'
import { AxiosError } from 'axios'

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/\d/, 'A senha deve conter pelo menos um número')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'A senha deve conter pelo menos um caractere especial'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function CompleteRegistration() {
  const [email, setEmail] = useState('')
  const [serial, setSerial] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const params = useSearchParams()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async ({ password }: FormData) => {
    setIsLoading(true)

    try {
      const { data } = await api.post('/users', {
        email,
        password,
        serial,
      })

      if (data.id) {
        toast({
          title: 'Usuário criado com sucesso!',
          description: 'Realize o login e faça seu cardapio digital',
        })

        router.push('/')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast({
          title: error.response?.data.message,
          description: 'Verifique os dados e tente novamente',
        })
      }

      return toast({
        title: 'Erro ao cadastrar usuário',
        description: 'Tente novamente mais tarde.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function loadParams() {
      const email = params.get('email')
      const serial = params.get('serial')

      if (email && serial) {
        setEmail(email)
        setSerial(serial)
      }
    }

    loadParams()
  }, [params])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-[#e9a84d]" />
      <div className="flex-1 bg-white" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <img
              alt="ClippCheff Logo"
              className="-mt-32"
              src="/logo-white.png"
            />
          </div>
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center text-zinc-600">
                Conclua seu cadastro
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input disabled readOnly value={email} />

                <Input disabled readOnly value={serial} />

                <Input
                  placeholder="Senha"
                  type="password"
                  className="placeholder:text-zinc-400"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <Input
                  placeholder="Confirmar senha"
                  type="password"
                  className="placeholder:text-zinc-400"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />

                <Button
                  className="w-full font-bold uppercase bg-[#e9a84d] hover:bg-[#d99b3e] text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  Registrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

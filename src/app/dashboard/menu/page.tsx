'use client'
import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import Image from 'next/image'
import { AxiosError } from 'axios'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { generateQRCode } from '@/lib/qrcode'
import { useToast } from '@/hooks/use-toast'

import { api } from '@/services/api'
import { useMenu } from '@/hooks/use-menu'
import { useSocket } from '@/hooks/use-socket'
import { RefreshCcw, SquareArrowOutUpRight } from 'lucide-react'

interface GenerateMenuRequest {
  bannerURL: string
  logoURL: string
  token: string
}
interface GenerateMenuResponse {
  menuToken: string
}

const schema = z.object({
  bannerURL: z
    .any()
    .refine(files => files instanceof FileList && files.length > 0, {
      message: 'O banner deve ser um arquivo',
    })
    .transform(files => files[0]),
  logoURL: z
    .any()
    .refine(files => files instanceof FileList && files.length > 0, {
      message: 'O logo deve ser um arquivo',
    })
    .transform(files => files[0]),
})

type FormData = z.infer<typeof schema>

export default function Menu() {
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const socket = useSocket()
  const { menuLink, qrCode, setMenuLink, setQRCode } = useMenu()
  const qrRef = useRef<HTMLImageElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function transformToBase64(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  async function handleGenerateMenu(data: FormData) {
    setIsLoading(true)
    const token = localStorage.getItem('@clippcardapiodigital:token')

    const dataToSend: GenerateMenuRequest = {
      bannerURL: await transformToBase64(data.bannerURL),
      logoURL: await transformToBase64(data.logoURL),
      token: token as string,
    }

    try {
      const { data } = await api.post<GenerateMenuResponse>(
        '/generate-menu',
        dataToSend
      )

      const url = `${window.location.origin}/menu/${data.menuToken}`
      const qrcode = await generateQRCode(url)

      setMenuLink(url)
      setQRCode(qrcode as string)

      return toast({
        title:
          menuLink && qrCode
            ? 'Cardapio atualizado com sucesso'
            : 'Cardapio gerado com sucesso',
        description:
          menuLink && qrCode
            ? 'O cardápio foi atualizado com sucesso!'
            : 'O cardápio foi gerado com sucesso!',
        duration: 3000,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data)
        return toast({
          title: 'Erro ao gerar cardápio',
          description: error.response?.data.message,
          variant: 'destructive',
          duration: 3000,
        })
      }

      return toast({
        title: 'Erro ao gerar cardápio',
        description: 'Verifique os dados e tente novamente',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(menuLink)

    return toast({
      title: 'Link copiado',
      description:
        'O link do cardápio foi copiado para a área de transferência',
      duration: 3000,
    })
  }

  async function handleDownloadQRCode() {
    if (!qrRef.current) return

    try {
      const dataUrl = await toPng(qrRef.current, {
        width: 300,
        height: 300,
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'qrcode.png'
      link.click()
    } catch (error) {
      console.error(error)
      return toast({
        title: 'Erro ao baixar QRCode',
        description: 'Algo inesperado aconteceu. Tente novamente',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    async function verifyExistMenu() {
      const token = localStorage.getItem('@clippcardapiodigital:token')

      if (socket) {
        socket.emit('verify_exist_menu', { token })
        socket.on('menu_exist', data => {
          if (data.existMenu) {
            const url = `${window.location.origin}/menu/${data.menuToken}`

            generateQRCode(url).then(qrcode => {
              setQRCode(qrcode as string)
            })
            setMenuLink(url)
          }
        })
      }
    }

    verifyExistMenu()
  }, [socket, setMenuLink, setQRCode])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cardápio Digital</CardTitle>

          <CardDescription>
            Informe os dados sobre o restaurante que aparecerão no cardápio
            digital
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleGenerateMenu)}>
            <div className="flex items-center space-x-8 max-[800px]:flex-col max-[800px]:space-x-0 max-[800px]:items-start max-[800px]:space-y-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="banner">Banner</Label>
                <Input
                  id="banner"
                  type="file"
                  className="p-2"
                  {...register('bannerURL')}
                  error={errors.bannerURL?.message}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  className="p-2"
                  {...register('logoURL')}
                  error={errors.logoURL?.message}
                />
              </div>
            </div>

            <Button type="submit" className="mt-6">
              {isLoading ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  <span>
                    {menuLink && qrCode ? 'Atualizando...' : 'Gerando...'}
                  </span>
                </>
              ) : menuLink && qrCode ? (
                'Atualizar cardápio'
              ) : (
                'Gerar cardápio'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {menuLink && qrCode && (
        <Card>
          <CardHeader>
            <CardTitle>QRCode e Link</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="link">Link</Label>
              <div className="flex items-center">
                <Input className="p-2 max-w-md" value={menuLink} readOnly />

                <a
                  className="ml-4 bg-yellow-400 p-3 rounded-md"
                  href={menuLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="QRCode">QRCode</Label>
              <Image
                ref={qrRef}
                alt="QRCode"
                src={qrCode}
                width={200}
                height={200}
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <Button className="mt-4" onClick={handleCopyLink}>
                Copiar link
              </Button>

              <Button className="mt-4" onClick={handleDownloadQRCode}>
                Baixar QRCode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

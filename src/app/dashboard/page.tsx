'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircleMore, NotepadText, QrCode } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  function handleRedirect(route: string) {
    switch (route) {
      case 'menu':
        router.push('/cardapio')
        break
      case 'table':
        router.push('/mesa')
        break
      case 'whatsapp':
        router.push('/whatsapp')
        break
      default:
        break
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

            <CardContent className="flex flex-col items-center">
              <div className="space-y-4">
                <Button className="w-full mt-6 uppercase rounded-full font-bold bg-[#e9a84d] hover:bg-[#d99b3e] text-white transition-colors duration-300">
                  <NotepadText size={18} />
                  <div className="w-full">Ver cardápio</div>
                </Button>

                <Button className="w-full mt-6 uppercase rounded-full font-bold bg-[#e9a84d] hover:bg-[#d99b3e] text-white transition-colors duration-300">
                  <QrCode size={18} />
                  <div className="w-full">Pedir na mesa</div>
                </Button>

                <Button className="w-full mt-6 uppercase rounded-full font-bold bg-[#e9a84d] hover:bg-[#d99b3e] text-white transition-colors duration-300">
                  <MessageCircleMore size={18} />
                  <div className="w-full">WhatsApp</div>
                </Button>
              </div>

              <Image
                alt="Zucchetti Logo"
                className="mt-12"
                src="/zucchetti-logo.png"
                width={160}
                height={36}
                priority
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

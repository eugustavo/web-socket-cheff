'use client'
import { useRouter } from 'next/navigation'

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

export default function Settings() {
  const token = localStorage.getItem('@clippcardapiodigital:token')

  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('@clippcardapiodigital:token')
    localStorage.removeItem('@clippcardapiodigital:apiKey')
    localStorage.removeItem('@clippcardapiodigital:products')

    router.push('/')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>

        <CardDescription>
          Token utilizado para comunição do Cardápio Digital com ClippCheff
          Desktop
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="banner">Token</Label>
          <Input id="banner" value={token || ''} readOnly />
        </div>

        <Button variant="destructive" className="mt-4" onClick={handleLogout}>
          Sair
        </Button>
      </CardContent>
    </Card>
  )
}

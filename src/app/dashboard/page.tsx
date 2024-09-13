'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem('token')
    router.replace('/')
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center">
      <h1>Você está logado!</h1>
      <Button onClick={() => handleLogout()}>Clique para deslogar</Button>
    </div>
  )
}

'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

interface MenuContextProps {
  menuLink: string
  qrCode: string
  setQRCode: (qrCode: string) => void
  setMenuLink: (link: string) => void
}

interface MenuContextProviderProps {
  children: ReactNode
}

export const MenuContext = createContext<MenuContextProps>(
  {} as MenuContextProps
)

export const MenuContextProvider = ({ children }: MenuContextProviderProps) => {
  const [menuLink, setMenuLink] = useState('')
  const [qrCode, setQRCode] = useState('')

  return (
    <MenuContext.Provider value={{ menuLink, setMenuLink, qrCode, setQRCode }}>
      {children}
    </MenuContext.Provider>
  )
}

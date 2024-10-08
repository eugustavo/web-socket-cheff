import { useContext } from 'react'
import { MenuContext } from '@/context/MenuContext'

export const useMenu = () => {
  const context = useContext(MenuContext)

  return context
}

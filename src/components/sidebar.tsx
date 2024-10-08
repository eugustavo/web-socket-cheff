'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, NotepadText, Package2, Paperclip, Settings } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Button } from './ui/button'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const path = usePathname()

  return (
    <>
      <aside
        className={cn(
          'flex fixed inset-y-0 left-0 z-10 w-14 flex-col border-r bg-background transform transition-transform duration-300',
          isSidebarVisible
            ? 'translate-x-0 shadow-lg'
            : 'max-[480px]:-translate-x-full'
        )}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <div className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            <Paperclip className="h-4 w-4 transition-all group-hover:scale-110" />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  data-active={path === '/dashboard'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground data-[active='true']:bg-yellow-500 data-[active='true']:text-muted"
                  onClick={() => setIsSidebarVisible(false)}
                >
                  <Package2 className="h-5 w-5" />
                  <span className="sr-only">Produtos</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Produtos</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/menu"
                  data-active={path === '/dashboard/menu'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground data-[active='true']:bg-yellow-500 data-[active='true']:text-muted"
                  onClick={() => setIsSidebarVisible(false)}
                >
                  <NotepadText className="h-5 w-5" />
                  <span className="sr-only">Cardápio</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Cardápio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  data-active={path === '/dashboard/settings'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground data-[active='true']:bg-yellow-500 data-[active='true']:text-muted"
                  onClick={() => setIsSidebarVisible(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Configurações</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <aside className="px-7 pt-4 hidden max-[480px]:flex max-[480px]:justify-end">
        <Button
          className="cursor-pointer p-2"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <Menu />
        </Button>
      </aside>
    </>
  )
}

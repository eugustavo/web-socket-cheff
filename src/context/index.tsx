import { MenuContextProvider } from './MenuContext'

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MenuContextProvider>{children}</MenuContextProvider>
}

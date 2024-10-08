import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    if (type === 'password') {
      return (
        <>
          <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 focus-within:ring-1 focus-within:ring-yellow-500">
            <input
              type={showPassword ? 'text' : 'password'}
              className={cn(
                'flex-grow text-sm transition-colors placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                className
              )}
              {...props}
              ref={ref}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-transparent -mr-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </>
      )
    }

    return (
      <>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        {error && <span className="text-red-500 text-xs">{error}</span>}
      </>
    )
  }
)
Input.displayName = 'Input'

export { Input }

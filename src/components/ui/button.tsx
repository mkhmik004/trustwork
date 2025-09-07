'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100 text-gray-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700'
    }
    
    const sizes = {
      default: 'h-10 py-2 px-4',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-8'
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
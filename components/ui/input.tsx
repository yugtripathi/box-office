import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-11 w-full rounded-xl border border-border/50 bg-secondary/50 px-4 py-2 text-sm text-foreground transition-all duration-200',
                    'placeholder:text-muted-foreground',
                    'hover:border-border hover:bg-secondary/70',
                    'focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };

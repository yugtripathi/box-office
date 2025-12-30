import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98]',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/90',
                outline:
                    'border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost:
                    'hover:bg-accent hover:text-accent-foreground',
                link:
                    'text-primary underline-offset-4 hover:underline',
                gold:
                    'bg-gold text-black font-semibold shadow-lg shadow-gold/25 hover:bg-gold/90',
                success:
                    'bg-success text-white shadow-lg shadow-success/25 hover:bg-success/90',
            },
            size: {
                default: 'h-10 px-5 py-2 rounded-xl',
                sm: 'h-9 px-4 rounded-lg text-xs',
                lg: 'h-12 px-8 rounded-xl text-base',
                xl: 'h-14 px-10 rounded-2xl text-lg',
                icon: 'h-10 w-10 rounded-xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

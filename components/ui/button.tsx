import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:bg-destructive/90',
                outline:
                    'border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost:
                    'hover:bg-accent/10 hover:text-accent-foreground',
                link:
                    'text-primary underline-offset-4 hover:underline',
                gold:
                    'bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40',
                success:
                    'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
                cyan:
                    'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
            },
            size: {
                default: 'h-10 px-5 py-2 rounded-xl text-sm',
                sm: 'h-9 px-4 rounded-lg text-xs',
                lg: 'h-12 px-8 rounded-2xl text-base',
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

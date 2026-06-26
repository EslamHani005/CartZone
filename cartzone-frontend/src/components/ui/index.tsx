import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

// Button
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Button({
  children, variant = 'primary', className, loading, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; loading?: boolean }) {
  const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-graphite text-porcelain hover:bg-graphite/80 dark:bg-porcelain dark:text-graphite dark:hover:bg-sand',
    secondary: 'border border-current text-graphite dark:text-porcelain hover:bg-sand/40 dark:hover:bg-graphite/40',
    ghost: 'text-graphite dark:text-porcelain hover:bg-sand/40 dark:hover:bg-white/5',
    danger: 'bg-ruby text-white hover:bg-ruby/80',
  };
  return (
    <button className={cn(base, variants[variant], className)} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// Input
export function Input({ className, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[var(--muted)]">{label}</label>}
      <input
        className={cn(
          'px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] text-sm outline-none',
          'focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all',
          error && 'border-ruby focus:ring-ruby/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-ruby">{error}</p>}
    </div>
  );
}

// Card
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-[var(--card)] border border-[var(--border)] rounded-xl', className)} {...props}>
      {children}
    </div>
  );
}

// Badge
export function Badge({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'gold' | 'emerald' | 'ruby' | 'amber' }) {
  const colors = {
    default: 'bg-sand text-graphite dark:bg-graphite/60 dark:text-sand',
    gold: 'bg-gold/20 text-gold',
    emerald: 'bg-emerald/20 text-emerald',
    ruby: 'bg-ruby/20 text-ruby',
    amber: 'bg-amber/20 text-amber',
  };
  return <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', colors[color])}>{children}</span>;
}

// Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return <Loader2 className={cn('animate-spin text-gold', sizes[size])} />;
}

// Skeleton
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-sand dark:bg-graphite/60 rounded-lg', className)} />;
}

// PageLoader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Spinner size="lg" />
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {icon && <div className="text-[var(--muted)] opacity-40 text-6xl">{icon}</div>}
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {description && <p className="text-[var(--muted)] text-sm max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

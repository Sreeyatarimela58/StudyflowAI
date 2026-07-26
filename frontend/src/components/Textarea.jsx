import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const Textarea = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-[var(--radius-button)] bg-[#F4F4F2] px-4 py-4 text-base text-[var(--color-charcoal)] placeholder:text-[var(--color-gray)] border border-transparent transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-[var(--color-lime)] disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };

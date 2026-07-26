import { AlertTriangle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export function ErrorState({ 
  icon: Icon = AlertTriangle, 
  title = 'Something went wrong', 
  description = 'An unexpected error occurred. Please try again.',
  action,
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center min-h-[400px]">
      <Card className="flex flex-col items-center justify-center p-16 max-w-md w-full border-[var(--color-error)]/20">
        <div className="bg-[var(--color-error-bg)] p-4 rounded-full mb-6">
          <Icon className="h-10 w-10 text-[var(--color-error)]" />
        </div>
        <h3 className="text-2xl font-display font-semibold mb-3">{title}</h3>
        <p className="text-[var(--color-gray)] mb-8 text-lg">{description}</p>
        
        {action ? (
          <div>{action}</div>
        ) : onRetry ? (
          <Button onClick={onRetry} variant="secondary">
            Try Again
          </Button>
        ) : null}
      </Card>
    </div>
  );
}

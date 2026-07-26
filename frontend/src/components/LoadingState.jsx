import { Loader2 } from 'lucide-react';
import { Card } from './Card';

export function LoadingState({ title = 'Loading...', description = 'Please wait a moment.' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center">
      <Card className="flex flex-col items-center justify-center p-12 max-w-md w-full border-dashed border-2 bg-transparent shadow-none">
        <Loader2 className="h-12 w-12 text-[var(--color-lime)] animate-spin mb-6" />
        <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
        <p className="text-[var(--color-gray)]">{description}</p>
      </Card>
    </div>
  );
}

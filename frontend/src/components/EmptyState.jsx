import { SearchX } from 'lucide-react';
import { Card } from './Card';

export function EmptyState({ 
  icon: Icon = SearchX, 
  title = 'No data found', 
  description = 'There is nothing to display here.',
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center min-h-[400px]">
      <Card className="flex flex-col items-center justify-center p-16 max-w-md w-full">
        <div className="bg-[#F4F4F2] p-4 rounded-full mb-6">
          <Icon className="h-10 w-10 text-[var(--color-gray)]" />
        </div>
        <h3 className="text-2xl font-display font-semibold mb-3">{title}</h3>
        <p className="text-[var(--color-gray)] mb-8 text-lg">{description}</p>
        {action && <div>{action}</div>}
      </Card>
    </div>
  );
}

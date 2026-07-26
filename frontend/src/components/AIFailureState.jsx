import { Bot, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export function AIFailureState({ onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center min-h-[600px]">
      <Card className="flex flex-col items-center justify-center p-16 max-w-lg w-full">
        <div className="bg-[var(--color-lime)]/20 p-6 rounded-full mb-8 relative">
          <Bot className="h-12 w-12 text-[var(--color-charcoal)]" />
          <div className="absolute -bottom-2 -right-2 bg-[var(--color-error)] rounded-full p-1.5">
            <RefreshCcw className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-display font-bold mb-4">Generation Failed</h2>
        
        <p className="text-[var(--color-gray)] mb-10 text-lg leading-relaxed max-w-sm mx-auto">
          The AI model took too long to respond or returned an invalid format. This occasionally happens with complex topics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            onClick={() => navigate('/dashboard/new')} 
            variant="secondary"
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>
          
          <Button 
            onClick={onRetry}
            className="flex-1 sm:flex-none"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );
}

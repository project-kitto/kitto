import { cn } from '@/lib/utils';

interface ModelCardProps {
  model: {
    value: string;
    label: string;
    provider: string;
    description?: string;
    context?: number;
    disabled?: boolean;
  };
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border p-6 transition-all hover:shadow-md',
        model.disabled && 'opacity-60 hover:opacity-60'
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{model.label}</h3>
          <span className="text-sm text-muted-foreground">
            {model.provider}
          </span>
        </div>

        {model.description && (
          <p className="text-sm text-muted-foreground">{model.description}</p>
        )}

        {model.context && (
          <div className="mt-4 text-xs text-muted-foreground">
            Context window: {model.context.toLocaleString()} tokens
          </div>
        )}
      </div>

      {model.disabled && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <p className="text-sm font-medium">Coming soon</p>
        </div>
      )}
    </div>
  );
}

import { ModelCard } from '@/components/model-card';
import { models } from '@tuturuuu/ai/models';

export default function AIModelsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Models</h1>
        <p className="text-muted-foreground">
          Explore our collection of AI models powered by different providers.
        </p>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard key={`${model.provider}-${model.value}`} model={model} />
        ))}
      </div>
    </div>
  );
}

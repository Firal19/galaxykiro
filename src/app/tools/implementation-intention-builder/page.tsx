import ImplementationIntentionBuilder from '@/components/tools/mind/implementation-intention-builder';

export default function ImplementationIntentionBuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Implementation Intention Builder</h1>
        <p className="text-gray-600 mb-6 text-center">Turn your knowledge into automatic action with a simple If-Then plan.</p>
        <ImplementationIntentionBuilder />
      </div>
    </main>
  );
} 
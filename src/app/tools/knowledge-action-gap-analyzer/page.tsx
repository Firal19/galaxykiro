import KnowledgeActionGapAnalyzer from '@/components/tools/mind/knowledge-action-gap-analyzer';

export default function KnowledgeActionGapAnalyzerPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Knowledge-Action Gap Analyzer</h1>
        <p className="text-gray-600 mb-6 text-center">Identify what stops you from taking action and get a personalized tip to move forward.</p>
        <KnowledgeActionGapAnalyzer />
      </div>
    </main>
  );
} 
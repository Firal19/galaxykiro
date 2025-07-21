import { useState } from 'react';

export default function ImplementationIntentionBuilder() {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [action, setAction] = useState('');

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleRestart = () => {
    setStep(0);
    setSituation('');
    setAction('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">Implementation Intention Builder</h2>
      <p className="text-gray-600 mb-6 text-center">Turn your knowledge into automatic action with a simple If-Then plan.</p>
      {step === 0 && (
        <div>
          <label className="block mb-2 font-medium">Describe a situation where you want to take action:</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={situation}
            onChange={e => setSituation(e.target.value)}
            placeholder="e.g. When I get home from work, when I feel stressed, etc."
          />
          <button className="btn btn-primary w-full" disabled={!situation} onClick={handleNext}>Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <label className="block mb-2 font-medium">What action will you take in that situation?</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={action}
            onChange={e => setAction(e.target.value)}
            placeholder="e.g. Go for a walk, take 3 deep breaths, etc."
          />
          <div className="flex justify-between">
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn btn-primary" disabled={!action} onClick={handleNext}>See My Plan</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Your Implementation Intention:</h3>
          <p className="mb-4">If <span className="font-bold">{situation}</span>, then I will <span className="font-bold">{action}</span>.</p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <p className="font-medium">Tip: The more specific your plan, the more likely you are to follow through. Try visualizing yourself taking action in that situation!</p>
          </div>
          <button className="btn btn-secondary" onClick={handleRestart}>Start Over</button>
        </div>
      )}
    </div>
  );
} 
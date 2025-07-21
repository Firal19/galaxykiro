import { useState } from 'react';

export default function KnowledgeActionGapAnalyzer() {
  const [step, setStep] = useState(0);
  const [knowledge, setKnowledge] = useState('');
  const [barrier, setBarrier] = useState('');
  const [feeling, setFeeling] = useState('');

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleRestart = () => {
    setStep(0);
    setKnowledge('');
    setBarrier('');
    setFeeling('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">Knowledge-Action Gap Analyzer</h2>
      <p className="text-gray-600 mb-6 text-center">Identify what stops you from taking action on what you know.</p>
      {step === 0 && (
        <div>
          <label className="block mb-2 font-medium">What is something you know you should do, but haven't?</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={knowledge}
            onChange={e => setKnowledge(e.target.value)}
            placeholder="e.g. Exercise regularly, start a project, etc."
          />
          <button className="btn btn-primary w-full" disabled={!knowledge} onClick={handleNext}>Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <label className="block mb-2 font-medium">What usually gets in the way?</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={barrier}
            onChange={e => setBarrier(e.target.value)}
            placeholder="e.g. Procrastination, fear, lack of time, etc."
          />
          <div className="flex justify-between">
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn btn-primary" disabled={!barrier} onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <label className="block mb-2 font-medium">How do you feel when you don't take action?</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={feeling}
            onChange={e => setFeeling(e.target.value)}
            placeholder="e.g. Frustrated, guilty, anxious, etc."
          />
          <div className="flex justify-between">
            <button className="btn btn-secondary" onClick={handleBack}>Back</button>
            <button className="btn btn-primary" disabled={!feeling} onClick={handleNext}>See Result</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Your Main Barrier:</h3>
          <p className="mb-4">You want to <span className="font-bold">{knowledge}</span>, but <span className="font-bold">{barrier}</span> gets in the way. This often leaves you feeling <span className="font-bold">{feeling}</span>.</p>
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="font-medium">Tip: Awareness is the first step! Try breaking your goal into smaller steps, or use the Implementation Intention Builder below to create an action plan.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleRestart}>Start Over</button>
        </div>
      )}
    </div>
  );
} 
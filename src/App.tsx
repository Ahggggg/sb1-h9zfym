import React from 'react';
import { Sparkles } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { PromptInput } from './components/PromptInput';
import { OptimizationStatus } from './components/OptimizationStatus';
import { PromptHistory } from './components/PromptHistory';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-blue-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prompt Optimization Tool
          </h1>
          <p className="text-gray-600">
            Enter your prompt below and let AI optimize it for better results
          </p>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
            <ApiKeyInput />
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Prompt</h2>
            <PromptInput />
            <OptimizationStatus />
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <PromptHistory />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
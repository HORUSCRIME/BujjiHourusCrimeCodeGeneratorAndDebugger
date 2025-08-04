import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const generateCode = async () => {
    setIsLoading(true);
    setResponse('');
    setError(null);
    setCopySuccess('');

    if (!prompt.trim()) {
      setError("Please enter a prompt to generate or debug code.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Unknown error');
      setResponse(result.response || "No response from Gemini.");
    } catch (err) {
      console.error("Gemini API error:", err);
      setError(`Failed to fetch response: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
      .then(() => setCopySuccess('Copied!'))
      .catch(() => setCopySuccess('Failed to copy.'));
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-blue-400 text-center mb-8">
          HorusCrime Code Assistant
        </h1>

        <label htmlFor="prompt-input" className="block text-lg font-medium text-gray-300 mb-2">
          Enter your prompt:
        </label>
        <br />
        <br />
        <input type='text'
          id="prompt-input"
          className="w-full p-4 text-sm bg-gray-900 border border-blue-500 rounded-lg text-white font-mono placeholder-gray-400 mb-4"
          placeholder="e.g. Debug this code: function sum(a,b){return a+b}; console.log(sum(1))"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          style={{height:"10rem",width:"50rem",textAlign:"center"}}
        />
        <br />
        <br />
        <button
          onClick={generateCode}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate / Debug Code'}
        </button>

        {error && (
          <div className="mt-6 bg-red-700 border border-red-500 p-4 rounded-lg text-white">
            <strong>Error:</strong> {error}
          </div>
        )}
        <br />
        <hr />
        {response && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-blue-300">HorusCrime Response</h2>
              <button onClick={copyToClipboard} className="text-blue-400 hover:text-blue-200 text-sm">
                📋 {copySuccess || 'Copy Code'}
              </button>
              <br /><br />
            </div>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ margin: 0, padding: 16, fontSize: '0.9rem' }}>
                {response}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

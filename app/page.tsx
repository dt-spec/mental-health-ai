'use client';

import { useState } from 'react';
import { Conversation } from '../components/conversation';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Joe</h1>
        <p className="text-center text-gray-300 mb-8">
          Your compassionate mental health voice assistant
        </p>
        
        {!isStarted ? (
          <div className="text-center">
            <button
              onClick={() => setIsStarted(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Start Conversation
            </button>
          </div>
        ) : (
          <Conversation onEnd={() => setIsStarted(false)} />
        )}
      </div>
    </main>
  );
} 
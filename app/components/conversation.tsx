'use client';
import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';

export function Conversation() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => {
      console.log('Message:', message);
      setMessages(prev => [...prev, { role: 'assistant', content: message.text }]);
    },
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: 'J3Pbu5gP6NNKBscdCdwB', // Using the agent ID we created earlier
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300 hover:bg-red-600 transition-colors"
        >
          Stop Conversation
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Status: {conversation.status}</p>
          <p className="text-sm">
            Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}
          </p>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Conversation History</h3>
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                message.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'
              }`}
            >
              <p className="text-sm font-medium">
                {message.role === 'user' ? 'You: ' : 'AI: '}
              </p>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
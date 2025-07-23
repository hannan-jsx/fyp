import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isStreaming?: boolean;
}

export default function InfoSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: 'bot', isStreaming: true },
    ]);

    try {
      await streamResponse(userMessage.text, botMessageId);
    } catch (e) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: 'Sorry, there was an error.', isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const streamResponse = async (userInput: string, messageId: string) => {
    // Replace '/api/chat' with your real endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    if (!response.ok) throw new Error('Network error');
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No stream');
    let accumulated = '';
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, text: accumulated } : msg
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isStreaming: false } : msg
        )
      );
      reader.releaseLock();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className='flex flex-col justify-end pb-4 min-h-[45rem] bg-[#0C0E16] px-4 lg:px-16 md:px-8 '>
      <div className='w-full bg-[#181A20] rounded-2xl shadow-xl flex flex-col h-[34rem] '>
        <div className='flex-1 overflow-y-auto px-6 py-4 space-y-6'>
          {messages.length === 0 && (
            <div className='text-center text-gray-500 mt-16 h-56 flex items-center justify-center'>
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={` md:max-w-[80%] rounded-xl px-4 py-3 text-base shadow ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white [border-radius:16px_6px_16px_16px]'
                    : 'bg-[#23242a] text-gray-100 border border-[#23242a] [border-radius:6px_16px_16px_16px]'
                }`}
              >
                {/* <div className='flex items-center gap-2 mb-1 cta'>
                  {msg.sender === 'bot' && (
                    <Bot className='w-4 h-4 text-blue-400' />
                  )}
                  {msg.sender === 'user' && (
                    <User className='w-4 h-4 text-gray-300' />
                  )}
                  <span className='font-semibold text-xs uppercase tracking-wide'>
                    {msg.sender === 'user' ? 'You' : 'AskUoK AI'}
                  </span>
                </div> */}
                <div className='whitespace-pre-line'>
                  {msg.text}
                  {msg.isStreaming && (
                    <span className='inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle'></span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className='p-4 border-t border-[#23242a] bg-[#181A20] flex gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type='text'
            className='w-full rounded-lg px-4 py-2 bg-[#23242a] text-white border border-[#23242a] focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Ask anything...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoFocus
          />
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 cta text-white px-3 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <Send className='w-5 h-5 text-white ' />
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

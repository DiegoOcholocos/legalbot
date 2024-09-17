'use client';

import { useState } from 'react';

export default function DashboardComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', input);
    if (file) {
      formData.append('file', file);
    }

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setFile(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: input },
        { role: 'ai', content: data.text },
      ]);
    } catch (error) {
      console.error('Error during chat API call:', error);
      // Optionally handle error state
    }
  };

  return (
    <main className='w-full h-screen flex flex-col bg-gray-100 dark:bg-gray-900'>
      <section className='flex-1 p-4 overflow-y-auto'>
        {messages.map((m, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg max-w-xs ${
              m.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black'
            }`}
          >
            <p className='font-semibold'>{m.role === 'user' ? 'User' : 'AI'}</p>
            <p>{m.content}</p>
          </div>
        ))}
      </section>
      <form className='p-4 flex space-x-4' onSubmit={handleSubmit}>
        <input
          className='input input-bordered w-full dark:bg-gray-700 dark:text-white'
          type='text'
          placeholder='Say something...'
          value={input}
          onChange={handleInputChange}
        />
        <input
          className='input input-bordered w-full dark:bg-gray-700 dark:text-white'
          type='file'
          onChange={handleFileChange}
        />
        <button className='btn btn-primary' type='submit'>
          Send
        </button>
      </form>
    </main>
  );
}

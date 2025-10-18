'use client';

import { useState } from 'react';

export default function TicketSubmissionForm() {
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issue }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ticket created successfully!');
        setIssue('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Create a New Ticket</h3>
      <textarea
        className="w-full p-2 border rounded-md"
        rows={4}
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        placeholder="Enter customer's issue here..."
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? 'Creating...' : 'Submit Ticket'}
      </button>
      {message && <p className="mt-2 text-sm text-center">{message}</p>}
    </form>
  );
}
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { TicketData, MessageData } from '@/types';

interface TicketDetailsModalProps {
  ticket: TicketData;
  onClose: () => void;
}

export default function TicketDetailsModal({ ticket, onClose }: TicketDetailsModalProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window === 'undefined') return;
    if (!ticket?.id) return;

    const messagesQuery = query(
      collection(db, `tickets/${ticket.id}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageData[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [ticket]);

  useEffect(() => {
    // Scroll to the bottom of the chat window on new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    if (!auth.currentUser) {
      console.error("No user authenticated to send message.");
      return;
    }

    try {
      const messagesRef = collection(db, `tickets/${ticket.id}/messages`);
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Ticket Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none font-semibold">
            &times;
          </button>
        </div>

        <div className="p-4 border rounded-md mb-4 bg-gray-50">
          <p className="text-sm text-gray-500">ID: {ticket.id}</p>
          <p className="text-lg font-semibold">{ticket.issue}</p>
          <p className={`text-sm font-medium mt-1 inline-block px-2 py-1 rounded-full ${
            ticket.category === 'Technical' ? 'bg-blue-200 text-blue-800' :
            ticket.category === 'Finance' ? 'bg-green-200 text-green-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            Category: {ticket.category}
          </p>
          <p className="text-sm font-medium mt-2">Status: <span className="capitalize">{ticket.status}</span></p>
        </div>

        <div className="h-64 overflow-y-auto border p-4 mb-4 rounded-md bg-gray-100 flex flex-col space-y-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg text-sm max-w-xs ${msg.senderId === auth.currentUser?.uid ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                  <p className="font-bold text-xs">{msg.senderEmail}</p>
                  {msg.text}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-sm">No messages yet.</p>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
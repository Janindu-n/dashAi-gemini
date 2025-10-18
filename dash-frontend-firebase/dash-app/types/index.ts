import { Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface TicketData {
  id: string;
  issue: string;
  category: string;
  assignedToRole: string;
  status: string;
  assignedTo?: string;
  assignedToUser?: string;
  createdAt: Timestamp;
}

export interface MessageData {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  createdAt: Timestamp;
}

export interface UserData {
  uid: string;
  email: string;
  role: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

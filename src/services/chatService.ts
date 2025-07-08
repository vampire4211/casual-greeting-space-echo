import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  sender: "customer" | "vendor";
  message: string;
  timestamp: string;
}

export interface ChatSession {
  customer_id: number;
  vendor_id: number;
  messages: ChatMessage[];
  started_at: string;
}

class ChatService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];

  // Connect to WebSocket for real-time chat
  connect(customerId: number, vendorId: number) {
    const wsUrl = `wss://mwjrrhluqiuchczgzzld.supabase.co/functions/v1/socket-chat`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('Connected to chat server');
      this.joinRoom(customerId, vendorId);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_message') {
        const message: ChatMessage = {
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp
        };
        
        this.messageHandlers.forEach(handler => handler(message));
      }
    };

    this.socket.onclose = () => {
      console.log('Disconnected from chat server');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Join a chat room
  joinRoom(customerId: number, vendorId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join_room',
        customer_id: customerId,
        vendor_id: vendorId
      }));
    }
  }

  // Send a message
  sendMessage(customerId: number, vendorId: number, message: string, sender: "customer" | "vendor") {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'send_message',
        customer_id: customerId,
        vendor_id: vendorId,
        message,
        sender
      }));
    }
  }

  // Add message handler
  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
  }

  // Remove message handler
  removeMessageHandler(handler: (message: ChatMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  // Get chat history from MongoDB
  async getChatHistory(customerId: number, vendorId: number): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`https://mwjrrhluqiuchczgzzld.supabase.co/functions/v1/mongodb-chat?customer_id=${customerId}&vendor_id=${vendorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13anJyaGx1cWl1Y2hjemd6emxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjQ2NzUsImV4cCI6MjA2NjU0MDY3NX0.edj3Fr98TQJEeOalOntC4FUZgsrm0QvJXsf5Bz3zB9Y`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch chat history');
      
      const data = await response.json();
      return data.chat?.messages || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandlers = [];
  }
}

export const chatService = new ChatService();
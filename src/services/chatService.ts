import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  sender: "customer" | "vendor";
  message: string;
  timestamp: string;
}

export interface ChatSession {
  customer_id: string;
  vendor_id: string;
  messages: ChatMessage[];
  started_at: string;
}

class ChatService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];

  // Connect to WebSocket for real-time chat
  connect(customerId: string, vendorId: string) {
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
  joinRoom(customerId: string, vendorId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'join_room',
        customer_id: customerId,
        vendor_id: vendorId
      }));
    }
  }

  // Send a message
  sendMessage(customerId: string, vendorId: string, message: string, sender: "customer" | "vendor") {
    // Save message to database
    this.saveMessage(customerId, vendorId, message, sender);
    
    // Send via WebSocket for real-time updates
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

  // Save message to PostgreSQL
  async saveMessage(customerId: string, vendorId: string, message: string, sender: "customer" | "vendor") {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          customer_id: customerId,
          vendor_id: vendorId,
          sender,
          message
        });

      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error saving message:', error);
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

  // Get chat history from PostgreSQL
  async getChatHistory(customerId: string, vendorId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('customer_id', customerId)
        .eq('vendor_id', vendorId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching chat history:', error);
        return this.getMockChatHistory();
      }

      return data?.map(msg => ({
        sender: msg.sender as "customer" | "vendor",
        message: msg.message,
        timestamp: msg.timestamp
      })) || this.getMockChatHistory();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return this.getMockChatHistory();
    }
  }

  // Mock chat history fallback
  private getMockChatHistory(): ChatMessage[] {
    return [
      {
        sender: 'vendor',
        message: 'Hello! How can I help you today?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        sender: 'customer',
        message: 'Hi, I was interested in your photography services.',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      },
      {
        sender: 'vendor',
        message: 'Great! I would love to help with your photography needs. What type of event are you planning?',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString()
      }
    ];
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
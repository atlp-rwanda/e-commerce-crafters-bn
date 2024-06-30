import Message from '../database/models/messages';

class MessageService {
  async addMessage(name: number, email: string, content: string) {
    try {
      const newMessage = await Message.create({ name, email, content });
      return newMessage;
    } catch (error: any) {
      throw new Error('Error adding message: ' + error.message);
    }
  }

  async getMessages() {
    try {
      const messages = await Message.findAll();
      return messages;
    } catch (error: any) {
      throw new Error('Error retrieving messages: ' + error.message);
    }
  }
}

export const messageService = new MessageService();

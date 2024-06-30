import { Request, Response } from 'express';
import { messageService } from '../services/messages';


  //add message
export const addMessage = async (req: Request, res: Response) => {
    try {
      const { name, email, content } = req.body;
  
      if (!name || !email || !content) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const newMessage = await messageService.addMessage(name, email, content);
      return res.status(201).json(newMessage);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
};

  // Get all messages
export const getMessages = async (req: Request, res: Response) => {
    try {
      const messages = await messageService.getMessages();
      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
};


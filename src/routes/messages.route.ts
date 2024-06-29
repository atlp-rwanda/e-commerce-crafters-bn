import { Router } from 'express';
import { addMessage, getMessages } from '../controllers/message.controller';

const router: Router = Router();

router.post('/addMessage', addMessage);
router.get('/getMessages', getMessages);

export default router;

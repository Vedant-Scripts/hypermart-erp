import { Router, type IRouter } from "express";
import { authenticateUser } from "../../common/auth/guards.auth.js";
import { checkContactNumberController, createContactController, deleteContactController, getAllContactsByContactTypeController, getContactByIdController, updateContactController } from "./contacts.controller.js";


const router: IRouter = Router();

router.post('/', authenticateUser, createContactController);

router.get('/data', authenticateUser, getAllContactsByContactTypeController);

router.get('/check-mobile-number', authenticateUser, checkContactNumberController);

router.get('/:id', authenticateUser, getContactByIdController);

router.patch('/:id', authenticateUser, updateContactController);

router.delete('/:id', authenticateUser, deleteContactController);


export default router;
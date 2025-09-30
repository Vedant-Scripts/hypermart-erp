import { Router } from "express";
import { authenticate } from "../../common/auth/guards.auth.js";
import { checkContactNumberController, createContactController, deleteContactController, getAllContactsByContactTypeController, getContactByIdController, updateContactController } from "./contacts.controller.js";

const router = Router();

router.post('/', authenticate, createContactController);

router.get('/data', authenticate, getAllContactsByContactTypeController);

router.get('/check-mobile-number', authenticate, checkContactNumberController);

router.get('/:id', authenticate, getContactByIdController);

router.patch('/:id', authenticate, updateContactController);

router.delete('/:id', authenticate, deleteContactController);


export default router;
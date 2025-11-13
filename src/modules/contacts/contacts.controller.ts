import type { NextFunction, Request, Response } from "express";
import { createContactSchema, updateContactSchema } from "./contacts.validation.js";
import type { ContactResponseDTO } from "./contacts.types.js";
import { checkContactContactNumberService, createContactService, deleteContactService, getAllContactsByContactTypeService, getContactByIdService, updateContactService } from "./contacts.service.js";

export const createContactController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod
        const parsed = createContactSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ errors: parsed.error });

        // call service
        const contact: ContactResponseDTO = await createContactService(parsed.data)

        return res.status(201).json({ message: 'Contact Created', data: contact })

    } catch (error) {
        next(error)
    }
};

export const getContactByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactId = req.params.id;
        if (!contactId) return res.status(400).json({ message: "Contact id is required" });

        const contact: ContactResponseDTO | null = await getContactByIdService(contactId);

        if (!contact) return res.status(404).json({ message: "Contact not found" });

        return res.status(200).json({ message: "Contact found", data: contact });
    } catch (error) {
        next(error);
    }
};

export const getAllContactsByContactTypeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactType = req.query.contactType;
        if (contactType !== "CUSTOMER" && contactType !== "SUPPLIER") return res.status(400).json({ message: "Contact Type is required" });

        const contact: ContactResponseDTO[] | [] = await getAllContactsByContactTypeService(contactType);

        return res.status(200).json({
            message: (contact.length !== 0) ? 'Contact found' : 'No Data Found',
            data: contact
        })
    } catch (error) {
        next(error);
    }
};

export const updateContactController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate with zod

        const parsed = updateContactSchema.safeParse(req.body);
        const contactId = req.params.id;
        if (!contactId) return res.status(400).json({ message: "Contact id is required" });

        if (!parsed.success) return res.status(400).json({ errors: parsed.error });
        // call service 
        const contact: ContactResponseDTO = await updateContactService(contactId, parsed.data);

        return res.status(200).json({ message: 'Contact Updated', data: contact })
    } catch (error) {
        next(error)
    }
};

export const checkContactNumberController = async (req: Request, res: Response, next: NextFunction) => {
    const contactNumber = req.query.contactNumber;
    if (typeof contactNumber !== "string") return res.status(400).json({ message: 'Contact Number is required' });

    const result = await checkContactContactNumberService(contactNumber);
    return res.status(200).json(result);
};

export const deleteContactController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contactId = req.params.id;
        if (!contactId) return res.status(400).json({ message: "Contact id is required" });

        await deleteContactService(contactId);
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
};
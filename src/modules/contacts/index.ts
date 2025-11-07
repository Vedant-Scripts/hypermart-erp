import type { AppRouter } from '../../common/types/router.types.js';
import contactRoute from './contacts.route.js';

export const contactRouter: AppRouter = { prefix: "/api/contact", router: contactRoute }
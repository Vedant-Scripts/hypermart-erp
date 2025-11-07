import type { AppRouter } from '../../common/types/router.types.js';
import userRoute from './users.route.js';

export const userRouter: AppRouter = { prefix: "/api/user", router: userRoute }
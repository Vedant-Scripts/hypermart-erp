import type { AppRouter } from '../../common/types/router.types.js';
import purchaseBillRoute from './purchaseBill/purchaseBill.route.js';

export const purchaseBillRouter: AppRouter = { prefix: '/api/purchase-bill', router: purchaseBillRoute }
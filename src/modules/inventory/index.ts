import type { AppRouter } from "../../common/types/router.types.js";
import categoryRoute from "./categories/categories.route.js";
import brandRoute from "./brands/brands.route.js";
import unitRoute from "./units/units.route.js";

export const categoryRouter: AppRouter = { prefix: "/api/category", router: categoryRoute }
export const brandRouter: AppRouter = { prefix: "/api/brand", router: brandRoute }
export const unitRouter: AppRouter = { prefix: "/api/unit", router: unitRoute }

import type { Router } from "express"

export type AppRouter = {
    prefix: string,
    router: Router
}


export type Sort = "asc" | "desc"

export type SearchPagination = {
    field?: string,
    search?: string,
    page?: number,
    perPage?: number,
    orderBy?: {
        field: string,
        direction: Sort
    }
}


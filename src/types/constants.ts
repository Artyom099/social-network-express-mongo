export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    INTERNAL_SERVER_ERROR: 500
}
export enum ResultCode {
    Success = 0,
    NotFound = 1,
    BedRequest = 2,
    Unauthorized = 3
}
export const DEFAULT_SORT_BY: string = 'createdAt'
export const DEFAULT_SORT_DIRECTION: string = 'desc'
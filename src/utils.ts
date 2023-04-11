export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404,
    INTERNAL_SERVER_ERROR: 500
}

export enum ResultCode {
    Success = 0,
    NotFound = 1,
    BedRequest = 2,
    Unauthorized = 3
}

export type Result<T> = {
    code: ResultCode
    data: T
}
export const convertResultErrorCodeToHttp = (resultCode: ResultCode): number=> {
    switch (resultCode) {
        case ResultCode.NotFound:
            return HTTP_STATUS.NOT_FOUND_404
        case ResultCode.BedRequest:
            return HTTP_STATUS.BAD_REQUEST_400
        case ResultCode.Unauthorized:
            return HTTP_STATUS.UNAUTHORIZED_401
        default:
            return HTTP_STATUS.INTERNAL_SERVER_ERROR
    }
}
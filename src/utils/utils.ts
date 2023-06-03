import {HTTP_STATUS, ResultCode} from "./constants";


export const getRefreshTokenByResponseWithTokenName = (response: { headers: { [x: string]: string[]; }; }) => {
    return response.headers['set-cookie'][0].split(';')[0]
}
export const getRefreshTokenByResponse = (response: { headers: { [x: string]: string[]; }; }) => {
    return response.headers['set-cookie'][0].split(';')[0].split('=')[1]
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
import {HTTP_STATUS, ResultCode} from "./types/constants";


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
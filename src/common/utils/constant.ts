export const TOKEN_TYPES = {
    ACCESS: "access",
    REFRESH: "refresh",
} as const;

export const PREFIXES = {
    REFRESH_TOKEN: 'refresh_token',
} as const;

export const ROLE_TO_CLIENT = {
    USER: 'customer_app',
    DELIVERY_PERSON: 'delivery_app'
} as const;

export const AUTH_TYPES = [
    "email_password",
    "email_otp",
    "mobile_otp"
] as const

export const EXTERNAL_API_ENDPOINTS = {
    // MSG-91 API ENDPOINT
    MSG_91_SEND_SMS: 'https://control.msg91.com/api/v5/flow'

    // would update with need

} as const;
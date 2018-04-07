import { HelloJSAuthResponse } from 'hellojs';

/** JSON data received from Azure AD B2C after successful authentication */
export interface B2cResponse {
    authResponse: HelloJSAuthResponse
}

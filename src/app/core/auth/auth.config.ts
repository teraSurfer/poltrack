export default {
  // Sample API url
  API: 'https://demo.com',
  /** Azure AD B2C application ID */
  B2cApplicationID: '54b9a244-58f4-4460-8f68-3889f7c3a0bf',
  B2cTenantName: 'visid.onmicrosoft.com',
  B2cSignInSignUpPolicyName: 'B2C_1_SuSi',
  B2cRedirectUri: 'http://localhost:4200/',
  B2cScope: 'openid https://visid.onmicrosoft.com/demoapi/demo.read',
  HelloJsB2CSignInNetwork: 'adB2CSignInSignUp',
  HelloJsB2CEditProfileNetwork: 'adB2CEditProfile'
};

export const LoginDisplayType = {
  PopUp: 'popup',
  None: 'none',
  Page: 'page' // default is popup, if we use page option, webpage gets redirected to b2c login page then to redirect html.
};

/*
  Based on
    github: DaveSkender/angular-seed-hellojs
    https://medium.com/@mikko.vuorinen/aurelia-and-azure-ad-b2c-authentication-351fbe2de348
    https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
*/

import { HttpInterceptor } from '@angular/common/http';
import * as hello from 'hellojs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import AuthConfig, { LoginDisplayType } from './auth.config';
import { ActionAuthLogin } from '@app/core';
import { Subject } from 'rxjs/Subject';
import { HelloJSDisplayType, HelloJSAuthResponse } from 'hellojs';
import * as graph from '@microsoft/microsoft-graph-types';
import { Injectable } from '@angular/core';
import * as jwtdecode from 'jwt-decode';
import { B2cResponse } from '@app/core/auth/shared/B2cResponse.model';
import { Person } from '@app/core/auth/shared/Person.model';

@Injectable()
export class AuthService {

    private isAuthenticated = false;
    private name: string;
    // private graphUrl = 'https://graph.microsoft.com/v1.0';
    private graphUrl = 'https://graph.windows.net/' + AuthConfig.B2cTenantName;

    person$: Subject<Person> = new Subject<Person>();
    isAuthenticated$: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient) { }

    initAuth() {
        // Configure Azure AD B2C module for hello.js
        hello.init({
            adB2CSignInSignUp: {
                oauth: {
                    version: 2,
                    auth: 'https://login.microsoftonline.com/tfp/' + AuthConfig.B2cTenantName + '/' +
                        AuthConfig.B2cSignInSignUpPolicyName + '/oauth2/v2.0/authorize',
                    grant: 'https://login.microsoftonline.com/tfp/' + AuthConfig.B2cTenantName + '/' +
                        AuthConfig.B2cSignInSignUpPolicyName + '/oauth2/v2.0/token'
                },
                scope_delim: ' ',
                logout: () => {
                    // Azure AD B2C doesn't support logging out in iframe,
                    // so use redirect instead.
                    // PLATFORM.location.assign(
                    // this.router.navigateByUrl(
                    // this.getLogoutUrl(authConfig.adTenantName, authConfig.adPolicyName,
                    //     authConfig.adRedirectUri)
                    // get id_token from auth response
                    const id_token = hello(AuthConfig.HelloJsB2CSignInNetwork).getAuthResponse().id_token;
                    // clearing local storage session
                    hello.utils.store(AuthConfig.HelloJsB2CSignInNetwork, null);

                    window.location.href = 'https://login.microsoftonline.com/' + AuthConfig.B2cTenantName + '/oauth2/v2.0/logout?p=' +
                        AuthConfig.B2cSignInSignUpPolicyName + '&id_token_hint=' +
                        id_token + '&post_logout_redirect_uri=' + encodeURI(AuthConfig.B2cRedirectUri);

                    return true; // Tell hello.js to handle the rest
                },
            }
        });


        // Configure application details
        hello.init({ adB2CSignInSignUp: AuthConfig.B2cApplicationID }, {
            redirect_uri: AuthConfig.B2cRedirectUri,
            scope: AuthConfig.B2cScope,
            response_type: 'id_token token',
            display: <HelloJSDisplayType>LoginDisplayType.Page,
        });

        // TODO: there should be corresponding hello.off statement in destroy.
        hello.on('auth.login', this.handleSignInResponse.bind(this));
        // this.handleAuthenticationResponse();
    }


    public login() {
        const aresp: HelloJSAuthResponse = hello(AuthConfig.HelloJsB2CSignInNetwork).getAuthResponse();

        if (aresp && !this.isAuthenticated) {
            this.updatePerson(aresp);
        } else {
            hello(AuthConfig.HelloJsB2CSignInNetwork).login(AuthConfig.HelloJsB2CSignInNetwork);
            //     .then(() => {
            //         console.log('You are signed in');
            //     }, (e) => {
            //         console.log('Signin error: ' + e.error.message);
            //     });
            // //   .then(() => this.handleSignInResponse());
        }
    }

    public logout() {
        hello(AuthConfig.HelloJsB2CSignInNetwork).logout(AuthConfig.HelloJsB2CSignInNetwork, { force: true } )
        .then(() => this.updateUiAfterLogout());
    }

    private handleSignInResponse(resp?: B2cResponse): any {
        this.isAuthenticated = true;
        this.isAuthenticated$.next(this.isAuthenticated);
        this.updatePerson(resp.authResponse);
    }

    private updatePerson(authResponse: HelloJSAuthResponse) {
        if (authResponse && authResponse.id_token) {
            const idToken = jwtdecode(authResponse.id_token);
        }
    }

    private updateUiAfterLogout() {
        const response = hello(AuthConfig.HelloJsB2CSignInNetwork).getAuthResponse();

        if (!response) {
            this.isAuthenticated = false;
            this.isAuthenticated$.next(this.isAuthenticated);
            return;
        }

        if (!('access_token' in response) || !response.access_token) {
            this.isAuthenticated = false;
            this.isAuthenticated$.next(this.isAuthenticated);
            return;
        }

        this.isAuthenticated = true;
        this.isAuthenticated$.next(this.isAuthenticated);
        this.updatePerson(response);
    }

    private getAuthUrl(tenant: string, policy: string) {
        return this.getOauthUrl(tenant, policy) + '/authorize';
    }

    private getGrantUrl(tenant: string, policy: string) {
        return this.getOauthUrl(tenant, policy) + '/token';
    }

    private getLogoutUrl(tenant: string, policy: string, redirectUri: string) {
        return this.getOauthUrl(tenant, policy) + '/logout'
            + '?post_logout_redirect_uri=' + encodeURI(redirectUri);
    }

    private getOauthUrl(tenant: string, policy: string) {
        return `https://login.microsoftonline.com/te/${tenant}/${policy}/oauth2/v2.0`;
    }
}

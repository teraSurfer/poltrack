/*
  Based on github: DaveSkender/angular-seed-hellojs
*/
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';

const hello = require('hellojs/dist/hello.all.js');
import * as graph from '@microsoft/microsoft-graph-types';

@Injectable()
export class AuthService {

    graphUrl = 'https://graph.microsoft.com/v1.0';

    constructor(
        private zone: NgZone,
        private router: Router,
        private http: HttpClient
    ) { }

    initAuth() {
        hello.init({
            msft: {
                id: AuthConfig.ApplicationID,
                oauth: {
                    version: 2,
                    auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
                },
                scope_delim: ' ',
                form: false
            },
        },
            { redirect_uri: window.location.href }
        );
    }

    login() {
        hello('msft').login({ scope: 'User.Read' }).then(
            () => {
                this.zone.run(() => {
                    this.router.navigate(['']);
                });
            },
            (e: any) => console.error(e.error.message)
        );
    }

    logout() {
        hello('msft').logout().then(
            () => this.router.navigate(['']),
            (e: any) => console.error(e.error.message)
        );
    }

    public isAuthenticated(): boolean {
        // https://adodson.com/hello.js/#hellogetauthresponse
        const session = hello('msft').getAuthResponse();
        const currentTime = (new Date()).getTime() / 1000;
        return session && session.access_token && session.expires > currentTime;
    }

    // not used, for future use
    accessToken(): string {
        const msft = hello('msft').getAuthResponse();
        const accessToken = msft.access_token;
        return accessToken;
    }

    authRequestOptions() {

        const authHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.accessToken());

        return { headers: authHeaders };
    }

    getUser(): Observable<graph.User> {

        return this.http
            .get(`${this.graphUrl}/me`, this.authRequestOptions())
            .catch(this.handleError);
    }

    handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}

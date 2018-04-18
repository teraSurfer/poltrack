import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as jwtdecode from 'jwt-decode';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  AuthState,
  routerTransition,
  selectorAuth
} from '@app/core';
import { environment as env } from '@env/environment';

import AuthConfig from '@app/core/auth/auth.config';
import { AuthService } from '@app/core/auth/auth.service';
import { Person } from '@app/core/auth/shared/person.model';
import * as hello from 'hellojs';
import { NIGHT_MODE_THEME, selectorSettings } from './settings';

@Component({
  selector: 'vispt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding('class') componentCssClass;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/checkstar20180228_2.svg');
  logotext = require('../assets/ptdotorg20180228_2.svg');
  navigation = [
    { link: 'reportcard', label: 'Home' },
    { link: 'features', label: 'Providers' },
    { link: 'tools', label: 'Tools' },
    { link: 'about', label: 'About' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'Settings' }
  ];
  isAuthenticated = false;
  displayName = 'unknown name';

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<any>,
    private router: Router,
    private titleService: Title,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.store
      .select(selectorSettings)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(settings => {
        const { theme, autoNightMode } = settings;
        const hours = new Date().getHours();
        const effectiveTheme = (autoNightMode && (hours >= 20 || hours <= 6)
          ? NIGHT_MODE_THEME
          : theme
        ).toLowerCase();
        this.componentCssClass = effectiveTheme;
        const classList = this.overlayContainer.getContainerElement().classList;
        const toRemove = Array.from(classList).filter((item: string) =>
          item.includes('-theme')
        );
        classList.remove(...toRemove);
        classList.add(effectiveTheme);
      });

    this.store
      .select<AuthState>(selectorAuth)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((auth) => {
        this.isAuthenticated = auth.isAuthenticated;
        if (auth.person) { this.displayName = auth.person.name; }
      });

    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof ActivationEnd)
      )
      .subscribe((event: ActivationEnd) => {
        let lastChild = event.snapshot;
        while (lastChild.children.length) {
          lastChild = lastChild.children[0];
        }
        const { title } = lastChild.data;
        this.titleService.setTitle(
          title ? `${title} - ${env.appName}` : env.appName
        );
      });

    this.authService.initAuth();

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resp) => {
        this.processAuthResponse(resp);
      }
      );
  }

  processAuthResponse(response: boolean) {
    if (response) {
      const person = this.getPerson(hello(AuthConfig.HelloJsB2CSignInNetwork).getAuthResponse().id_token);
      this.store.dispatch(new ActionAuthLogin({ person }));
    } else {
      this.store.dispatch(new ActionAuthLogout());
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoginClick() {
    this.authService.login();
  }

  onLogoutClick() {
    this.authService.logout();
  }

  /** Returns Person object populated with identity information extracted from Azure AD B2C id_token  */
  getPerson(encodedIdToken: string): Person {
    const idToken = jwtdecode(encodedIdToken);
    const person: Person = { email: 'unknown email', name: 'unknown name', id: 'unknown id' };

    person.id = idToken.sub;

    if (idToken.name) {
      person.name = idToken.name;
      this.displayName = person.name;
    }

    if (idToken.emails && idToken.emails.length > 0) {
      person.email = idToken.emails[0];
    }

    return person;
  }
}

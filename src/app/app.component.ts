import browser from 'browser-detect';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import * as jwtdecode from 'jwt-decode';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  AnimationsService,
  TitleService,
  selectAuth,
  routeAnimations,
  AppState
} from '@app/core';
import { environment as env } from '@env/environment';

import AuthConfig from '@app/core/auth/auth.config';
import { AuthService } from '@app/core/auth/auth.service';
import { Person } from '@app/core/auth/person.model';
import * as hello from 'hellojs';
import {
  NIGHT_MODE_THEME,
  selectSettings,
  SettingsState,
  ActionSettingsPersist,
  ActionSettingsChangeLanguage,
  ActionSettingsChangeAnimationsPageDisabled
} from './settings';

@Component({
  selector: 'vispt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
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
  languages = ['en', 'sk'];
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

  settings: SettingsState;
  isAuthenticated = false;
  displayName = 'unknown name';

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<any>,
    private router: Router,
    private titleService: TitleService,
    private authService: AuthService,
    private animationService: AnimationsService,
    private translate: TranslateService
  ) {}

  // private static trackPageView(event: NavigationEnd) {
  //   (window as any).ga('set', 'page', event.urlAfterRedirects);
  //   (window as any).ga('send', 'pageview');
  // }

  private static isIEorEdge() {
    return ['ie', 'edge'].includes(browser().name);
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.subscribeToSettings();
    this.subscribeToIsAuthenticated();
    this.subscribeToRouterEvents();

    this.authService.initAuth();

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(resp => {
        this.processAuthResponse(resp);
      });
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

  onLanguageSelect({ value: language }) {
    this.store.dispatch(new ActionSettingsChangeLanguage({ language }));
    this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
  }

  private subscribeToIsAuthenticated() {
    this.store
      .pipe(select(selectAuth), takeUntil(this.unsubscribe$))
      .subscribe(auth => {
        this.isAuthenticated = auth.isAuthenticated;
        if (auth.person) {
          this.displayName = auth.person.name;
        }
      });
  }

  private subscribeToSettings() {
    if (AppComponent.isIEorEdge()) {
      this.store.dispatch(
        new ActionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }
    this.store
      .pipe(select(selectSettings), takeUntil(this.unsubscribe$))
      .subscribe(settings => {
        this.settings = settings;
        this.setTheme(settings);
        this.setLanguage(settings);
        this.animationService.updateRouteAnimationType(
          settings.pageAnimations,
          settings.elementsAnimations
        );
      });
  }

  private setTheme(settings: SettingsState) {
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
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(effectiveTheme);
  }

  private setLanguage(settings: SettingsState) {
    const { language } = settings;
    if (language) {
      this.translate.use(language);
    }
  }

  private subscribeToRouterEvents() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.titleService.setTitle(event.snapshot);
      }

      // if (event instanceof NavigationEnd) {
      //   AppComponent.trackPageView(event);
      // }
    });
  }

  processAuthResponse(response: boolean) {
    if (response) {
      const person = this.getPerson(
        hello(AuthConfig.HelloJsB2CSignInNetwork).getAuthResponse().id_token
      );
      this.store.dispatch(new ActionAuthLogin(person));
    } else {
      this.store.dispatch(new ActionAuthLogout());
    }
  }

  /** Returns Person object populated with identity information extracted from Azure AD B2C id_token  */
  getPerson(encodedIdToken: string): Person {
    const idToken = jwtdecode(encodedIdToken);
    const person: Person = {
      email: 'unknown email',
      name: 'unknown name',
      id: 'unknown id'
    };

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

import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { MatSlideToggle } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { SharedModule } from '@app/shared';
import { TestingModule, TestStore } from '@testing/utils';

import {
  ActionSettingsChangeAnimationsElements,
  ActionSettingsChangeAnimationsPage,
  ActionSettingsChangeAutoNightMode,
  ActionSettingsChangeTheme,
  SettingsState
} from '../settings.reducer';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: TestStore<SettingsState>;
  let dispatchSpy;

  const getThemeSelectArrow = () =>
    fixture.debugElement.queryAll(By.css('.mat-select-trigger'))[1];
  const getSelectOptions = () =>
    fixture.debugElement.queryAll(By.css('mat-option'));

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsComponent],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(
    inject([Store], (testStore: TestStore<SettingsState>) => {
      store = testStore;
      store.setState({
        theme: 'DEFAULT-THEME',
        autoNightMode: true,
        pageAnimations: true,
        pageAnimationsDisabled: false,
        elementsAnimations: true,
        language: 'en'
      });
      fixture = TestBed.createComponent(SettingsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.settings.theme).toBe('DEFAULT-THEME');
    expect(component.settings.autoNightMode).toBeTruthy();
    expect(component.settings.pageAnimations).toBeTruthy();
  });

  it('should dispatch change theme action on theme selection', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    getThemeSelectArrow().triggerEventHandler('click', {});

    fixture.detectChanges();

    getSelectOptions()[1].triggerEventHandler('click', {});

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionSettingsChangeTheme({ theme: 'LIGHT-THEME' })
    );
  });

  it('should dispatch change auto night mode on night mode toggle', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[0];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionSettingsChangeAutoNightMode({ autoNightMode: false })
    );
  });

  it('should dispatch change animations page', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[1];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionSettingsChangeAnimationsPage({ pageAnimations: false })
    );
  });

  it('should dispatch change animations elements', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[2];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionSettingsChangeAnimationsElements({ elementsAnimations: false })
    );
  });

  it('should disable change animations page when disabled is set in state', () => {
    store.setState({
      theme: 'DEFAULT-THEME',
      autoNightMode: true,
      pageAnimations: true,
      pageAnimationsDisabled: true, // change animations disabled
      elementsAnimations: true,
      language: 'en'
    });
    fixture.detectChanges();

    dispatchSpy = spyOn(store, 'dispatch');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[1];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(0);
  });
});

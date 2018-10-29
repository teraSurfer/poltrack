import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedResultListComponent } from './selected-result-list.component';

describe('SelectedResultListComponent', () => {
  let component: SelectedResultListComponent;
  let fixture: ComponentFixture<SelectedResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedResultListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

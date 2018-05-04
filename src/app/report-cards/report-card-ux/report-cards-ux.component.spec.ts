import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardsUxComponent } from './report-cards-ux.component';

describe('ReportCardsComponent', () => {
  let component: ReportCardsUxComponent;
  let fixture: ComponentFixture<ReportCardsUxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCardsUxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardsUxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

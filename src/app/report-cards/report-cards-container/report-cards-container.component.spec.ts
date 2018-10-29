import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCardsContainerComponent } from '@app/report-cards/components/report-cards-container.component';

xdescribe('ReportCardsContainerComponent', () => {
  let component: ReportCardsContainerComponent;
  let fixture: ComponentFixture<ReportCardsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportCardsContainerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCardsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

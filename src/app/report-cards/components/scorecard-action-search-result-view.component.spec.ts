import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardActionSearchResultViewComponent } from './scorecard-action-search-result-view.component';

describe('ScorecardActionSearchResultViewComponent', () => {
  let component: ScorecardActionSearchResultViewComponent;
  let fixture: ComponentFixture<ScorecardActionSearchResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardActionSearchResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardActionSearchResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

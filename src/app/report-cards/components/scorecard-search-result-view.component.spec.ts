import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardSearchResultViewComponent } from './scorecard-search-result-view.component';

describe('ScorecardSearchResultViewComponent', () => {
  let component: ScorecardSearchResultViewComponent;
  let fixture: ComponentFixture<ScorecardSearchResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardSearchResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardSearchResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

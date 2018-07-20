import { TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared';
import { ReportCardsModule } from './report-cards.module';

describe('ReportCardsModule', () => {
  let reportCardsModule: ReportCardsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    });
    reportCardsModule = new ReportCardsModule();
  });

  it('should create an instance', () => {
    expect(reportCardsModule).toBeTruthy();
  });
});

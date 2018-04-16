import { ReportCardsModule } from './report-cards.module';

describe('ReportCardsModule', () => {
  let reportCardsModule: ReportCardsModule;

  beforeEach(() => {
    reportCardsModule = new ReportCardsModule();
  });

  it('should create an instance', () => {
    expect(reportCardsModule).toBeTruthy();
  });
});

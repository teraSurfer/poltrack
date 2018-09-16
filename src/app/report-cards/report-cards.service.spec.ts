import { inject, TestBed } from '@angular/core/testing';

import { ReportCardsService } from './report-cards.service';

describe('ReportCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportCardsService]
    });
  });

  it(
    'should be created',
    inject([ReportCardsService], (service: ReportCardsService) => {
      expect(service).toBeTruthy();
    })
  );
});

import { inject, TestBed } from '@angular/core/testing';

import { ReportCardsService } from './report-cards.service';
import { HttpClient } from '@angular/common/http';

describe('ReportCardsService', () => {
  let service: ReportCardsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ReportCardsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
  });

  it('should be created', () => {
    service = new ReportCardsService(httpClientSpy);
    expect(service).toBeTruthy();
  });
});

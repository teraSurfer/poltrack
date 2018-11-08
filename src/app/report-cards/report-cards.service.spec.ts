import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';

import { ReportCardsService } from './report-cards.service';
import { MockStore, provideMockStore } from '@testing/utils';
import { State, ReportCardsState } from './report-cards.model';
import { ActorState } from './actors.model';

describe('ReportCardsService', () => {
  let service: ReportCardsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let store: MockStore<State>;
  let state: State;

  const actorState: ActorState = {
    ids: ['abc1'],
    entities: {
      a1: {
        id: 'abc1',
        actorId: 'a1',
        officeId: 'o1',
        title: 'Joe Kennedy',
        description: 'Congressman from Massachusetts',
        termStarted: undefined,
        termEnded: undefined
      }
    }
  };

  const reportCardsState: ReportCardsState = {
    actors: actorState
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        ReportCardsService,
        provideMockStore(),
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.get(ReportCardsService);
    store = TestBed.get(Store);
    state = createState(reportCardsState);
    store.setState(state);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

function createState(reportCardsState: ReportCardsState) {
  return {
    reportcards: reportCardsState
  } as State;
}

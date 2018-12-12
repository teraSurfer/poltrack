import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';

import { ReportCardsService } from './report-cards.service';
import { MockStore, provideMockStore } from '@testing/utils';
import { State, ReportCardsState } from './report-cards.state';
import { ActorState } from './actors.model';

xdescribe('ReportCardsService', () => {
  let service: ReportCardsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let store: MockStore<State>;
  let appState: State;

  const actorState: ActorState = {
    ids: ['abc1'],
    entities: {
      a1: {
        id: 'abc1',
        personId: 'a1',
        officeId: 'o1',
        title: 'Joe Kennedy',
        description: 'Congressman from Massachusetts',
        termStarted: undefined,
        termEnded: undefined
      }
    }
  };

  const reportCardsState: ReportCardsState = {
    actors: actorState,
    providerscorecards: undefined
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
    store = TestBed.get(Store);
    appState = createState(reportCardsState);
    store.setState(appState);
    service = TestBed.get(ReportCardsService);
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

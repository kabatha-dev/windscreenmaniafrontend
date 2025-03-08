import { TestBed } from '@angular/core/testing';

import { StatementOfAccountService } from './statement-of-account.service';

describe('StatementOfAccountService', () => {
  let service: StatementOfAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatementOfAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

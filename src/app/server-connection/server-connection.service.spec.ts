import { TestBed, inject } from '@angular/core/testing';

import { ServerConnectionService } from './server-connection.service';

describe('ServerConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerConnectionService]
    });
  });

  it('should be created', inject([ServerConnectionService], (service: ServerConnectionService) => {
    expect(service).toBeTruthy();
  }));
});

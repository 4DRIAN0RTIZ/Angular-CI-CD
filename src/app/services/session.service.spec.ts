import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SessionService } from './session.service';

fdescribe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService],
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should validate session', () => {
    const mockResponse = { success: true };
    const usuario = 'testUser';
    const version = '1.0';
    const token = 'testToken';

    service.validateSession(usuario, version, token).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`/session/${usuario}/${version}/${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo necesario para pruebas HTTP
      providers: [LoginService], // Proporciona el servicio que se va a probar
    });
    service = TestBed.inject(LoginService); // Inyecta el servicio
    httpMock = TestBed.inject(HttpTestingController); // Inyecta el controlador de pruebas HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to login endpoint', () => {
    const mockResponse = { success: true, token: 'abc123' };
    const user = 'testUser';
    const password = 'testPassword';

    service.login(user, password).subscribe((response) => {
      expect(response).toEqual(mockResponse); // Verifica que la respuesta sea la esperada
    });

    const req = httpMock.expectOne('/api/login'); // Verifica que se hizo una solicitud al endpoint correcto
    expect(req.request.method).toBe('POST'); // Verifica que el método HTTP sea POST
    expect(req.request.body).toEqual({ user, password }); // Verifica el cuerpo de la solicitud
    req.flush(mockResponse); // Envía una respuesta simulada
  });
});

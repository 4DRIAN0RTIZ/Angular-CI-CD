import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo de pruebas para HttpClient
      providers: [SessionService], // Proveedor del servicio que se va a probar
    });
    service = TestBed.inject(SessionService); // Inyecta el servicio
    httpMock = TestBed.inject(HttpTestingController); // Inyecta el controlador de pruebas HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should validate session', () => {
    const mockResponse = { success: true };
    const login = 'testUser';
    const version = '1.0';
    const token = 'testToken';

    service.validateSession(login, version, token).subscribe((response) => {
      expect(response).toEqual(mockResponse); // Verifica que la respuesta coincida con la esperada
    });

    const req = httpMock.expectOne(`api/session/${login}/${version}/${token}`);
    expect(req.request.method).toBe('GET'); // Verifica que la solicitud sea de tipo GET
    req.flush(mockResponse); // Envía una respuesta simulada
  });

  it('should encrypt and decrypt user data', () => {
    const mockUserData = { id: 1, name: 'Test User' };
    const encryptionSpy = spyOn<any>(service, 'encrypt').and.callThrough(); // Espía el método encrypt
    const decryptionSpy = spyOn<any>(service, 'decrypt').and.callThrough(); // Espía el método decrypt

    service.setUserData(mockUserData); // Guarda los datos del usuario

    const retrievedData = service.getUserData(); // Recupera los datos del usuario
    expect(encryptionSpy).toHaveBeenCalled(); // Verifica que se llamó al método encrypt
    expect(decryptionSpy).toHaveBeenCalled(); // Verifica que se llamó al método decrypt
    expect(retrievedData?.decryptedToken).toEqual(mockUserData); // Verifica que los datos desencriptados coincidan
  });

  it('should clear user data', () => {
    const mockUserData = { id: 1, name: 'Test User' };
    service.setUserData(mockUserData); // Guarda los datos del usuario

    service.clearUserData(); // Elimina los datos del usuario
    const retrievedData = service.getUserData(); // Recupera los datos eliminados

    expect(retrievedData).toBeNull(); // Verifica que los datos sean nulos
  });
});

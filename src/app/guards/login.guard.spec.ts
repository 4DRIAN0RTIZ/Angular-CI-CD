import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginGuard } from './login.guard';
import { SessionService } from '../services/session.service';
import { UrlTree } from '@angular/router';

describe('LoginGuard', () => {
  let loginGuard: LoginGuard;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear mocks para las dependencias
    sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getUserData']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    // Configurar el módulo de pruebas
    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: SessionService, useValue: sessionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    // Obtener instancia del guard
    loginGuard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(loginGuard).toBeTruthy();
  });

  it('should redirect to /principal if user is authenticated', () => {
    // Simular que el usuario está autenticado
    sessionServiceSpy.getUserData.and.returnValue({ id: 1, name: 'Test User' });
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const result = loginGuard.canActivate();

    expect(result).toBe(mockUrlTree);
    expect(sessionServiceSpy.getUserData).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/principal']);
  });

  it('should allow activation if user is not authenticated', () => {
    // Simular que no hay sesión activa
    sessionServiceSpy.getUserData.and.returnValue(null);

    const result = loginGuard.canActivate();

    expect(result).toBe(true);
    expect(sessionServiceSpy.getUserData).toHaveBeenCalled();
  });
});

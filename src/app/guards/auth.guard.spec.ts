import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/session.service';
import { UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear mocks para las dependencias
    sessionServiceSpy = jasmine.createSpyObj('SessionService', ['getUserData']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    // Configurar el módulo de pruebas
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: sessionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    // Obtener instancia del guard
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if user is authenticated', () => {
    // Simular que el usuario está autenticado
    sessionServiceSpy.getUserData.and.returnValue({ id: 1, name: 'Test User' });

    const result = authGuard.canActivate();

    expect(result).toBe(true);
    expect(sessionServiceSpy.getUserData).toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', () => {
    // Simular que no hay sesión activa
    sessionServiceSpy.getUserData.and.returnValue(null);
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const result = authGuard.canActivate();

    expect(result).toBe(mockUrlTree);
    expect(sessionServiceSpy.getUserData).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});

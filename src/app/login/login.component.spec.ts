import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSessionService: jasmine.SpyObj<SessionService>;

  beforeEach(async () => {
    // Crear mocks para las dependencias
    mockLoginService = jasmine.createSpyObj('LoginService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSessionService = jasmine.createSpyObj('SessionService', [
      'setUserData',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule], // Importar el módulo necesario
      providers: [
        { provide: LoginService, useValue: mockLoginService }, // Proveer el mock de LoginService
        { provide: Router, useValue: mockRouter }, // Proveer el mock de Router
        { provide: SessionService, useValue: mockSessionService }, // Proveer el mock de SessionService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login service on valid form submission', () => {
    const mockResponse = {
      error: false,
      mensaje: '',
      data: { token: 'abc123' },
    };
    mockLoginService.login.and.returnValue(of(mockResponse));

    // Configurar valores válidos en el formulario
    component.loginForm.setValue({ user: 'testUser', password: 'testPass' });

    component.onSubmit();

    expect(mockLoginService.login).toHaveBeenCalledWith('testUser', 'testPass');
    expect(mockSessionService.setUserData).toHaveBeenCalledWith(mockResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/principal']);
    expect(component.errorMessage).toBeNull();
  });

  it('should set error message on login failure', () => {
    const mockResponse = { error: true, mensaje: 'Invalid credentials' };
    mockLoginService.login.and.returnValue(of(mockResponse));

    // Configurar valores válidos en el formulario
    component.loginForm.setValue({ user: 'testUser', password: 'wrongPass' });

    component.onSubmit();

    expect(mockLoginService.login).toHaveBeenCalledWith(
      'testUser',
      'wrongPass'
    );
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should set error message on login error', () => {
    const mockError = new Error('Network error');
    mockLoginService.login.and.returnValue(throwError(() => mockError));

    // Configurar valores válidos en el formulario
    component.loginForm.setValue({ user: 'testUser', password: 'testPass' });

    component.onSubmit();

    expect(mockLoginService.login).toHaveBeenCalledWith('testUser', 'testPass');
    expect(component.errorMessage).toBe(
      'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.'
    );
  });
});

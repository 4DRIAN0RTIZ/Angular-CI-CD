import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { SessionService } from './services/session.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockSessionService: jasmine.SpyObj<SessionService>;

  beforeEach(async () => {
    // Crear un mock para SessionService
    mockSessionService = jasmine.createSpyObj('SessionService', ['userData$']);
    mockSessionService.userData$ = of(null); // Simular que no hay datos de usuario

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet, MenuComponent, CommonModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'erp-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('erp-app');
  });

  it('should render the menu visibility based on user data', () => {
    // Simular que el usuario está autenticado
    mockSessionService.userData$ = of({ name: 'Test User' });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.isMenuVisible).toBeTrue();
  });
});

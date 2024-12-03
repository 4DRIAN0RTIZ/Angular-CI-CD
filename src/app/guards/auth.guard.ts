import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userData = this.sessionService.getUserData();

    if (userData) {
      return true; // Usuario autenticado
    } else {
      // Redirigir al login si no hay sesión activa
      return this.router.createUrlTree(['/login']);
    }
  }
}

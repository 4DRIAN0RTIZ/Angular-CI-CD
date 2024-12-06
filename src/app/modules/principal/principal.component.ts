import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  userData: any = null;
  encryptedToken: string = '';
  decryptedToken: string = '';

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit() {
    const data = this.sessionService.getUserData();
    if (data) {
      console.log('Datos de usuario:', data);
      this.userData = data.decryptedToken;
      this.encryptedToken = data.encryptedToken;
      this.decryptedToken = JSON.stringify(data.decryptedToken);

      // Validar sesión con los datos del token
      this.validateSession();
    } else {
      // Si no hay datos, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  validateSession() {
    if (this.userData && this.userData.login && this.userData.token) {
      this.sessionService
        .validateSession(this.userData.login, '1.0.0', this.userData.token)
        .subscribe(
          (response) => {
            console.log('Sesión válida:', response);
          },
          (error) => {
            console.error('Error al validar la sesión:', error);
            this.logout();
          }
        );
    } else {
      console.error('Datos de usuario incompletos para validar la sesión');
      this.logout();
    }
  }

  logout() {
    this.sessionService.clearUserData();
    this.router.navigate(['/login']);
  }
}

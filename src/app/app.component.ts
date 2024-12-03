import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { SessionService } from './services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isMenuVisible = false;
  userData: any = null;

  constructor(private sessionService: SessionService) {
    this.sessionService.userData$.subscribe((data) => {
      console.log('Datos emitidos desde SessionService:', data);
      console.log('Valor inicial de isMenuVisible:', this.isMenuVisible);
      this.userData = data;
      this.isMenuVisible = data != null;
      console.log('Valor actualizado de isMenuVisible:', this.isMenuVisible);
    });
  }

  title = 'erp-app';
}

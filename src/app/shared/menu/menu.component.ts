import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { HoverDropdownDirective } from '../../directives/app-hover-dropdown.directive';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [HoverDropdownDirective],
})
export class MenuComponent {
  constructor(private router: Router, private sessionService: SessionService) {}

  logout() {
    this.sessionService.clearUserData();
    this.router.navigate(['/login']);
  }
}

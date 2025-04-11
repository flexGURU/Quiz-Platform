import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-admin-menubar',
  imports: [MenubarModule],
  templateUrl: './admin-menubar.component.html',
  styleUrl: './admin-menubar.component.css',
})
export class AdminMenubarComponent {
  baseUrl = '/admin/';
  items = [
    {
      label: 'User Management',
      routerLink: `${this.baseUrl}` + 'manage-users',
      styleClass: 'menu-link',
    },
    {
      label: 'Student Violations',
      styleClass: 'menu-link',
      routerLink: `${this.baseUrl}` + 'violations',
    },
  ];
}

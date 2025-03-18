import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [MenubarModule, CommonModule],
})
export class NavComponent {
  items = [
    {
      label: 'Learning Management System',
     
    },
    
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  
  logout = () => {
    console.log('Logging out...');
  };
  

  
}


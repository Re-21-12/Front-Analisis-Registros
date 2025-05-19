import { Component, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-primary-layout',
  imports: [ MatSidenavModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './primary-layout.component.html',
  styleUrl: './primary-layout.component.scss'
})
export class PrimaryLayoutComponent {
 sidenav = viewChild<MatSidenav>("sidenav")
 // Trae inicialmente como falso
   showHeader = input<boolean>();
   showFooter = input<boolean>();
   showSidebar = input<boolean>();

     isSidebarOpen = true; // Estado para el two-way binding de [(opened)]
       year = new Date().getFullYear();
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = '01Blog';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Synchronize authenticated session with backend to verify ban status and freshest profile
    if (this.authService.isLoggedIn()) {
      this.authService.verifySession().subscribe();
    }

    // Scroll window back to top on each page navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
}


/* --- DEFAULTS IMPORTS --- */
import { Component, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */

/* Router */
import { Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';

/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-emp-navbar',
  templateUrl: './emp-navbar.component.html',
  styleUrls: ['./emp-navbar.component.css'],
})
export class EmpNavbarComponent implements OnInit {
  constructor(
    private authenticatorService: AuthenticationService,
    private router: Router,
    private verifySessionService: VerifySessionService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.verifySessionService.resetSession().subscribe((response) => {
      if (response.status === 'OK') {
        this.authenticatorService.clearSessionStorage();

        this.router.navigate(['/employee']);
      }
    });
  }
}

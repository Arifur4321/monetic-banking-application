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
  selector: 'app-mrc-navbar',
  templateUrl: './mrc-navbar.component.html',
  styleUrls: ['./mrc-navbar.component.css'],
})
export class MrcNavbarComponent implements OnInit {
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

        this.router.navigate(['/merchant']);
      }
    });
  }
}

/* Default Imports */
import { Component, OnInit } from '@angular/core';

import { ActivationEnd, Router } from '@angular/router';
import { HttpCancelService } from './services/http/http-cancel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'vouchainclient';

  constructor(
    private httpCancelService: HttpCancelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.httpCancelService.cancelPendingRequests();
      }
    });
  }
}

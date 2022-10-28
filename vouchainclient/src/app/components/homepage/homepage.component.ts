import { OnDestroy } from '@angular/core';
/* Default Imports */
import { Component, OnInit } from '@angular/core';
declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {

  /* Values */
  homepage: string = environment.homeUrl;

  constructor() {}

  /* TODO: Codice per impostare la lingua con ngx-translate */
  /*   constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  } */

  ngOnInit(): void {
    $('body').css('background-color', '#fbf8f3');
  }

  ngOnDestroy(): void {
    $('body').css('background-color', '#2c61f1');
  }
}

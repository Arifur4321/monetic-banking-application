/* Default Imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/* Components Imports */
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SessionManagerComponent } from './components/session-manager/session-manager.component';
import { UserChangePswComponent } from './components/user-change-psw/user-change-psw.component';
import { UserPasswordRecoveryComponent } from './components/user-password-recovery/user-password-recovery.component';
import { UserResetPasswordComponent } from './components/user-reset-password/user-reset-password.component';

/* Modules Imports */
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule , FormBuilder } from '@angular/forms';
 

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { SharedModule } from './modules/shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

/* Serivces Imports */
import { HttpInterceptorService } from './services/http/http-interceptor.service';
import { RouteGuardService } from './services/route-guard.service';
import { BsTooltipsDirective } from './directives/bs-tooltips.directive';

/* ngx-translate Http Loader */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomepageComponent,
    NotFoundComponent,
    SessionManagerComponent,
    UserChangePswComponent,
    UserPasswordRecoveryComponent,
    UserResetPasswordComponent,
    BsTooltipsDirective,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    SharedModule,
  
    
    TranslateModule.forRoot({
      defaultLanguage: 'it',
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      },
    }),
  ],
  providers: [
    RouteGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
})
export class AppModule {}

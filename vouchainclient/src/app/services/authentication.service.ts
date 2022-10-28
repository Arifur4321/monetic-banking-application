/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { HttpHeaders } from '@angular/common/http';
import { SessionTokenDTO } from '../model/session-token-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  forceUpdate: string;
  sessionId: string;

  constructor() {
    this.sessionId = this.generateAlphaNumericString();
    /* console.log('Session ID --->>> ' + this.sessionId); */
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }

  generateAlphaNumericString(): string {
    let count = 32;
    const ALPHA_NUMERIC_STRING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let builder = '';
    while (count-- !== 0) {
      let randomIndex = .9 * ALPHA_NUMERIC_STRING.length;
      builder += ALPHA_NUMERIC_STRING.charAt(randomIndex);
    }
    return builder;
  }

  getCpyHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.cpyHeader),
      CacheControl: 'no-cache',
    });
    
    return headers;

  }

  getEmpHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.empHeader),
      CacheControl: 'no-cache',
    });

    return headers;
  }

  getFirstSessionToken(username: string, forceUpdate: string): SessionTokenDTO {
    let sessionToken: SessionTokenDTO = new SessionTokenDTO();

    sessionToken.username = username;
    sessionToken.sessionId = this.sessionId;
    sessionToken.forceUpdate = forceUpdate;

    /* console.log('sessionToken>>>>>>>>>>>>');
    console.log(sessionToken); */

    return sessionToken;
  }

  getLoggedUserEmail() {
    let email = sessionStorage.getItem('Email');

    return sessionStorage.getItem('Email') != null ? email : '';
  }

  getLoggedUserId() {
    let userId = sessionStorage.getItem('UserId');

    return sessionStorage.getItem('UserId') != null ? userId : '';
  }

  getMrcHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.mrcHeader),
      CacheControl: 'no-cache',
    });

    return headers;
  }

  getProfile() {
    let profile = sessionStorage.getItem('Profile');

    return sessionStorage.getItem('Profile') != null ? profile : '';
  }

  getResetToken(username?: string): SessionTokenDTO {
    let sessionToken: SessionTokenDTO = new SessionTokenDTO();

    if (username) {
      sessionToken.username = username;
    } else {
      sessionToken.username = this.getLoggedUserEmail();
    }

    sessionToken.sessionId = '';
    sessionToken.forceUpdate = 'true';

    return sessionToken;
  }

  getSessionId() {
    return sessionStorage.getItem('SessionId');
  }

  getSessionToken(): SessionTokenDTO {
    let sessionToken: SessionTokenDTO = new SessionTokenDTO();

    sessionToken.username = this.getLoggedUserEmail();
    sessionToken.sessionId = this.getSessionId();
    sessionToken.forceUpdate = 'false';

    return sessionToken;
  }

  getTransactionHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.trcHeader),
      CacheControl: 'no-cache',
    });

    return headers;
  }

  getUsrHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.usrHeader),
      CacheControl: 'no-cache',
    });

    return headers;
  }

  getVoucherHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: 'Basic ' + window.btoa(myGlobals.vchHeader),
      CacheControl: 'no-cache',
    });

    return headers;
  }

  isLogged() {
    return sessionStorage.getItem('UserId') != null ? true : false;
  }

  setEmailSession(email: string) {
    sessionStorage.setItem('Email', email);
  }

  setProfile(profile: string) {
    sessionStorage.setItem('Profile', profile);
  }

  setSessionId() {
    sessionStorage.setItem('SessionId', this.sessionId);
  }

  setUserSession(userId: string) {
    sessionStorage.setItem('UserId', userId);
  }
}

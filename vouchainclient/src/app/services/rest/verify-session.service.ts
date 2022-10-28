/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import { SessionTokenDTO } from './../../model/session-token-dto';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerifySessionService {
  /* Headers */
  private headers = this.authenticatorService.getUsrHeader();

  /* REST URI Endpoint */
  private restResetSessionUrl: string;
  private restVerifySessionUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restResetSessionUrl = environment.basicUrl + myGlobals.resetSession;
    this.restVerifySessionUrl = environment.basicUrl + myGlobals.verifySession;
  }

  forceUpdateSession(username: string) {
    let sessionToken = this.authenticatorService.getFirstSessionToken(
      username,
      'true'
    );

    return this.httpClient.post<SimpleResponseDTO>(
      this.restResetSessionUrl,
      sessionToken,
      { headers: this.headers }
    );
  }

  resetSession(username?: string) {
    let sessionToken: SessionTokenDTO;

    if (username) {
      sessionToken = this.authenticatorService.getResetToken(username);
    } else {
      sessionToken = this.authenticatorService.getResetToken();
    }

    return this.httpClient.post<SimpleResponseDTO>(
      this.restResetSessionUrl,
      sessionToken,
      { headers: this.headers }
    );
  }

  verifySession(sessionTokenDto: SessionTokenDTO) {
    return this.httpClient.post<SimpleResponseDTO>(
      this.restVerifySessionUrl,
      sessionTokenDto,
      { headers: this.headers }
    );
  }
}

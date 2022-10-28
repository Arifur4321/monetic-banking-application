/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import { PasswordDTO } from './../../model/password-dto';
import { SimpleResponseDTO } from './../../model/simple-response-dto';
import { UserSimpleDto } from 'src/app/model/user-simple-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPasswordRecoveryService {
  private restChangePassUrl: string;
  private restForgotPassUrl: string;
  private restModifyPassUrl: string;
  private user: UserSimpleDto = new UserSimpleDto();

  constructor(
    private httpClient: HttpClient,
    private authenticatorService: AuthenticationService
  ) {
    this.restChangePassUrl = environment.basicUrl + myGlobals.usrReplacePwd;
    this.restForgotPassUrl = environment.basicUrl + myGlobals.usrChangePwd;
    this.restModifyPassUrl = environment.basicUrl + myGlobals.usrModifyPwd;
  }

  passChange(passwordDTO: PasswordDTO) {
    let headers = this.authenticatorService.getUsrHeader();

    return this.httpClient.post<SimpleResponseDTO>(
      this.restChangePassUrl,
      passwordDTO,
      { headers }
    );
  }

  passModify(resetCode: string, password: string) {
    let headers = this.authenticatorService.getUsrHeader();
    this.user.usrPassword = password;

    return this.httpClient.post<SimpleResponseDTO>(
      this.restModifyPassUrl + '/' + resetCode,
      this.user,
      { headers }
    );
  }

  passRecoveryEmail(email: string, profile: string) {
    let headers = this.authenticatorService.getUsrHeader();
    this.user.usrEmail = email;

    return this.httpClient.post<SimpleResponseDTO>(
      this.restForgotPassUrl + '/' + profile,
      this.user,
      { headers }
    );
  }
}

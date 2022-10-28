/*  Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpShowProfileService {
  private restModifyProfileUrl: string;
  private restShowProfileUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restModifyProfileUrl = environment.basicUrl + myGlobals.empModProfile;
    this.restShowProfileUrl = environment.basicUrl + myGlobals.empShowProfile;
  }

  empModifyProfile(newEmployeeDto: EmployeeDTO) {
    let headers = this.authenticatorService.getEmpHeader();

    return this.httpClient.post<EmployeeDTO>(
      this.restModifyProfileUrl,
      newEmployeeDto,
      { headers }
    );
  }

  getProfileDetails(usrId: string) {
    let headers = this.authenticatorService.getEmpHeader();

    return this.httpClient.get<EmployeeDTO>(
      this.restShowProfileUrl + '/' + usrId,
      { headers }
    );
  }

  getShowProfile() {
    let headers = this.authenticatorService.getEmpHeader();

    return this.httpClient.get<EmployeeDTO>(
      this.restShowProfileUrl +
        '/' +
        this.authenticatorService.getLoggedUserId(),
      { headers }
    );
  }
}

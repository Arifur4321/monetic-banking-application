/* Default Imports */
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
export class EmpLoginService {
  private restLoginUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restLoginUrl = environment.basicUrl + myGlobals.empLogin;
  }
  
  authLoginEmp(employeeDTO: EmployeeDTO) {
    let headers = this.authService.getEmpHeader();

    return this.httpClient.post<EmployeeDTO>(this.restLoginUrl, employeeDTO, {
      headers,
    });
  }
}

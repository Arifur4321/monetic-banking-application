import { Component, OnInit } from '@angular/core';

import { EmployeeDTO } from 'src/app/model/employee-dto';
import { EmpInvitationcodeService } from '../../services/rest/emp-invitationcode.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as myMessages from 'src/globals/messages';
import { ValidatorService } from 'src/app/services/validator.service';

/* Environment */
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-emp-invitationcode',
  templateUrl: './emp-invitationcode.component.html',
  styleUrls: ['./emp-invitationcode.component.css']
})
export class EmpInvitationcodeComponent implements OnInit {

  /* Errors */
  errorNotMatch: boolean = false;
  errorGeneric: boolean = false;
  errorUsed: boolean = false;

  /* Models */
  employeeDTO: EmployeeDTO;

  /* Invitation code */
  invitationCode: string;

  /* Link Homepage */
  homepage: string = environment.homeUrl;

  constructor(
    private empInvitationcodeServ: EmpInvitationcodeService,
    private route: Router,
    private validatorService: ValidatorService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    /* Get code from url */
    this.invitationCode = this.activateRoute.snapshot.queryParamMap.get("invite_code");
  }

  createEmpDTO() {
    let employeeDTO: EmployeeDTO = new EmployeeDTO();
    employeeDTO.empInvitationCode = this.invitationCode;
    return employeeDTO;
  }


  /* Submit the invitation code  */
  isValideCode(invitationCode: string) {
    /* Reset errors alerts */
    this.errorNotMatch = false;
    this.errorGeneric = false;
    /* Assign the invitation code to simple EmployeeDTO  */
    this.employeeDTO = this.createEmpDTO();
    this.empInvitationcodeServ.checkInvitationCode(invitationCode)
      .subscribe((response) => {
        /* Assign the response to a EmployeeDTO variable */
        this.employeeDTO = response;
        /* Check if the account is active */
        if (this.employeeDTO.empCheckedLogin === 'false') {
          /* Check response status */
          if (this.employeeDTO.status === 'OK') {
            /* Navigate user to Signup */
            this.route.navigate(['employee/empSignup'], { state: { employee: this.employeeDTO } });
          } else if (this.employeeDTO.errorDescription === myMessages.noUserFound) {
            this.errorNotMatch = true;
          } else {
            this.errorGeneric = true;
          }
        } else {
          this.errorUsed = true;
        }
      }, (error) => {
        this.errorGeneric = true;
      });
  }
}

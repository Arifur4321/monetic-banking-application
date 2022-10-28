import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../../../../services/authentication.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { ValidatorService } from 'src/app/services/validator.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

/* FontAwesome */
import {
  faArrowLeft,
  faArrowRight,
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { EmpShowProfileService } from '../../services/rest/emp-show-profile.service';
import { Router } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-emp-modify-profile',
  templateUrl: './emp-modify-profile.component.html',
  styleUrls: ['./emp-modify-profile.component.css'],
})
export class EmpModifyProfileComponent implements OnInit, OnDestroy {
  /* FontAwesome Icons */
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;

  /* flag per button */
  btnModificaProfilo: boolean = true;
  btnApplicaModicfiche: boolean = false;

  /* info company profile */
  userId: string;
  email: string;
  emailOk: boolean = false;

  /* --- FORM VALUES --- */

  /* First & Last Name */
  firstNameRef: string;
  firstNameRefOk: boolean = true;
  lastNameRef: string;
  lastNameRefOk: boolean = true;

  /* Matricola */
  matricola: string;

  /* Models */

  empDTO: EmployeeDTO;
  employeeDTO: EmployeeDTO;
  employeeDTOInit: EmployeeDTO;

  /* message */
  errorMsg: string = '';
  okMsg: string = 'Modifica effettuata con successo!';

  isNotModified: boolean = false;

  constructor(
    private validatorService: ValidatorService,
    private empShowProfileService: EmpShowProfileService,
    private authenticatorService: AuthenticationService,
    private modalManager: ModalsManagerService,
    private route: Router
  ) {
    this.empShowProfileService.getShowProfile().subscribe((response) => {
      this.employeeDTO = response;
      this.employeeDTOInit = response;

      this.userId = this.authenticatorService.getLoggedUserId();
      this.firstNameRef = this.employeeDTO.empFirstName;
      this.lastNameRef = this.employeeDTO.empLastName;
      this.matricola = this.employeeDTO.empMatricola;
      this.email = this.employeeDTO.usrEmail;
    });
  }

  ngOnInit(): void {
    $('input').attr('readonly', true);

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* --- VALIDATIONS --- */

  /* Just check if the value is not empty */
  checkFirstNameRef() {
    this.firstNameRefOk = this.validatorService.isNotEmpty(this.firstNameRef);
  }

  /* Just check if the value is not empty */
  checkLastNameRef() {
    this.lastNameRefOk = this.validatorService.isNotEmpty(this.lastNameRef);
  }

  checkForm(): boolean {
    /* Validate Reference tab inputs */
    this.checkFirstNameRef();
    this.checkLastNameRef();

    /* Return complete validation checks */
    return (
      /* this.emailOk && */
      this.firstNameRefOk && this.lastNameRefOk
    );
  }

  /* Create a CompanyDTO Object using the form's inputs values */
  createEmpDTO() {
    let employeeDTO: EmployeeDTO = new EmployeeDTO();
    employeeDTO.usrId = this.userId;
    employeeDTO.usrEmail = this.email;
    employeeDTO.empFirstName = this.firstNameRef;
    employeeDTO.empLastName = this.lastNameRef;
    employeeDTO.empMatricola = this.matricola;

    return employeeDTO;
  }

  /* onClick button modificaProfilo */
  modifyField(inputName: string) {
    $('#v-pills-tabContent input,select').each(function () {
      if ($(this).attr('name') === inputName) {
        $(this).removeClass('readonly');
        $(this).addClass('modifiable');
        $(this).attr('readonly', false);
        $(this).attr('disabled', false);
        $('#emp-mod-profile-btn-annulla').attr('disabled', false);
        $('#emp-mod-profile-btn-apply').attr('disabled', false);
      }
    });
  }

  /* Undo changes */
  undoModify() {
    this.firstNameRef = this.employeeDTOInit.empFirstName;
    this.lastNameRef = this.employeeDTOInit.empLastName;
    this.matricola = this.employeeDTOInit.empMatricola;

    $('input').addClass('readonly');
    $('input').removeClass('modifiable');
    $('input').attr('readonly', true);
    $('#emp-mod-profile-btn-annulla').attr('disabled', true);
    $('#emp-mod-profile-btn-apply').attr('disabled', true);

    this.checkForm();
    this.cancelAlertNotModified();
  }

  /* Check modify */
  checkModify() {
    if (
      this.employeeDTOInit.empMatricola !== this.matricola ||
      this.employeeDTOInit.empFirstName !== this.firstNameRef ||
      this.employeeDTOInit.empLastName !== this.lastNameRef
    ) {
      this.isNotModified = false;

      return true;
    } else {
      this.isNotModified = true;
      return false;
    }
  }

  cancelAlertNotModified() {
    this.isNotModified = false;
  }

  /* Submit Form */
  onFormSubmit() {
    if (this.checkModify()) {
      if (this.checkForm()) {
        this.empShowProfileService
          .empModifyProfile(this.createEmpDTO())
          .subscribe(
            (response) => {
              if (response.status === 'OK') {
                $('input').addClass('readonly');
                $('input').removeClass('modifiable');
                $('input').attr('readonly', true);

                this.isNotModified = false;
                $('#emp-mod-profile-btn-annulla').attr('disabled', true);
                $('#emp-mod-profile-btn-apply').attr('disabled', true);

                /* Show Success Order Modal */
                this.modalManager.successModalGeneric(
                  'Modifica effettuata con successo!',
                  'Modifica effettuata, controllare il tuo Profilo', '/VouChain/employee/empDashboard/overview'
                );

                this.employeeDTOInit = response;
              } else {
                this.modalManager.errorsModalGeneric(
                  'Errore',
                  'ERRORS.GENERIC'
                );
              }
            }, (error) => {
              this.modalManager.errorsModalGeneric(
                'Errore',
                'ERRORS.GENERIC'
              );
            });
          } else {
            this.modalManager.errorsModalGeneric(
              'Errore',
              'Campi modificati non validi'
            );
          }
    }
  }
}

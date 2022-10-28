import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CpyEmployeesComponent } from './cpy-employees.component';

import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import * as myMessages from 'src/globals/messages';

//Utility
import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

//Models
import { DTOList } from 'src/app/model/dto-list';
import { EmployeeDTO } from 'src/app/model/employee-dto';

//Services
import { CpyInviteEmployeeService } from '../../services/rest/cpy-invite-employee.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { CpyShowEmployeesService } from '../../services/rest/cpy-show-employees.service';
import { Router } from '@angular/router';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

describe('CpyEmployeesComponent', () => {
  let component: CpyEmployeesComponent;
  let fixture: ComponentFixture<CpyEmployeesComponent>;
  let validatorService: ValidatorService;
  let cpyShowEmpService: CpyShowEmployeesService;
  let helper: Helper;
  let translate: TranslateTestingUtility<CpyEmployeesComponent>;
  let modalManager: ModalsManagerService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyEmployeesComponent],
      imports:
        [imports,
          NgxPaginationModule,
          FormsModule
        ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyEmployeesComponent);
    component = fixture.componentInstance;
    validatorService = fixture.debugElement.injector.get(ValidatorService);
    cpyShowEmpService = fixture.debugElement.injector.get(CpyShowEmployeesService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    helper = new Helper();
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('employee table', () => {
    let employeeList_table;
    let spy;

    beforeEach(() => {
      employeeList_table = new DTOList<EmployeeDTO>();
      spy = spyOn(cpyShowEmpService, 'showEmployeesList').and.returnValue(of(employeeList_table));
    });

    it('should display 3 lines if there are 3 employees', () => {
      employeeList_table.list = helper.createEmployeeArray(3);
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 employees', () => {
      employeeList_table.list = helper.createEmployeeArray(5);
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let next = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should display 5 lines if there are more than 5 employees', () => {
      employeeList_table.list = helper.createEmployeeArray(8);
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);

    });

    it('next button should be enabled if there are more than 5 employees', () => {
      employeeList_table.list = helper.createEmployeeArray(8);
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no employees', () => {
      employeeList_table.list = new Array();
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no employees', () => {
      employeeList_table.list = new Array();
      employeeList_table.status = "OK";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.EMPLOYEES.TABLE_EMPTY);
    });

    it('should display one row if response is negative', () => {
      employeeList_table.list = new Array();
      employeeList_table.status = "KO";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if response is negative', () => {
      employeeList_table.list = new Array();
      employeeList_table.status = "KO";
      component.showEmployeesList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

  });

  it('should display the correct message if an error occours', () => {
    let spy = spyOn(cpyShowEmpService, 'showEmployeesList').and.returnValue((throwError({ status: 404 })));
    component.showEmployeesList();
    fixture.detectChanges();
    let table = fixture.debugElement.query(By.css('tbody'));
    let row = table.query(By.css('tr'));
    let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
    expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
  });

  it('should check all boxes if clicked (checkboxClickCheckAll)', () => {
    let checkAll: HTMLInputElement = fixture.debugElement.query(By.css('#cpy-employee-check-all')).nativeElement;
    checkAll.click();
    let c = 0;
    let checks = fixture.debugElement.queryAll(By.css('.form-check-input'));
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].nativeElement.checked = true) {
        c++;
      } else {
        break;
      }
    }
    expect(c).toBe(checks.length);
  });

  describe('validation has effect', () => {

    it('mail field should have is-valid class with valid mail (checkEmpEmail)', () => {
      let spy = spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      component.checkEmpEmail();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empEmail" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('mail field should have is-invalid class with invalid mail (checkEmpEmail)', () => {
      let spy = spyOn(validatorService, 'isValidEmail').and.returnValue(false);
      component.checkEmpEmail();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empEmail" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('first name field should have is-valid class with valid name (checkEmpFirstName)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      component.checkEmpFirstName();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empFirstName" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('first name field should have is-valid class with valid name (checkEmpFirstName)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(false);
      component.checkEmpFirstName();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empFirstName" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('last name field should have is-valid class with valid name (checkEmpLastName)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      component.checkEmpLastName();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empLastName" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('last name field should have is-valid class with valid name (checkEmpLastName)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(false);
      component.checkEmpLastName();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empLastName" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('mat field should have is-valid class with valid name (checkEmpMatricola)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      component.checkEmpMatricola();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empMatricola" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('mat field should have is-valid class with valid name (checkEmpMatricola)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty').and.returnValue(false);
      component.checkEmpMatricola();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "empMatricola" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('checkInviteForm() should return true if validators return true', () => {
      let spyMail = spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      let spyEmpty = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      expect(component.checkInviteForm()).toBeTruthy();
    });

    it('checkInviteForm() should return false if some validator return false', () => {
      let spyMail = spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      let spyEmpty = spyOn(validatorService, 'isNotEmpty').and.returnValue(false);
      expect(component.checkInviteForm()).toBeFalsy();
    });

    it('checkInviteForm() should return false if some validator return false', () => {
      let spyMail = spyOn(validatorService, 'isValidEmail').and.returnValue(false);
      let spyEmpty = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      expect(component.checkInviteForm()).toBeFalsy();
    });

  });

  describe('onSubmitSendVouchers', () => {
    let router: Router;

    beforeEach(() => {
      router = TestBed.get(Router);
    });

    it('should navigate to vouchers if there are selected employees', () => {
      component.selectedEmployees = new Set<EmployeeDTO>();
      component.selectedEmployees.add(new EmployeeDTO());
      let spy = spyOn(router, 'navigate');
      component.onSubmitSendVouchers();

      expect(spy).toHaveBeenCalledWith(['company/cpyDashboard/vouchers'], {
        state: { checkedEmps: component.selectedEmployees }
      })
    });

    it('should call error modal with right message if there are no selected employees', () => {
      let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
      component.selectedEmployees = new Set<EmployeeDTO>();
      component.onSubmitSendVouchers();

      expect(spy).toHaveBeenCalledWith('MODALS.HEADER.EMPLOYEES.ERRORS.SEND_VOUCHERS_TITLE',
        'ERRORS.NO_EMP_SELECTED');
    });

  });

  describe('onSubmitInviteForm', () => {
    let cpyInviteEmpService: CpyInviteEmployeeService;
    let modal : HTMLElement;
    let empList : DTOList<EmployeeDTO>;

    beforeEach(() => {
      cpyInviteEmpService = fixture.debugElement.injector.get(CpyInviteEmployeeService);
      modal = fixture.debugElement.query(By.css('#cpy-employees-modal-new-employee')).nativeElement;
      empList = new DTOList<EmployeeDTO>();
      spyOn(component, 'checkInviteForm').and.returnValue(true);
    });

    it('should show correct modal if response is OK', () => {
      empList.status = 'OK';
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      let spy = spyOn(modalManager, 'successModalGeneric');
      spyOn(component, 'showEmployeesList');
      component.onSubmitInviteForm();

      expect(spy).toHaveBeenCalledWith(
        'Invito Beneficiario',
        "Beneficiario invitato con successo. <br>È stata inviata una mail all'indirizzo specificato con un codice di invito, utile all'attivazione del profilo."
      );
    });

    it('should refresh employee list if response is OK', () => {
      empList.status = 'OK';
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      spyOn(modalManager, 'successModalGeneric');
      let spy = spyOn(component, 'showEmployeesList');
      component.onSubmitInviteForm();

      expect(spy).toHaveBeenCalled();
    });

    it('should hide current modal if response is OK', () => {
      empList.status = 'OK';
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      spyOn(modalManager, 'successModalGeneric');
      spyOn(component, 'showEmployeesList');
      component.onSubmitInviteForm();

      expect(modal).not.toHaveClass('show');
    });

    it('should call correct error modal if response is not OK and error is email already exist', () => {
      empList.status = 'KO';
      empList.errorDescription = myMessages.emailAlreadyExist;
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      let spy = spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(spy).toHaveBeenCalledWith(
        'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
        'ERRORS.EMAIL_ALREADY_EXIST'
      );
    });

    it('should hide current modal if response is not OK and error is email already exist', () => {
      empList.status = 'KO';
      empList.errorDescription = myMessages.emailAlreadyExist;
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(modal).not.toHaveClass('show');
    });

    it('should call correct error modal if response is not OK', () => {
      empList.status = 'KO';
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      let spy = spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(spy).toHaveBeenCalledWith(
          'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
          'ERRORS.GENERIC'
      );
    });

    it('should hide current modal if response is not OK', () => {
      empList.status = 'KO';
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue(of(empList));
      spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(modal).not.toHaveClass('show');
    });

    it('should call correct error modal if response is an error', () => {
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue((throwError({ status: 404 })));
      let spy = spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(spy).toHaveBeenCalledWith(
          'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
          'ERRORS.GENERIC'
      );
    });
    
    it('should hide current modal if response is an error', () => {
      spyOn(cpyInviteEmpService, 'inviteEmployee').and.returnValue((throwError({ status: 404 })));
      spyOn(component, 'createErrorModal');
      component.onSubmitInviteForm();

      expect(modal).not.toHaveClass('show');
    });

  });

});
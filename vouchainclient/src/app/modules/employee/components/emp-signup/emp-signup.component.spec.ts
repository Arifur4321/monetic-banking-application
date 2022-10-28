import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';

import { EmpSignupComponent } from './emp-signup.component';
import { imports, Helper } from 'src/test-utility/test-utilities';
import { Router } from '@angular/router';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { RouterTestingModule } from '@angular/router/testing';
import { EmpDashboardComponent } from '../emp-dashboard/emp-dashboard.component';
import { By } from '@angular/platform-browser';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { EmpSignupService } from '../../services/rest/emp-signup.service';
import { of, throwError } from 'rxjs';
import * as $ from 'jquery';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmpSignupComponent', () => {
  let component: EmpSignupComponent;
  let fixture: ComponentFixture<EmpSignupComponent>;
  let translate: TranslateTestingUtility<EmpSignupComponent>;
  let helper: Helper;
  let empSignupService: EmpSignupService;
  let router;
  let emp;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmpSignupComponent],
      imports: [
        imports,
        RouterTestingModule.withRoutes([
          { path: 'employee', component: EmpDashboardComponent }
        ])
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSignupComponent);
    router = TestBed.get(Router);
    emp = new EmployeeDTO();
    emp.errorDescription = null;
    emp.status = null;
    emp.usrId = '2';
    emp.usrBchAddress = '';
    emp.usrPrivateKey = '';
    emp.usrEmail = 'prova@email.it';
    emp.usrPassword = '123456Aa';
    emp.usrActive = '';
    emp.empFirstName = 'ProvaNome';
    emp.empLastName = 'ProvaCognome';
    emp.empMatricola = '123456';
    emp.empInvitationCode = 'STFWCQ9PY2';
    emp.empCheckedLogin = 'false';
    emp.cpyUsrId = '1';
    
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    empSignupService = fixture.debugElement.injector.get(EmpSignupService);
    component = fixture.componentInstance;
    component.employeeToSignup = emp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormSubmit', () => {
    let spyCheck;
    let modal;
    let error;

    beforeEach(() => {
      translate.updateTranslation();
      modal = fixture.debugElement.query(By.css('#modalConfirmSignup'));
      error = fixture.debugElement.query(By.css('#msgErrorAlert'));
      spyCheck = spyOn(component, 'checkForm').and.returnValue(true);
      fixture.detectChanges();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('if status is ok modal body should be correct', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue(of(emp))
      emp.status = 'OK';
      component.onFormSubmit();
      fixture.detectChanges();
      let text = modal.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual((translate.IT.SIGNUP.MODAL.RESPONSE_BODY_EMP_OK).replace(/ <br>/g, "\n"));
    });

    it('if status is ok login button should be enabled and with correct text', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue(of(emp))
      emp.status = 'OK';
      let button: HTMLButtonElement = fixture.debugElement.query(By.css('#btn-modal-close')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.GO_LOGIN);
      expect(button.disabled).toBeFalsy();
    });

    it('if status is not ok error should be visible', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue(of(emp))
      emp.status = 'KO';
      component.onFormSubmit();
      fixture.detectChanges();

      expect($('#msgErrorAlert').is(':visible')).toBeTruthy();
    });

    it('if status is not ok message body should be correct', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue(of(emp))
      emp.status = 'KO';
      component.onFormSubmit();
      fixture.detectChanges();
      let text = error.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('if status is not ok button should be enabled and with correct text', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue(of(emp))
      emp.status = 'KO';
      let button: HTMLButtonElement = error.query(By.css('button')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
      expect(button.disabled).toBeFalsy();
    });

    it('if  service return an error, error body should be correct', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue((throwError({ status: 404 })));
      component.onFormSubmit();
      fixture.detectChanges();
      let text = modal.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('if service return an error, retry button should be enabled and with correct text', () => {
      spyOn(empSignupService, 'employeeSignup').and.returnValue((throwError({ status: 404 })));
      let button: HTMLButtonElement = modal.query(By.css('button')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
      expect(button.disabled).toBeFalsy();
    });

  });

  describe('goLogin', () => {

    it('should call navigate for "employee/empLogin" if confirmation is successful', () => {
      component.signupOk = true;
      spyOn(router, 'navigate');
      component.goLogin();

      expect(router.navigate).toHaveBeenCalledWith(['employee/empLogin']);
    });

    it('should hide modal if confirmation is successful', fakeAsync(() => {
      let modal = fixture.debugElement.query(By.css('#modalConfirmSignup')).nativeElement;
      spyOn(router, 'navigate');
      component.signupOk = true;
      component.goLogin();
      tick(1000);
      fixture.detectChanges();

      expect(modal).not.toHaveClass('show');
    }));

    it('should hide modal if confirmation is NOT successful', fakeAsync(() => {
      let modal = fixture.debugElement.query(By.css('#modalConfirmSignup')).nativeElement;
      component.signupOk = false;
      component.goLogin();
      tick(1000);
      fixture.detectChanges();

      expect(modal).not.toHaveClass('show');
    }));
  });

});

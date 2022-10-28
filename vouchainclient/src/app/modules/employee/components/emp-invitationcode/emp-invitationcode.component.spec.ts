import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { EmpInvitationcodeComponent } from './emp-invitationcode.component';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { imports } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import * as myMessages from 'src/globals/messages';

import { EmpInvitationcodeService } from '../../services/rest/emp-invitationcode.service';

import { EmployeeDTO } from 'src/app/model/employee-dto';

describe('EmpInvitationcodeComponent', () => {
  let component: EmpInvitationcodeComponent;
  let fixture: ComponentFixture<EmpInvitationcodeComponent>;
  let translate: TranslateTestingUtility<EmpInvitationcodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmpInvitationcodeComponent],
      imports: [
        imports
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpInvitationcodeComponent);
    component = fixture.componentInstance;
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create empDTO', () => {
    let expEmp = new EmployeeDTO();
    expEmp.empInvitationCode = 'STFWCQ9PY2';
    component.invitationCode = 'STFWCQ9PY2';
    expect(component.createEmpDTO()).toEqual(expEmp);
  });

  describe('isValideCode', () => {
    let empInvitationcodeServ;
    let empDTO;

    beforeEach(() => {
      empInvitationcodeServ = fixture.debugElement.injector.get(EmpInvitationcodeService);
      empDTO = new EmployeeDTO();
    });

    it('should navigate to empSignup if response is OK', () => {
      empDTO.status = 'OK';
      empDTO.empCheckedLogin = 'false';
      let router = TestBed.get(Router);
      let spy = spyOn(router, 'navigate');
      spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(of(empDTO));
      component.isValideCode('STFWCQ9PY2');

      expect(spy).toHaveBeenCalledWith(['employee/empSignup'], { state: { employee: component.employeeDTO } })
    });

    it('should display error if status is KO', () => {
      empDTO.status = 'KO';
      empDTO.empCheckedLogin = 'false';
      spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(of(empDTO));
      component.isValideCode('STFWCQ9PY2');
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#emp-invitation-code-error'));

      expect(component.errorGeneric).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display an error if empCheckedLogin is true', () => {
      empDTO.empCheckedLogin = 'true';
      spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(of(empDTO));
      component.isValideCode('STFWCQ9PY2');
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#emp-invitation-code-error-ut'));

      expect(component.errorUsed).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display an error if status is KO and errorDescription is noUserFound', () => {
      empDTO.status = 'KO';
      empDTO.empCheckedLogin = 'false';
      empDTO.errorDescription = myMessages.noUserFound;
      spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(of(empDTO));
      component.isValideCode('STFWCQ9PY2');
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#emp-incorrect-invitation-code'));

      expect(component.errorNotMatch).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display the correct message if status is KO and errorDescription is noUserFound', () => {
      empDTO.status = 'KO';
      empDTO.errorDescription = myMessages.noUserFound;
      empDTO.empCheckedLogin = 'false';
      spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(of(empDTO));
      component.isValideCode('STFWCQ9PY2');
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#emp-incorrect-invitation-code'));

      expect(element.nativeElement.innerText).toEqual(translate.IT.ERRORS.INCORRECT_INVITATION_CODE);
    });

    it('should display the correct message if an error occurs', () => {
      let spy = spyOn(empInvitationcodeServ, 'checkInvitationCode').and.returnValue(throwError({status: 404}));
      component.isValideCode('STFWCQ9PY2');
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#emp-invitation-code-error'));

      expect(element.nativeElement.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

  });
});

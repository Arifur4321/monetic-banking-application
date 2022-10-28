import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { UserResetPasswordComponent } from './user-reset-password.component';
import { imports } from 'src/test-utility/test-utilities';
import { ValidatorService } from 'src/app/services/validator.service';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { By } from '@angular/platform-browser';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { of, throwError } from 'rxjs';
import * as $ from 'jquery';

describe('UserResetPasswordComponent', () => {
  let component: UserResetPasswordComponent;
  let fixture: ComponentFixture<UserResetPasswordComponent>;
  let validatorService: ValidatorService;
  let translate: TranslateTestingUtility<UserResetPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserResetPasswordComponent],
      imports: [
        imports
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResetPasswordComponent);
    component = fixture.componentInstance;
    validatorService = fixture.debugElement.injector.get(ValidatorService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validator has effect', () => {

    it('password field should have is-valid class with field not empty (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isValidPassword').and.returnValue(true);
      component.checkPassword();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "password" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('password field should have is-invalid class with empty field (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isValidPassword').and.returnValue(false);
      component.checkPassword();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "password" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('password field should have is-valid class with field not empty (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isValidPassRe').and.returnValue(true);
      component.checkPasswordRetype();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "retype" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('password field should have is-invalid class with empty field (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isValidPassRe').and.returnValue(false);
      component.checkPasswordRetype();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "retype" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });
  });

  describe('onSubmitPass', () => {
    describe('pass and passRe true', () => {

      it('password not ok', () => {
        component.password = 'prova';
        component.passwordRe = 'Prova1234';
        spyOn(validatorService, 'isValidPassword').and.returnValue(false);
        spyOn(validatorService, 'isValidPassRe').and.returnValue(true);
        component.onSubmitPass();
        fixture.detectChanges();
        let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

        expect(element.innerText).toEqual(translate.IT.ERRORS.PASSWORD_SINTAX);
      });

      it('retype password not ok', () => {
        component.password = 'Prova1234';
        component.passwordRe = 'prova';
        spyOn(validatorService, 'isValidPassword').and.returnValue(true);
        spyOn(validatorService, 'isValidPassRe').and.returnValue(false);
        component.onSubmitPass();
        fixture.detectChanges();
        let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

        expect(element.innerText).toEqual(translate.IT.ERRORS.PASSWORD_RETYPE);
      });

      it('both not ok', () => {
        component.password = 'prova';
        component.passwordRe = 'prova';
        spyOn(validatorService, 'isValidPassword').and.returnValue(false);
        spyOn(validatorService, 'isValidPassRe').and.returnValue(false);
        component.onSubmitPass();
        fixture.detectChanges();
        let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

        expect(element.innerText).toEqual(translate.IT.ERRORS.PASSWORD_SINTAX);
      });

      describe('password and retype password are ok', () => {
        let pswService : UserPasswordRecoveryService;
        let res : SimpleResponseDTO;

        beforeEach(() => {
          res = new SimpleResponseDTO();
          pswService = fixture.debugElement.injector.get(UserPasswordRecoveryService);
          component.password = 'Prova1234';
          component.passwordRe = 'Prova1234';
          spyOn(validatorService, 'isValidPassword').and.returnValue(true);
          spyOn(validatorService, 'isValidPassRe').and.returnValue(true);
        });

        it('should show password message modal and hide the form if response is ok', () => {
          spyOn(pswService, 'passModify').and.returnValue(of(res));
          res.status = 'OK';
          component.onSubmitPass();
          fixture.detectChanges();

          expect($('#modifyPassForm').is(':visible')).toBeFalsy();
          expect($('#ModifyPasswordMessage').is(':visible')).toBeTruthy();
        });

        it('should display an error when status is not OK', () => {
          spyOn(pswService, 'passModify').and.returnValue(of(res));
          res.status = 'KO';
          component.onSubmitPass();
          fixture.detectChanges();
          let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
  
          expect(element.innerText).toEqual(translate.IT.ERRORS.GENERIC);
        });

        it('should display the correct error when status is not OK and error is not validated', () => {
          spyOn(pswService, 'passModify').and.returnValue(of(res));
          res.status = 'KO';
          res.errorDescription = 'login_not_validated';
          component.onSubmitPass();
          fixture.detectChanges();
          let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
  
          expect(element.innerText).toEqual(translate.IT.ERRORS.PASSWORD);
        });

        it('should display the correct error when status is not OK and error is no user found', () => {
          spyOn(pswService, 'passModify').and.returnValue(of(res));
          res.status = 'KO';
          res.errorDescription = 'no_user_found';
          component.onSubmitPass();
          fixture.detectChanges();
          let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
  
          expect(element.innerText).toEqual(translate.IT.ERRORS.RESET_CODE);
        });

        it('should display the correct error when status is not OK and error is no user found', () => {
          spyOn(pswService, 'passModify').and.returnValue(throwError({ status: 404 }));
          component.onSubmitPass();
          fixture.detectChanges();
          let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
  
          expect(element.innerText).toEqual(translate.IT.ERRORS.GENERIC);
        });

        
      });

    });

    it('password or password retype not entered', () => {
      component.password = '';
      component.passwordRe = '';
      component.onSubmitPass();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

      expect(element.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

  });

});

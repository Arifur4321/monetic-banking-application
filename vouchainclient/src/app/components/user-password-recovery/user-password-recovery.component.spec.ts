import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { UserPasswordRecoveryComponent } from './user-password-recovery.component';
import { imports } from 'src/test-utility/test-utilities';
import { ValidatorService } from 'src/app/services/validator.service';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { throwError, of } from 'rxjs';
import * as $ from 'jquery';
import { By } from '@angular/platform-browser';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { Router } from '@angular/router';

describe('UserPasswordRecoveryComponent', () => {
  let component: UserPasswordRecoveryComponent;
  let fixture: ComponentFixture<UserPasswordRecoveryComponent>;
  let validatorService : ValidatorService;
  let pswService : UserPasswordRecoveryService;
  let translate : TranslateTestingUtility<UserPasswordRecoveryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserPasswordRecoveryComponent],
      imports: [
        imports
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordRecoveryComponent);
    component = fixture.componentInstance;
    validatorService= fixture.debugElement.injector.get(ValidatorService);
    pswService= fixture.debugElement.injector.get(UserPasswordRecoveryService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('backToLogin', () => {
    it('should /company/cpyLogin', () => {
      component.profile = 'company';
      component.backToLogin();
      expect(component.urlLogin).toEqual("/company/cpyLogin");
    });

    it('should /employee/empLogin', () => {
      component.profile = 'employee';
      component.backToLogin();
      expect(component.urlLogin).toEqual("/employee/empLogin");
    });

    it('should /merchant/mrcLogin', () => {
      component.profile = 'merchant';
      component.backToLogin();
      expect(component.urlLogin).toEqual("/merchant/mrcLogin");
    });
  });

  describe('onSubmitEmail', () => {
    let res;
    
    beforeEach(() => {
      res = new SimpleResponseDTO();
      component.email = 'prova@mail.it';
      spyOn(validatorService, 'isValidEmail').and.returnValue(true);
    });

    it('should show recovery message and hide the form if status is OK', () => {
      spyOn(pswService, 'passRecoveryEmail').and.returnValue(of(res));
      res.status = 'OK';
      component.onSubmitEmail();

      expect($('#forgotPassForm').is(':visible')).toBeFalsy();
      expect($('#RecoveryMessage').is(':visible')).toBeTruthy();
    });

    it('should show the correct message if status is not OK', () => {
      spyOn(pswService, 'passRecoveryEmail').and.returnValue(of(res));
      res.status = 'KO';
      component.onSubmitEmail();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

      expect(element.innerText).toEqual(translate.IT.ERRORS.EMAIL_NOT_EXIST);
    });

    it('should show the correct message if response is an error', () => {
      spyOn(pswService, 'passRecoveryEmail').and.returnValue(throwError({ status: 404 }));
      component.onSubmitEmail();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;

      expect(element.innerText).toEqual(translate.IT.ERRORS.EMAIL_NOT_EXIST);
    });

    it('should show the correct error message if there isn\'t an email', () => {
      component.email = undefined;
      component.onSubmitEmail();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
      expect(element.innerText).toEqual(translate.IT.ERRORS.EMAIL_NOT_EXIST);
    });

  });

  it('(onSubmitEmail) should show the correct error message if email is not valid', () => {
    component.email = 'prova@mail.it';
    spyOn(validatorService, 'isValidEmail').and.returnValue(false);
    component.onSubmitEmail();
    translate.updateTranslation();
    let element = fixture.debugElement.query(By.css('#errorDescription')).nativeElement;
    expect(element.innerText).toEqual(translate.IT.ERRORS.EMAIL_SINTAX);
  });

  it('should navigate to the homepage', ()=> {
    let router = TestBed.get(Router);
    let spy = spyOn(router, 'navigate');
    component.onClickHomeButton();

    expect(spy).toHaveBeenCalledWith(['/externalRedirect', { externalUrl: component.homepage }]);
  });
});

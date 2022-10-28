import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { UserChangePswComponent } from './user-change-psw.component';

import { FormsModule } from '@angular/forms';
import { Router, Navigation } from '@angular/router';
import { imports } from 'src/test-utility/test-utilities';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { By } from '@angular/platform-browser';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('UserChangePswComponent', () => {
  let component: UserChangePswComponent;
  let fixture: ComponentFixture<UserChangePswComponent>;
  let router : Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserChangePswComponent],
      imports:
        [imports,
         FormsModule
        ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    let nav : Navigation = {id:null, initialUrl:null, extractedUrl:null, previousNavigation:null, trigger:null,
     extras: {
      state:{
        profile:'company'
      }
    }
  };
    router = TestBed.get(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue(nav);
    fixture = TestBed.createComponent(UserChangePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('profile = company', () => {
    beforeEach(() => {
      component.profile = 'company';
      component.setUri();
    });

    it('dashboard = company dashboard', () => {
      expect(component.uriDashboard).toEqual('/company/cpyDashboard/');
    });

    it('login = company login', () => {
      expect(component.uriLogin).toEqual('/company/cpyLogin');
    });

    it('signup = company signup', () => {
      expect(component.uriSignup).toEqual('/company/cpySignup');
    });
  });

  describe('profile = employee', () => {
    beforeEach(() => {
      component.profile = 'employee';
      component.setUri();
    });

    it('dashboard = employee dashboard', () => {
      expect(component.uriDashboard).toEqual('/employee/empDashboard/');
    });

    it('login = employee login', () => {
      expect(component.uriLogin).toEqual('/employee/empLogin');
    });

    it('signup = employee signup', () => {
      expect(component.uriSignup).toEqual('/employee/empSignup');
    });
  });

  describe('profile = merchant', () => {
    beforeEach(() => {
      component.profile = 'merchant';
      component.setUri();
    });

    it('dashboard = merchant dashboard', () => {
      expect(component.uriDashboard).toEqual('/merchant/mrcDashboard/');
    });

    it('login = merchant login', () => {
      expect(component.uriLogin).toEqual('/merchant/mrcLogin');
    });

    it('signup = merchant signup', () => {
      expect(component.uriSignup).toEqual('/merchant/mrcSignup');
    });
  });

  describe('onSubmitChangePswForm', () => {
    let eModal;
    let eElement :HTMLElement;

    beforeEach(() => {
      let authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
      spyOn(authenticatorService, 'getLoggedUserId')
      eModal = fixture.debugElement.query(By.css('#modalModifyErrors')).nativeElement;
      eElement = fixture.debugElement.query(By.css('#modalBody')).nativeElement;
    });

    describe('checks on password are ok', () => {
      let res;
      let pswService: UserPasswordRecoveryService;

      beforeEach(() => {
        pswService = fixture.debugElement.injector.get(UserPasswordRecoveryService);
        spyOn(component, 'checkChangePswForm').and.returnValue(true);
        res = new SimpleResponseDTO();
      });

      it('should show modal if status is ok', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(of(res));
        res.status = 'OK'
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();
        let modal = fixture.debugElement.query(By.css('#modalModifyOK')).nativeElement;

        expect(modal).toHaveClass('show');
      }));

      it('should show the correct message if status is ok', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(of(res));
        res.status = 'OK'
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();
        let element = fixture.debugElement.queryAll(By.css('#modalBody'))[1].nativeElement;
        
        expect(element.innerText).toEqual('Modifica effettuata con successo!');
      }));

      it('should show modal if status is not ok', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(of(res));
        res.status = 'KO';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eModal).toHaveClass('show');
      }));

      it('should show the correct message if status is not ok', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(of(res));
        res.status = 'KO';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eElement.innerText).toEqual('Si è verificato un errore, riprovare!');
      }));

      it('should show modal if response is an error', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(throwError({ status: 404 }));
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eModal).toHaveClass('show');
      }));

      it('should show the correct message if response is an error', fakeAsync(() => {
        spyOn(pswService, 'passChange').and.returnValue(throwError({ status: 404 }));
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eElement.innerText).toEqual('Si è verificato un errore, riprovare!');
      }));

    });

    describe('checks on password are false', () => {

      beforeEach(() => {
        spyOn(component, 'checkChangePswForm').and.returnValue(false);
      });

      it('should show error modal if old password and new password are the same', fakeAsync(() => {
        component.oldPassword = 'Aabcd1234';
        component.newPassword = 'Aabcd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();
         

        expect(eModal).toHaveClass('show');
      }));

      it('should show correct message if old password and new password are the same', fakeAsync(() => {
        component.oldPassword = 'Aabcd1234';
        component.newPassword = 'Aabcd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();
         

        expect(eElement.innerText).toEqual('La vecchia e la nuova password non devono coincidere!');
      }));


      it('should show modal if passwords doesn\'t match', fakeAsync(() => {
        component.newPassword = 'Aabcd1234';
        component.reNewPassword = 'Bbacd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eModal).toHaveClass('show');
      }));

      it('should show the correct message if passwords doesn\'t match ', fakeAsync(() => {
        component.newPassword = 'Aabcd1234';
        component.reNewPassword = 'Bbacd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eElement.innerText).toEqual('Le password devono coincidere!');
      }));

      it('should show modal if it\'s none of the above', fakeAsync(() => {
        component.oldPassword = 'Aabcd4567';
        component.newPassword = 'Aabcd1234';
        component.reNewPassword = 'Aabcd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eModal).toHaveClass('show');
      }));

      it('should show the correct message if it\'s none of the above', fakeAsync(() => {
        component.oldPassword = 'Aabcd4567';
        component.newPassword = 'Aabcd1234';
        component.reNewPassword = 'Aabcd1234';
        component.onSubmitChangePswForm();
        tick(500);
        fixture.detectChanges();

        expect(eElement.innerText).toEqual('Si è verificato un errore, riprovare!');
      }));

    });
  });

  it('should navigate to the homepage', ()=> {
    let spy = spyOn(router, 'navigate');
    component.onClickHomeButton();

    expect(spy).toHaveBeenCalledWith(['/externalRedirect', { externalUrl: component.homepage }]);
  });
  
});

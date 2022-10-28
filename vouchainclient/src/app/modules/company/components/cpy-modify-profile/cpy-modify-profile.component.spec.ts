import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CpyModifyProfileComponent } from './cpy-modify-profile.component';

import { imports } from 'src/test-utility/test-utilities';
import { CompanyDTO } from 'src/app/model/company-dto';
import { CpyShowProfileService } from '../../services/rest/cpy-show-profile.service';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { By } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CpyModifyProfileComponent', () => {
  let component: CpyModifyProfileComponent;
  let fixture: ComponentFixture<CpyModifyProfileComponent>;
  let cpyProfileService: CpyShowProfileService;
  let modalManager: ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyModifyProfileComponent],
      imports: [
        imports
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyModifyProfileComponent);
    component = fixture.componentInstance;
    cpyProfileService = fixture.debugElement.injector.get(CpyShowProfileService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('methods with cpyDTO', () => {
    let cDtoPrep: CompanyDTO = new CompanyDTO();

    beforeEach(() => {
      cDtoPrep.usrEmail = "mail@provider.it";
      cDtoPrep.cpyPec = "mail@provider.it";
      cDtoPrep.usrId = '1';
      cDtoPrep.cpyCodiceFiscale = "DSNCLD93L46H501R";
      cDtoPrep.cpyPartitaIva = '07643520567';
      cDtoPrep.cpyFirstNameRef = "ProvaNome";
      cDtoPrep.cpyLastNameRef = "ProvaCognome";
      cDtoPrep.cpyPhoneNoRef = "123456789";
      cDtoPrep.cpyCuu = "00125a";
      cDtoPrep.cpyRagioneSociale = "ProvaRagione";
      cDtoPrep.cpyAddress = "via prova, 23";
      cDtoPrep.cpyCity = "Roma";
      cDtoPrep.cpyProv = "RM";
      cDtoPrep.cpyZip = "00100";
    });

    it('should show the right company', () => {
      let cpyProfileService2 = TestBed.get(CpyShowProfileService);
      let auth = TestBed.get(AuthenticationService);
      spyOn(cpyProfileService2, 'getShowProfile').and.returnValue(of(cDtoPrep));
      spyOn(auth, 'getLoggedUserId').and.returnValue('1');

      let fixture2 = TestBed.createComponent(CpyModifyProfileComponent);
      let component = fixture2.componentInstance;
      fixture2.detectChanges();

      expect(component.companyDTO).toEqual(cDtoPrep);
      expect(component.companyDTOInit).toEqual(cDtoPrep);

      expect(component.pec).toEqual(cDtoPrep.cpyPec);
      expect(component.cFiscale).toEqual(cDtoPrep.cpyCodiceFiscale);
      expect(component.pIva).toEqual(cDtoPrep.cpyPartitaIva);
      expect(component.firstNameRef).toEqual(cDtoPrep.cpyFirstNameRef);
      expect(component.lastNameRef).toEqual(cDtoPrep.cpyLastNameRef);
      expect(component.phoneRef).toEqual(cDtoPrep.cpyPhoneNoRef);
      expect(component.cuu).toEqual(cDtoPrep.cpyCuu);
      expect(component.ragSociale).toEqual(cDtoPrep.cpyRagioneSociale);
      expect(component.address).toEqual(cDtoPrep.cpyAddress);
      expect(component.citySelect).toEqual(cDtoPrep.cpyCity);
      expect(component.provSelect).toEqual(cDtoPrep.cpyProv);
      expect(component.cap).toEqual(cDtoPrep.cpyZip);

    });

    it('should create the right company (createCpyDTO)', () => {
      component.email = "mail@provider.it"
      component.pec = "mail@provider.it";
      component.userId = '1';
      component.cFiscale = "DSNCLD93L46H501R";
      component.pIva = '07643520567';
      component.firstNameRef = "ProvaNome";
      component.lastNameRef = "ProvaCognome";
      component.phoneRef = "123456789";
      component.cuu = "00125a";
      component.ragSociale = "ProvaRagione";
      component.address = "via prova, 23";
      component.citySelect = "Roma";
      component.provSelect = "RM";
      component.cap = "00100";

      expect(component.createCpyDTO()).toEqual(cDtoPrep);
    });

    it('should reset the changes', () => {
      component.companyDTOInit = cDtoPrep;

      component.pec = "mail@prr.it";
      component.cFiscale = "DSNCLD93L46H501I";
      component.pIva = '076435205679';
      component.firstNameRef = "Prova";
      component.lastNameRef = "Prova";
      component.phoneRef = "12345678910";
      component.cuu = "00126a";
      component.ragSociale = "Prova";
      component.address = "via provaprova, 23";
      component.citySelect = "Frosinone";
      component.provSelect = "Frosinone, FR";
      component.cap = "00700";

      component.undoModify();

      expect(component.pec).toEqual(cDtoPrep.cpyPec);
      expect(component.cFiscale).toEqual(cDtoPrep.cpyCodiceFiscale);
      expect(component.pIva).toEqual(cDtoPrep.cpyPartitaIva);
      expect(component.firstNameRef).toEqual(cDtoPrep.cpyFirstNameRef);
      expect(component.lastNameRef).toEqual(cDtoPrep.cpyLastNameRef);
      expect(component.phoneRef).toEqual(cDtoPrep.cpyPhoneNoRef);
      expect(component.cuu).toEqual(cDtoPrep.cpyCuu);
      expect(component.ragSociale).toEqual(cDtoPrep.cpyRagioneSociale);
      expect(component.address).toEqual(cDtoPrep.cpyAddress);
      expect(component.citySelect).toEqual(cDtoPrep.cpyCity);
      expect(component.provSelect).toEqual(cDtoPrep.cpyProv);
      expect(component.cap).toEqual(cDtoPrep.cpyZip);
    });

    describe('onFormSubmit', () => {

      it('should show correct message if checkForm return false', fakeAsync(() => {
        spyOn(component, 'checkModify').and.returnValue(true);
        spyOn(component, 'checkForm').and.returnValue(false);
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

      describe('if everything is ok', () => {
        beforeEach(() => {
          spyOn(component, 'checkModify').and.returnValue(true);
          spyOn(component, 'checkForm').and.returnValue(true);
          cDtoPrep.status = "OK";
          spyOn(cpyProfileService, 'cpyModifyProfile').and.returnValue(of(cDtoPrep));
        });

        it('should call for the success modal', () => {
          let modalService: ModalsManagerService = TestBed.get(ModalsManagerService);
          let spy = spyOn(modalService, 'successModalGeneric');
          component.onFormSubmit();

          expect(spy).toHaveBeenCalled();
        });

        it('should replace init DTO', () => {
          component.onFormSubmit();

          expect(component.companyDTOInit).toEqual(cDtoPrep);
        });
        
        it('should make fields not editable', fakeAsync(() => {
          component.onFormSubmit();
          tick(100);
          fixture.detectChanges();
          let inputs = fixture.debugElement.queryAll(By.css('input'));
          for (let i = 0; i < inputs.length; i++) {
            expect(inputs[i].nativeElement).toHaveClass('readonly')
            expect(inputs[i].nativeElement).not.toHaveClass('modifiable');
            expect(inputs[i].nativeElement.readOnly).toBeTruthy();
          }
        }));

      });

      it('should display the correct message if response is negative', fakeAsync(() => {
        spyOn(component, 'checkModify').and.returnValue(true);
        spyOn(component, 'checkForm').and.returnValue(true);
        cDtoPrep.status = "KO";
        spyOn(cpyProfileService, 'cpyModifyProfile').and.returnValue(of(cDtoPrep));
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

      it('should display the correct message if an error occours', fakeAsync(() => {
        spyOn(component, 'checkModify').and.returnValue(true);
        spyOn(component, 'checkForm').and.returnValue(true);
        spyOn(cpyProfileService, 'cpyModifyProfile').and.returnValue(throwError({ status: 404 }));
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

    });

  });

  it('modifyField', () => {
    let input = 'ragSociale';
    let element: HTMLInputElement = fixture.debugElement.query((de) => { return de.nativeElement.name === input }).nativeElement;
    component.modifyField(input);
    expect(element).toHaveClass("modifiable");
    expect(element.readOnly).toBeFalsy();
    expect(element.disabled).toBeFalsy();
  });

});

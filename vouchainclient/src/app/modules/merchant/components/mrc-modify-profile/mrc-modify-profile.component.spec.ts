import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { MrcModifyProfileComponent } from './mrc-modify-profile.component';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { imports } from 'src/test-utility/test-utilities';

import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

import { MerchantDTO } from 'src/app/model/merchant-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MrcModifyProfileComponent', () => {
  let component: MrcModifyProfileComponent;
  let fixture: ComponentFixture<MrcModifyProfileComponent>;
  let mrcProfileService: MrcShowProfileService;
  let modalManager: ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MrcModifyProfileComponent],
      imports: [
        imports
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcModifyProfileComponent);
    component = fixture.componentInstance;
    mrcProfileService = fixture.debugElement.injector.get(MrcShowProfileService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('methods with mrcDTO', () => {
    let mDtoPrep: MerchantDTO = new MerchantDTO();

    beforeEach(() => {
      mDtoPrep.usrEmail = "mail@provider.it";
      mDtoPrep.usrId = '1';
      mDtoPrep.mrcCodiceFiscale = "DSNCLD93L46H501R";
      mDtoPrep.mrcPartitaIva = '07643520567';
      mDtoPrep.mrcFirstNameRef = "ProvaNome";
      mDtoPrep.mrcLastNameRef = "ProvaCognome";
      mDtoPrep.mrcPhoneNo = "123456789";
      mDtoPrep.mrcRagioneSociale = "ProvaRagione";
      mDtoPrep.mrcAddress = "via prova, 23";
      mDtoPrep.mrcCity = "Roma";
      mDtoPrep.mrcProv = "RM";
      mDtoPrep.mrcZip = "00100";

      mDtoPrep.usrPassword = 'Abcdd12345';
      mDtoPrep.mrcOfficeName = 'ProvaNomeUfficio';
      mDtoPrep.mrcAddressOffice = 'via Napoli, 3';
      mDtoPrep.mrcProvOffice = 'RM'
      mDtoPrep.mrcCityOffice = 'Roma';
      mDtoPrep.mrcPhoneNoOffice = '987654321';
      mDtoPrep.mrcFirstNameReq = 'ProvaNomeReq';
      mDtoPrep.mrcLastNameReq = 'ProvaCognomeReq';
      mDtoPrep.mrcRoleReq = 'Amministratore';
      mDtoPrep.mrcIban = 'GB33BUKB20201555555555';
      mDtoPrep.mrcBank = 'Banca del sapone di Marsiglia';
    });

    it('should show the right merchant', () => {
      let mrcProfileService2 = TestBed.get(MrcShowProfileService);
      let auth = TestBed.get(AuthenticationService);
      spyOn(mrcProfileService2, 'getShowProfile').and.returnValue(of(mDtoPrep));
      spyOn(auth, 'getLoggedUserId').and.returnValue('1');

      let fixture2 = TestBed.createComponent(MrcModifyProfileComponent);
      let component = fixture2.componentInstance;
      fixture2.detectChanges();

      expect(component.merchantDTO).toEqual(mDtoPrep);
      expect(component.merchantDTOInit).toEqual(mDtoPrep);

      expect(component.codFis).toEqual(mDtoPrep.mrcCodiceFiscale);
      expect(component.pIva).toEqual(mDtoPrep.mrcPartitaIva);
      expect(component.firstNameRef).toEqual(mDtoPrep.mrcFirstNameRef);
      expect(component.lastNameRef).toEqual(mDtoPrep.mrcLastNameRef);
      expect(component.telephone).toEqual(mDtoPrep.mrcPhoneNo);
      expect(component.ragSociale).toEqual(mDtoPrep.mrcRagioneSociale);
      expect(component.address).toEqual(mDtoPrep.mrcAddress);
      expect(component.city).toEqual(mDtoPrep.mrcCity);
      expect(component.province).toEqual(mDtoPrep.mrcProv);
      expect(component.cap).toEqual(mDtoPrep.mrcZip);

      expect(component.password).toEqual(mDtoPrep.usrPassword);
      expect(component.officeName).toEqual(mDtoPrep.mrcOfficeName);
      expect(component.addressOffice).toEqual(mDtoPrep.mrcAddressOffice);
      expect(component.provOffice).toEqual(mDtoPrep.mrcProvOffice);
      expect(component.cityOffice).toEqual(mDtoPrep.mrcCityOffice);
      expect(component.phoneNoOffice).toEqual(mDtoPrep.mrcPhoneNoOffice);
      expect(component.firstNameReq).toEqual(mDtoPrep.mrcFirstNameReq);
      expect(component.lastNameReq).toEqual(mDtoPrep.mrcLastNameReq);
      expect(component.roleReq).toEqual(mDtoPrep.mrcRoleReq);
      expect(component.iban).toEqual(mDtoPrep.mrcIban);
      expect(component.bank).toEqual(mDtoPrep.mrcBank);

    });

    it('should create the right merchant (createMrcDTO)', () => {
      component.email = "mail@provider.it"
      component.userId = '1';
      component.codFis = "DSNCLD93L46H501R";
      component.pIva = '07643520567';
      component.firstNameRef = "ProvaNome";
      component.lastNameRef = "ProvaCognome";
      component.telephone = "123456789";
      component.ragSociale = "ProvaRagione";
      component.address = "via prova, 23";
      component.city = "Roma";
      component.province = "RM";
      component.cap = "00100";

      component.password = 'Abcdd12345';
      component.officeName = 'ProvaNomeUfficio';
      component.addressOffice = 'via Napoli, 3';
      component.provOffice = 'RM'
      component.cityOffice = 'Roma';
      component.phoneNoOffice = '987654321';
      component.firstNameReq = 'ProvaNomeReq';
      component.lastNameReq = 'ProvaCognomeReq';
      component.roleReq = 'Amministratore';
      component.iban = 'GB33BUKB20201555555555';
      component.bank = 'Banca del sapone di Marsiglia';

      expect(component.createMrcDTO()).toEqual(mDtoPrep);
    });

    it('should reset the changes', () => {
      component.merchantDTOInit = mDtoPrep;

      component.codFis = "DSNCLD93L46H501I";
      component.pIva = '076435205679';
      component.firstNameRef = "Prova";
      component.lastNameRef = "Prova";
      component.telephone = "12345678910";
      component.ragSociale = "Prova";
      component.address = "via provaprova, 23";
      component.city = "Frosinone";
      component.province = "Frosinone, FR";
      component.cap = "00700";
      component.officeName = 'ProvaNomeUfficioCambiato';
      component.addressOffice = 'via Genova, 3';
      component.provOffice = 'TO'
      component.cityOffice = 'Torino';
      component.phoneNoOffice = '12345987';
      component.firstNameReq = 'ProvaNomeReqCambiato';
      component.lastNameReq = 'ProvaCognomeReqCambiato';
      component.roleReq = 'NonAmministratore';
      component.iban = 'GB94BARC10201530093459';
      component.bank = 'Banca del sapone di Palermo';

      component.undoModify();

      expect(component.codFis).toEqual(mDtoPrep.mrcCodiceFiscale);
      expect(component.pIva).toEqual(mDtoPrep.mrcPartitaIva);
      expect(component.firstNameRef).toEqual(mDtoPrep.mrcFirstNameRef);
      expect(component.lastNameRef).toEqual(mDtoPrep.mrcLastNameRef);
      expect(component.telephone).toEqual(mDtoPrep.mrcPhoneNo);
      expect(component.ragSociale).toEqual(mDtoPrep.mrcRagioneSociale);
      expect(component.address).toEqual(mDtoPrep.mrcAddress);
      expect(component.city).toEqual(mDtoPrep.mrcCity);
      expect(component.province).toEqual(mDtoPrep.mrcProv);
      expect(component.cap).toEqual(mDtoPrep.mrcZip);

      expect(component.officeName).toEqual(mDtoPrep.mrcOfficeName);
      expect(component.addressOffice).toEqual(mDtoPrep.mrcAddressOffice);
      expect(component.provOffice).toEqual(mDtoPrep.mrcProvOffice);
      expect(component.cityOffice).toEqual(mDtoPrep.mrcCityOffice);
      expect(component.phoneNoOffice).toEqual(mDtoPrep.mrcPhoneNoOffice);
      expect(component.firstNameReq).toEqual(mDtoPrep.mrcFirstNameReq);
      expect(component.lastNameReq).toEqual(mDtoPrep.mrcLastNameReq);
      expect(component.roleReq).toEqual(mDtoPrep.mrcRoleReq);
      expect(component.iban).toEqual(mDtoPrep.mrcIban);
      expect(component.bank).toEqual(mDtoPrep.mrcBank);
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
          mDtoPrep.status = "OK";
          spyOn(mrcProfileService, 'mrcModifyProfile').and.returnValue(of(mDtoPrep));
        });


        it('should call for the success modal', () => {
          let spy = spyOn(modalManager, 'successModalGeneric');
          component.onFormSubmit();
          expect(spy).toHaveBeenCalled();
        });

        it('should replace init DTO', () => {
          component.onFormSubmit();

          expect(component.merchantDTOInit).toEqual(mDtoPrep);
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
        mDtoPrep.status = "KO";
        spyOn(mrcProfileService, 'mrcModifyProfile').and.returnValue(of(mDtoPrep));
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

      it('should display the correct message if an error occours', fakeAsync(() => {
        spyOn(component, 'checkModify').and.returnValue(true);
        spyOn(component, 'checkForm').and.returnValue(true);
        spyOn(mrcProfileService, 'mrcModifyProfile').and.returnValue(throwError({ status: 404 }));
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

import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { EmpModifyProfileComponent } from './emp-modify-profile.component';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { imports } from 'src/test-utility/test-utilities';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { EmpShowProfileService } from '../../services/rest/emp-show-profile.service';

import { EmployeeDTO } from 'src/app/model/employee-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmpModifyProfileComponent', () => {
  let component: EmpModifyProfileComponent;
  let fixture: ComponentFixture<EmpModifyProfileComponent>;
  let empProfileService: EmpShowProfileService;
  let modalManager: ModalsManagerService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpModifyProfileComponent ],
      imports:[
        imports
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpModifyProfileComponent);
    component = fixture.componentInstance;
    empProfileService = fixture.debugElement.injector.get(EmpShowProfileService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('methods with employeeDTO', () => {
    let eDtoPrep: EmployeeDTO;

    beforeEach(() => {
      eDtoPrep = new EmployeeDTO();
      eDtoPrep.usrEmail = "mail@provider.it";
      eDtoPrep.usrId = '1';
      eDtoPrep.empFirstName = "ProvaNome";
      eDtoPrep.empLastName = "ProvaCognome";
      eDtoPrep.empMatricola = "123456";
    });

    it('should show the right employee', () => {
      let empProfileService2 = TestBed.get(EmpShowProfileService);
      let auth = TestBed.get(AuthenticationService);
      spyOn(empProfileService2, 'getShowProfile').and.returnValue(of(eDtoPrep));
      spyOn(auth, 'getLoggedUserId').and.returnValue('1');

      let fixture2 = TestBed.createComponent(EmpModifyProfileComponent);
      let component = fixture2.componentInstance;
      fixture2.detectChanges();

      expect(component.employeeDTO).toEqual(eDtoPrep);
      expect(component.employeeDTOInit).toEqual(eDtoPrep);

      expect(component.userId).toEqual(eDtoPrep.usrId);
      expect(component.matricola).toEqual(eDtoPrep.empMatricola);
      expect(component.firstNameRef).toEqual(eDtoPrep.empFirstName);
      expect(component.lastNameRef).toEqual(eDtoPrep.empLastName);
      expect(component.email).toEqual(eDtoPrep.usrEmail);
    });

    it('should create the right employee (createEmpDTO)', () => {
      component.email = "mail@provider.it"
      component.userId = '1';
      component.firstNameRef = "ProvaNome";
      component.lastNameRef = "ProvaCognome";
      component.matricola = '123456';

      expect(component.createEmpDTO()).toEqual(eDtoPrep);
    });

    it('should reset the changes', () => {
      component.employeeDTOInit = eDtoPrep;

      component.firstNameRef = "Prova";
      component.lastNameRef = "Prova";
      component.matricola = '000000';

      component.undoModify();

      expect(component.firstNameRef).toEqual(eDtoPrep.empFirstName);
      expect(component.lastNameRef).toEqual(eDtoPrep.empLastName);
      expect(component.matricola).toEqual(eDtoPrep.empMatricola);
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
          eDtoPrep.status = "OK";
          spyOn(empProfileService, 'empModifyProfile').and.returnValue(of(eDtoPrep));
        });

        it('should call for the success modal', () => {
          let spy = spyOn(modalManager, 'successModalGeneric');
          component.onFormSubmit();
          
          expect(spy).toHaveBeenCalled();
        });

        it('should replace init DTO', () => {
          component.onFormSubmit();

          expect(component.employeeDTOInit).toEqual(eDtoPrep);
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
        eDtoPrep.status = "KO";
        spyOn(empProfileService, 'empModifyProfile').and.returnValue(of(eDtoPrep));
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));


      it('should display the correct message if an error occours', fakeAsync(() => {
        spyOn(component, 'checkModify').and.returnValue(true);
        spyOn(component, 'checkForm').and.returnValue(true);
        spyOn(empProfileService, 'empModifyProfile').and.returnValue(throwError({ status: 404 }));
        let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
        component.onFormSubmit();
        tick(100);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

    });

  });

  it('modifyField', () => {
    let input = 'firstNameRef';
    let element: HTMLInputElement = fixture.debugElement.query((de) => { return de.nativeElement.name === input }).nativeElement;
    component.modifyField(input);
    expect(element).toHaveClass("modifiable");
    expect(element.readOnly).toBeFalsy();
    expect(element.disabled).toBeFalsy();
  });

  it('modifyField', () => {
    let input = 'lastNameRef';
    let element: HTMLInputElement = fixture.debugElement.query((de) => { return de.nativeElement.name === input }).nativeElement;
    component.modifyField(input);
    expect(element).toHaveClass("modifiable");
    expect(element.readOnly).toBeFalsy();
    expect(element.disabled).toBeFalsy();
  });

  it('modifyField', () => {
    let input = 'matricola';
    let element: HTMLInputElement = fixture.debugElement.query((de) => { return de.nativeElement.name === input }).nativeElement;
    component.modifyField(input);
    expect(element).toHaveClass("modifiable");
    expect(element.readOnly).toBeFalsy();
    expect(element.disabled).toBeFalsy();
  });

});

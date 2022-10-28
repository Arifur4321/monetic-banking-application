import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CpyVouchersComponent } from './cpy-vouchers.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { throwError, of } from 'rxjs';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { DTOList } from 'src/app/model/dto-list';
import { VoucherDTO } from 'src/app/model/voucher-dto';

import { CpyEmployeesComponent } from '../cpy-employees/cpy-employees.component';
import { CpyOverviewComponent } from '../cpy-overview/cpy-overview.component';

import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { Router } from '@angular/router';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { EmpVouchersService } from 'src/app/modules/employee/services/rest/emp-vouchers.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* jQuery */
declare var $: any;


describe('CpyVouchersComponent', () => {
  let component: CpyVouchersComponent;
  let fixture: ComponentFixture<CpyVouchersComponent>;
  let cpyVouchersService: CpyVouchersService;
  let modalManager: ModalsManagerService;
  let helper: Helper;
  let translate: TranslateTestingUtility<CpyVouchersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyVouchersComponent],
      imports: [
        imports,
        RouterTestingModule.withRoutes([
          {
            path: 'company/cpyDashboard',
            component: CpyOverviewComponent,
          },
          { path: 'employees', component: CpyEmployeesComponent },
        ]),
        NgxPaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyVouchersComponent);
    component = fixture.componentInstance;
    cpyVouchersService = fixture.debugElement.injector.get(CpyVouchersService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('voucher table', () => {
    it('should display 3 lines if there are 3 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(3);
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(5);
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(
        By.css('.pagination-next')
      ).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display five lines if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(
        By.css('.pagination-next')
      ).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should call info modals if there are more employee than vouchers', () => {
      component.selectedEmployees = helper.createEmployeeArray(10);
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(3);
      activeVouchers.status = 'OK';
      let spy = spyOn(modalManager, 'infoModalGeneric').and.callThrough();
      spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(
        'MODALS.HEADER.VOUCHERS.GENERIC.LIMITED_QUANTITY_TITLE',
        'MODALS.BODY.VOUCHERS.GENERIC.LIMITED_QUANTITY_BODY'
      );
    });

    it('should display one row if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = 'OK';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.TABLES.VOUCHERS.EMPTY_TABLE);
    });

    it('should display the correct message if response is negative', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = 'KO';
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        of(activeVouchers)
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(
        throwError({ status: 404 })
      );
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  it('should check all boxes if clicked (checkboxClickCheckAll)', () => {
    let checkAll: HTMLInputElement = fixture.debugElement.query(
      By.css('#cpy-vouchers-check-all')
    ).nativeElement;
    checkAll.click();
    let c = 0;
    let checks = fixture.debugElement.queryAll(By.css('.form-check-input'));
    for (let i = 0; i < checks.length; i++) {
      if ((checks[i].nativeElement.checked = true)) {
        c++;
      } else {
        break;
      }
    }
    expect(c).toBe(checks.length);
  });

  it('should show employees modal when employee button is clicked', fakeAsync(() => {
    let button = fixture.debugElement.query(
      By.css('#cpy-vouchers-selected-employees-button')
    ).nativeElement;
    let modal = fixture.debugElement.query(
      By.css('#cpy-vouchers-modal-employees')
    ).nativeElement;
    button.click();
    tick(100);
    fixture.detectChanges();
    expect(modal).toHaveClass('show');
  }));

  it('should convert correctly (idifyVoucherValueAndEndDate)', () => {
    let id = '20020201212';
    expect(component.idifyVoucherValueAndEndDate('2.00', '2020-12-12')).toEqual(
      id
    );
  });

  it('should add vouchers right (addAllocatedVouchersDTO)', () => {
    let vchDto: VoucherDTO = helper.createVoucherArray(1)[0];
    component.selectedQuantities.set('120201212', 1);
    component.addAllocatedVouchersDTO(vchDto);
    expect(component.allocatedVouchersDTO[0].vchName).toEqual(vchDto.vchName);
    expect(component.allocatedVouchersDTO[0].vchQuantity).toBe('1');
  });

  it('(addVoucherAllocationDTO)', () => {
    let allocationDTO: VoucherAllocationDTO = new VoucherAllocationDTO();
    let vouchers = helper.createVoucherArray(2);
    let empl = new EmployeeDTO();
    let authenticatorService: AuthenticationService = fixture.debugElement.injector.get(
      AuthenticationService
    );
    let spy = spyOn(authenticatorService, 'getLoggedUserId').and.returnValue(
      '1'
    );
    empl.usrId = '2';
    allocationDTO.fromId = '1';
    allocationDTO.profile = 'company';
    allocationDTO.toId = '2';
    allocationDTO.voucherList = vouchers;
    component.addVoucherAllocationDTO(vouchers, empl);

    expect(component.allocationsDTO[0]).toEqual(allocationDTO);
  });

  it('allocate vouchers button should be disabled when there are no selected vouchers', () => {
    let button: HTMLButtonElement = fixture.debugElement.query(
      By.css('#cpy-vouchers-allocate-vouchers-button')
    ).nativeElement;
    fixture.detectChanges();

    expect(button.disabled).toBeTruthy();
  });

  it('allocate vouchers button should not be disabled when there are selected vouchers', () => {
    let vch = helper.createVoucherArray(1)[0];
    component.selectedVouchers.add(vch);
    let button: HTMLButtonElement = fixture.debugElement.query(
      By.css('#cpy-vouchers-allocate-vouchers-button')
    ).nativeElement;
    fixture.detectChanges();

    expect(button.disabled).toBeFalsy();
  });

  it('should show modal when button is clicked and there are vouchers selected', fakeAsync(() => {
    let vch = helper.createVoucherArray(1)[0];
    component.selectedVouchers.add(vch);
    let button = fixture.debugElement.query(
      By.css('#cpy-vouchers-allocate-vouchers-button')
    ).nativeElement;
    let modal = fixture.debugElement.query(
      By.css('#cpy-vouchers-modal-allocation')
    ).nativeElement;
    fixture.detectChanges();
    button.click();
    tick(100);
    fixture.detectChanges();

    expect(modal).toHaveClass('show');
  }));

  it("should call error modal when button is clicked and there aren't vouchers selected", fakeAsync(() => {
    let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
    component.selectedVouchers = new Set();
    let button = fixture.debugElement.query(
      By.css('#cpy-vouchers-allocate-vouchers-button')
    ).nativeElement;
    button.disabled = false;
    button.click();
    tick(100);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      'MODALS.HEADER.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_TITLE',
      'MODALS.BODY.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_BODY'
    );
  }));

  describe('controll method onClickVoucherCheckbox', () => {
    let cpyVouchersFake: VoucherDTO[] = new Array();
    let fillWithFakeVouchers = () => {
      let comp_One = new VoucherDTO();
      comp_One.vchName = 'Voucher da 0.99 €';
      comp_One.vchValue = '0.99';
      comp_One.vchEndDate = '02/01/2021';
      comp_One.vchQuantity = '10';

      let comp_Two = new VoucherDTO();
      comp_Two.vchName = 'Voucher da 1.99 €';
      comp_Two.vchValue = '1.99';
      comp_Two.vchEndDate = '02/07/2021';
      comp_Two.vchQuantity = '20';

      let comp_Three = new VoucherDTO();
      comp_Three.vchName = 'Voucher da 2.99 €';
      comp_Three.vchValue = '2.99';
      comp_Three.vchEndDate = '12/03/2021';
      comp_Three.vchQuantity = '30';

      let comp_Four = new VoucherDTO();
      comp_Four.vchName = 'Voucher da 4.99 €';
      comp_Four.vchValue = '4.99';
      comp_Four.vchEndDate = '17/04/2021';
      comp_Four.vchQuantity = '40';
      cpyVouchersFake = [comp_One];
      cpyVouchersFake.push(comp_Two);
      cpyVouchersFake.push(comp_Three);
      cpyVouchersFake.push(comp_Four);
    };
  

    beforeEach(() => {
      fillWithFakeVouchers(); //4 fake  company vouchers
      cpyVouchersFake.forEach((cpy) => {
        cpy.vchEndDate = '';
        cpy.vchValue = cpy.vchValue.substring(0, 4); //! Se si levano queste due istruzioni da in ERRORE con il PIPE->Unable to convert! motivo ignoto
      });
      component.vouchers = cpyVouchersFake;
      component.tableLoading = false;
      component.tableEmpty = false;
      fixture.detectChanges();
    });

    //% controllo se viene selezionato il primo buono,abilita la possibilità di scegliere un tot n° di buoni in Quantità disponibile tramite freccette
    it('if an input is checked,the property disabled should be false!', () => {
      component.vouchers = cpyVouchersFake;
      fixture.detectChanges();
      $('table:eq(0) tbody tr:eq(0) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onClickVoucherCheckbox(component.vouchers[0]);
      fixture.detectChanges();
      expect(
        $('table:eq(0) tbody tr:eq(0) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(component.selectedQuantities.size).toEqual(1);
    });

    it('if two inputs are checked,their properties disabled should be false!', () => {
      $('table:eq(0) tbody tr:eq(0) td:eq(0)').children().prop('checked', true);
      $('table:eq(0) tbody tr:eq(1) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onClickVoucherCheckbox(component.vouchers[0]);
      component.onClickVoucherCheckbox(component.vouchers[1]);
      fixture.detectChanges();
      expect(
        $('table:eq(0) tbody tr:eq(0) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(
        $('table:eq(0) tbody tr:eq(1) td:eq(4) input').is(':disabled')
      ).toBeFalse();
    });

    it('if one checkbox is checked,so the button Alloca Buoni Voucher should be available to be pressed!', () => {
      $('table:eq(0) tbody tr:eq(0) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onClickVoucherCheckbox(component.vouchers[0]);
      fixture.detectChanges();
      expect(
        $('table:eq(0) tbody tr:eq(0) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(
        $('#cpy-vouchers-allocate-vouchers-button').is(':disabled')
      ).toBeFalse();
      expect(component.selectedQuantities.size).toEqual(1);
    });

    it('if i select 2 different vouchers,i suppose to have selected two quantities!', () => {
      $('table:eq(0) tbody tr:eq(0) td:eq(0)').children().prop('checked', true); //0.99 €
      $('table:eq(0) tbody tr:eq(1) td:eq(0)').children().prop('checked', true); //1.99 €
      fixture.detectChanges();
      component.onClickVoucherCheckbox(component.vouchers[0]);
      component.onClickVoucherCheckbox(component.vouchers[1]);
      fixture.detectChanges();
      expect(
        $('table:eq(0) tbody tr:eq(0) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(
        $('table:eq(0) tbody tr:eq(1) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(component.selectedQuantities.size).toEqual(2);
      expect(component.totalImport).toEqual(2.98);
    });

    it('if i select the first 3 vouchers,i suppose to have an total amount of 5,97 €!', () => {
      $('table:eq(0) tbody tr:eq(0) td:eq(0)').children().prop('checked', true); //0.99 €
      $('table:eq(0) tbody tr:eq(1) td:eq(0)').children().prop('checked', true); //1.99 €
      $('table:eq(0) tbody tr:eq(2) td:eq(0)').children().prop('checked', true); //2.99 €
      fixture.detectChanges();
      component.onClickVoucherCheckbox(component.vouchers[0]);
      component.onClickVoucherCheckbox(component.vouchers[1]);
      component.onClickVoucherCheckbox(component.vouchers[2]);
      fixture.detectChanges();
      expect(
        $('table:eq(0) tbody tr:eq(0) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(
        $('table:eq(0) tbody tr:eq(1) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(
        $('table:eq(0) tbody tr:eq(2) td:eq(4) input').is(':disabled')
      ).toBeFalse();
      expect(component.selectedQuantities.size).toEqual(3);
      expect(component.totalImport).toEqual(5.970000000000001);
    });

  });

  describe("controll onClickConfirmAllocation,resetSelectedValues methods",()=>{
    let cpyVouchersFake: VoucherDTO[] = new Array();
  let fillWithFakeVouchers = () => {
    let comp_One = new VoucherDTO();
    comp_One.vchName = 'Voucher da 0.99 €';
    comp_One.vchValue = '0.99';
    comp_One.vchEndDate = '02/01/2021';
    comp_One.vchQuantity = '10';

    let comp_Two = new VoucherDTO();
    comp_Two.vchName = 'Voucher da 1.99 €';
    comp_Two.vchValue = '1.99';
    comp_Two.vchEndDate = '02/07/2021';
    comp_Two.vchQuantity = '20';

    let comp_Three = new VoucherDTO();
    comp_Three.vchName = 'Voucher da 2.99 €';
    comp_Three.vchValue = '2.99';
    comp_Three.vchEndDate = '12/03/2021';
    comp_Three.vchQuantity = '30';

    let comp_Four = new VoucherDTO();
    comp_Four.vchName = 'Voucher da 4.99 €';
    comp_Four.vchValue = '4.99';
    comp_Four.vchEndDate = '17/04/2021';
    comp_Four.vchQuantity = '40';
    cpyVouchersFake = [comp_One];
    cpyVouchersFake.push(comp_Two);
    cpyVouchersFake.push(comp_Three);
    cpyVouchersFake.push(comp_Four);

    component.vouchers=cpyVouchersFake;
  };
  let authenticatorService: AuthenticationService;
  let cpyVouchersService:CpyVouchersService;
  let simpleResDTO = new SimpleResponseDTO();

    beforeEach(()=>{
      authenticatorService =fixture.debugElement.injector.get(AuthenticationService);
      cpyVouchersService=fixture.debugElement.injector.get(CpyVouchersService);
      fillWithFakeVouchers();
      cpyVouchersFake.forEach((cpy) => {
        cpy.vchEndDate = '';
      });
      fixture.detectChanges();
    })

    it('With a good response it should set the attributes allocationOk and okMsg to true!',fakeAsync( () => {
      simpleResDTO.status="OK";
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(cpyVouchersService,"allocateVouchers").and.returnValue(of(simpleResDTO));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.allocationOk).toBeTrue();
        expect(component.okMsg).toBeTrue();
      })
    }));

    it('With a bad response it should set the attributes allocationOk and errorMsg to true!',fakeAsync( () => {
      simpleResDTO.status="NOT OK";
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(cpyVouchersService,"allocateVouchers").and.returnValue(of(simpleResDTO));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.allocationOk).toBeTrue();
        expect(component.errorMsg).toBeTrue();
      })
    }));

    it('With a 404 error response it should set the attributes allocationOk and errorMsg to true!',fakeAsync( () => {
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(cpyVouchersService,"allocateVouchers").and.returnValue(throwError({status: 404}));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.allocationOk).toBeTrue();
        expect(component.errorMsg).toBeTrue();
      })
    }));

    it("it should reset all attributes when invoke resetSelectedValues!",()=>{

      let voucherAllocationDTO=new VoucherAllocationDTO();
      voucherAllocationDTO.voucherList=component.vouchers;
      voucherAllocationDTO.profile="Mark";
      voucherAllocationDTO.toId="36";

      let first_employee= new EmployeeDTO();
      first_employee.empFirstName="Nicola";
      first_employee.empLastName="Svaronsky";
      first_employee.status="OK";
      first_employee.usrPassword="Shr5348bcrk";
      first_employee.usrId="34";

      component.selectedVouchers.add(component.vouchers[0]);

      component.selectedQuantities.set("0",1);

      component.allocationsDTO.push(voucherAllocationDTO);

      component.allocatedVouchersDTO.push(component.vouchers[1]);

      component.voucherImports.set("32",4);

      component.totalImport=5;
   
      fixture.detectChanges();
      component.resetSelectedValues();

      expect(component.allocatedVouchersDTO).toEqual(new Array()); 
      expect(component.allocationsDTO).toEqual(new Array());       
      expect(component.selectedQuantities).toEqual( new Map());
      expect(component.selectedVouchers).toEqual(new Set());
      expect(component.totalImport).toEqual(0);
      expect(component.voucherImports).toEqual(new Map);
      expect(component.vouchers).toEqual(new Array());
     
    });
  })

});

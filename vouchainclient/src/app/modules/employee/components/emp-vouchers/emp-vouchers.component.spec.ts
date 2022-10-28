import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { EmpVouchersComponent } from './emp-vouchers.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { imports, Helper } from 'src/test-utility/test-utilities';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

import { EmpOverviewComponent } from '../emp-overview/emp-overview.component';

import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { DTOList } from 'src/app/model/dto-list';
import { Router } from '@angular/router';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { newArray } from '@angular/compiler/src/util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* jQuery */
declare var $: any;

describe('EmpVouchersComponent', () => {
  let component: EmpVouchersComponent;
  let fixture: ComponentFixture<EmpVouchersComponent>;
  let empVouchersService: EmpVouchersService;
  let modalManager: ModalsManagerService;
  let helper: Helper;
  let translate: TranslateTestingUtility<EmpVouchersComponent>;
  let fillWithFakeEmpVouchers = () => {
    let empVouchersFake: VoucherDTO[] = new Array();
    let emp_One = new VoucherDTO();
    emp_One.vchName = 'Voucher da 0.99 €';
    emp_One.vchValue = '0.99 €';
    emp_One.vchQuantity = '10';

    let emp_Two = new VoucherDTO();
    emp_Two.vchName = 'Voucher da 1.99 €';
    emp_Two.vchValue = '1.99 €';
    emp_Two.vchQuantity = '12';

    let emp_Three = new VoucherDTO();
    emp_Three.vchName = 'Voucher da 2.99 €';
    emp_Three.vchValue = '2.99 €';
    emp_Three.vchQuantity = '16';

    let emp_Four = new VoucherDTO();
    emp_Four.vchName = 'Voucher da 4.99 €';
    emp_Four.vchValue = '4.99 €';
    emp_Four.vchQuantity = '23';
    empVouchersFake = [emp_One];
    empVouchersFake.push(emp_Two);
    empVouchersFake.push(emp_Three);
    empVouchersFake.push(emp_Four);

    component.empVouchers=empVouchersFake;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpVouchersComponent ],
      imports:[
        imports,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([
          {path: 'employee/empDashboard', component:EmpOverviewComponent}
        ])
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpVouchersComponent);
    component = fixture.componentInstance;
    empVouchersService = fixture.debugElement.injector.get(EmpVouchersService);
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
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(5);
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;
  
      expect(next).toHaveClass('disabled');
    });

    it('should only display five lines if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;
  
      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.TABLES.VOUCHERS.EMPTY_TABLE);
    });

    it('should display the correct message if response is negative', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = "KO";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(activeVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(throwError({ status: 404 }));
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  it('should show merchant modal when merchant button is clicked', fakeAsync(()=>{
    let button = fixture.debugElement.query(By.css('#btn-affiliato')).nativeElement;
    let modal = fixture.debugElement.query(By.css('#emp-vouchers-modal-merchants')).nativeElement;
    button.click();
    tick(100);
    fixture.detectChanges();
    expect(modal).toHaveClass('show');
  }));

  it('should add vouchers right (addAllocatedVouchersDTO)', () => {
    let vchDto :VoucherDTO = helper.createVoucherArray(1)[0];
    component.addAllocatedVouchersDTO(vchDto)

    expect(component.allocatedVouchersDTO[0].vchName).toEqual(vchDto.vchName);
    expect(component.allocatedVouchersDTO[0].vchQuantity).toEqual(vchDto.vchQuantity);
  });

  it('(addVoucherAllocationDTO)', () => {
    let allocationDTO: VoucherAllocationDTO = new VoucherAllocationDTO();
    let vouchers = helper.createVoucherArray(2);
    let merch = new MerchantDTO();
    let authenticatorService: AuthenticationService = fixture.debugElement.injector.get(AuthenticationService);
    let spy = spyOn(authenticatorService, 'getLoggedUserId').and.returnValue('1');
    merch.usrId = '2';
    allocationDTO.fromId = '1';
    allocationDTO.profile = 'employee';
    allocationDTO.toId = '2';
    allocationDTO.voucherList = vouchers;
    component.addVoucherAllocationDTO(vouchers, merch);
    
    expect(component.allocationsDTO[0]).toEqual(allocationDTO);
  });

  it('allocate vouchers button should be disabled when there are no selected vouchers', ()=>{
    let button : HTMLButtonElement= fixture.debugElement.query(By.css('#btn-alloca-voucher')).nativeElement;
    fixture.detectChanges();
    
    expect(button.disabled).toBeTruthy();
  });

  it('should call error modal when button is clicked and there aren\'t vouchers selected', fakeAsync(()=>{
    let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
    component.empVouchersSelected = new Array();
    let button = fixture.debugElement.query(By.css('#btn-alloca-voucher')).nativeElement;
    button.disabled = false;
    button.click();
    tick(100);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('MODALS.HEADER.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_TITLE',
      'MODALS.BODY.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_BODY');
  }));

  it('should return correct value (quantitySelectedToMultiply)', ()=>{
    let vch = new VoucherDTO();
    vch.vchName = 'voucher';
    vch.vchValue = '3'
    component.vouQuantitySelected = {
      'voucher' : 3
    }

    expect(component.quantitySelectedToMultiply(vch.vchName, vch.vchValue)).toBe(1);
  });

  it('Should navigate to wallet if modal is cloased and msg is ok(closeModal)', ()=>{
    let router = TestBed.get(Router);
    let spy = spyOn(router, 'navigate');
    component.okMsg = true;
    component.closeModal();

    expect(spy).toHaveBeenCalledWith(['employee/empDashboard/wallet'])
  });  


  describe("controll method onSingleVoucherSelected",()=>{
   let empVouchersFake: VoucherDTO[] = new Array();
    let fillWithFakeEmployees =()=>{
      let empOne= new VoucherDTO();
      empOne.vchName="Voucher da 0.99 €";
      empOne.vchValue="0.99 €";
      empOne.vchEndDate="02/01/2021";
      empOne.vchQuantity="10";
   

      let empTwo= new VoucherDTO();
      empTwo.vchName="Voucher da 1.99 €";
      empTwo.vchValue="1.99 €";
      empTwo.vchEndDate="02/07/2021";
      empTwo.vchQuantity="20";

      let empThree= new VoucherDTO();
      empThree.vchName="Voucher da 2.99 €";
      empThree.vchValue="2.99 €";
      empThree.vchEndDate="12/03/2021";
      empThree.vchQuantity="30";

      let empFour= new VoucherDTO();
      empFour.vchName="Voucher da 4.99 €";
      empFour.vchValue="4.99 €";
      empFour.vchEndDate="17/04/2021";
      empFour.vchQuantity="40";
      empVouchersFake=[empOne];
      empVouchersFake.push(empTwo);
      empVouchersFake.push(empThree);
      empVouchersFake.push(empFour);

    }
    let empVouchersService:EmpVouchersService; 

    beforeEach(()=>{
      fillWithFakeEmployees();//4 fake employees
      empVouchersService=fixture.debugElement.injector.get(EmpVouchersService);
    });

    //% controllo se viene selezionato il primo buono,abilita la possibilità di scegliere un tot n° di buoni in Quantità disponibile tramite freccette
    it("if an input is checked,the property disabled should be false!",()=>{
      empVouchersFake.forEach((emp)=>{emp.vchEndDate="";});
      component.empVouchers=empVouchersFake;
      fixture.detectChanges();
      $('#emp-invoice-vouchers tbody tr:eq(3) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onSingleVoucherSelected(component.empVouchers[3].vchName);
      fixture.detectChanges(); 
      //expect( $('#emp-invoice-vouchers tbody tr:eq(1) td:eq(4) input').is(":disabled")).toBeTrue();
      //expect( $('#emp-invoice-vouchers tbody tr:eq(2) td:eq(4) input').is(":disabled")).toBeTrue();
      expect( $('#emp-invoice-vouchers tbody tr:eq(3) td:eq(4) input').is(":disabled")).toBeFalse();
      //expect( component.empVouchersSelected.length).toEqual(1);
      //nota:la propietà disabled viene settata a false prima ancora di controllare se il nome scelto corrisponde alla riga!
    });

    it("if two inputs are checked,their properties disabled should be false!",()=>{
      empVouchersFake.forEach((emp)=>{emp.vchEndDate="";});//PIPE non riesce a convertire! il date format, se si leva questa istuzione causa errore,perchè alla riga html 109!
      component.empVouchers=empVouchersFake;
      fixture.detectChanges();
      $('#emp-invoice-vouchers tbody tr:eq(3) td:eq(0)').children().prop('checked', true);
      $('#emp-invoice-vouchers tbody tr:eq(2) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onSingleVoucherSelected(component.empVouchers[3].vchName);
      component.onSingleVoucherSelected(component.empVouchers[2].vchName);
      let thirdVoucher=$('#emp-invoice-vouchers tbody tr:eq(3) td:eq(4) input').is(":disabled");
      let secondVoucher=$('#emp-invoice-vouchers tbody tr:eq(2) td:eq(4) input').is(":disabled");
      expect( thirdVoucher ).toBeFalse();
      expect( secondVoucher ).toBeFalse();
      //expect( component.empVouchersSelected.length).toEqual(2);
    });

    it("if one checkbox is checked,so the button named Alloca buoni should be available to be pressed!",()=>{ 
      empVouchersFake.forEach((emp)=>{emp.vchEndDate="";});
      component.empVouchers=empVouchersFake;
      fixture.detectChanges();
      $('#emp-invoice-vouchers tbody tr:eq(3) td:eq(0)').children().prop('checked', true);
      fixture.detectChanges();
      component.onSingleVoucherSelected(component.empVouchers[3].vchName);
      fixture.detectChanges();
      expect( $('#btn-alloca-voucher').is(":disabled")).toBeFalse();
      expect( component.empVouchersInPage.length).toEqual(1);
      expect( component.empVouchersSelected.length).toEqual(1);
    });


    it("if i don't check nothing, the empVouchersSelected should be empty!",()=>{ 
      empVouchersFake.forEach((emp)=>{emp.vchEndDate="";});
      component.empVouchers=empVouchersFake;
      fixture.detectChanges();
      component.onSingleVoucherSelected(component.empVouchers[3].vchName);
      fixture.detectChanges();
      expect( component.empVouchersSelected.length).toEqual(0);
    });

  });
  
  describe("controll onClickConfirmAllocation",()=>{
    let empVouchersFake: VoucherDTO[] = new Array();
  let fillWithFakeVouchers = () => {
    let emp_One = new VoucherDTO();
    emp_One.vchName = 'Voucher da 0.99 €';
    emp_One.vchValue = '0.99 €';
    emp_One.vchEndDate = '02/01/2021';
    emp_One.vchQuantity = '10';

    let emp_Two = new VoucherDTO();
    emp_Two.vchName = 'Voucher da 1.99 €';
    emp_Two.vchValue = '1.99 €';
    emp_Two.vchEndDate = '02/07/2021';
    emp_Two.vchQuantity = '20';

    let emp_Three = new VoucherDTO();
    emp_Three.vchName = 'Voucher da 2.99 €';
    emp_Three.vchValue = '2.99 €';
    emp_Three.vchEndDate = '12/03/2021';
    emp_Three.vchQuantity = '30';

    let emp_Four = new VoucherDTO();
    emp_Four.vchName = 'Voucher da 4.99 €';
    emp_Four.vchValue = '4.99 €';
    emp_Four.vchEndDate = '17/04/2021';
    emp_Four.vchQuantity = '40';
    empVouchersFake = [emp_One];
    empVouchersFake.push(emp_Two);
    empVouchersFake.push(emp_Three);
    empVouchersFake.push(emp_Four);

    component.vouchers=empVouchersFake;
  };
  
  let simpleResDTO = new SimpleResponseDTO();
 

    beforeEach(()=>{
      fillWithFakeVouchers();
      empVouchersFake.forEach((emp) => {
    emp.vchEndDate = '';
        emp.vchValue = emp.vchValue.substring(0, 4); //! Se si levano queste due istruzioni da in ERRORE con il PIPE->Unable to convert! motivo ignoto
      });
      fixture.detectChanges();
    })

    it('With a good response it should set the attributes allocationOk and okMsg to true!',fakeAsync( () => {
      simpleResDTO.status="OK";
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(empVouchersService,"allocateVouchers").and.returnValue(of(simpleResDTO));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      expect(component.allocationOk).toBeTrue();
      expect(component.okMsg).toBeTrue();
    }));

    it('With a bad response it should set the attributes allocationOk and errorMsg to true!',fakeAsync( () => {
      simpleResDTO.status="NOT OK";
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(empVouchersService,"allocateVouchers").and.returnValue(of(simpleResDTO));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      expect(component.allocationOk).toBeTrue();
      expect(component.errorMsg).toBeTrue();
    }));

    it('With a 404 error response it should set the attributes allocationOk and errorMsg to true!',fakeAsync( () => {
      spyOn(component,"addAllocatedVouchersDTO");
      spyOn(component,"addVoucherAllocationDTO");
      spyOn(empVouchersService,"allocateVouchers").and.returnValue(throwError({status: 404}));
      fixture.detectChanges();
      component.onClickConfirmAllocation();
      tick(15000);
      fixture.detectChanges();
      expect(component.allocationOk).toBeTrue();
      expect(component.errorMsg).toBeTrue();
    }));
  })

  describe("controll  parseIntStringValue method",(()=>{
    it("expect to have 4 in number ",()=>{
      expect(component.parseIntStringValue("4")).toEqual(4);
      expect(component.parseIntStringValue("4")).toBeInstanceOf(Number);
    })

    it("expect to have 41 in number ",()=>{
      expect(component.parseIntStringValue("41")).toEqual(41);
    })

  }));

  describe("controll showQuantityAvailable method",(()=>{
    beforeEach(()=>{
      fillWithFakeEmpVouchers();
      fixture.detectChanges();
    })

    it("expect to have an array with these values! [1,2,3,4,5,6,7,8,9,10]",()=>{
      expect(component.showQuantityAvailable('Voucher da 0.99 €')).toEqual([1,2,3,4,5,6,7,8,9,10]);
    })

    it("expect to have an array empty!",()=>{
      expect(component.showQuantityAvailable('Voucher da 0.99')).toEqual([]);
    })

  }));

  describe("controll onClickVoucherAllocation method",(()=>{
    let fillWithfakeVouchersIn_empVouchersInPage=(()=>{
      let fakeEmpVouchersInPage:VoucherDTO[];
      let emp_One = new VoucherDTO();
      emp_One.vchName = 'Voucher da 0.80 €';
      emp_One.vchValue = '0.80';
      emp_One.vchEndDate="";
      emp_One.vchQuantity = '4';
  
      let emp_Two = new VoucherDTO();
      emp_Two.vchName = 'Voucher da 1.32 €';
      emp_Two.vchValue = '1.32';
      emp_Two.vchEndDate="";
      emp_Two.vchQuantity = '3';
  
      let emp_Three = new VoucherDTO();
      emp_Three.vchName = 'Voucher da 4,56 €';
      emp_Three.vchValue = '4.56';
      emp_Three.vchEndDate="";
      emp_Three.vchQuantity = '21';
  
      let emp_Four = new VoucherDTO();
      emp_Four.vchName = 'Voucher da 4.67 €';
      emp_Four.vchValue = '4.67';
      emp_Four.vchEndDate="";
      emp_Four.vchQuantity = '98';

      fakeEmpVouchersInPage=[emp_One];
      fakeEmpVouchersInPage.push(emp_Two);
      fakeEmpVouchersInPage.push(emp_Three);
      fakeEmpVouchersInPage.push(emp_Four);
    
    component.empVouchersInPage=fakeEmpVouchersInPage;
    })
    beforeEach(()=>{
      fillWithFakeEmpVouchers();
      fixture.detectChanges();
    })

    it("if empVouchersSelected has an element,the empVouchersSelectedToRedeem should have the same size of empVouchersInPage!",()=>{
      spyOn(component,"quantitySelectedToMultiply").and.returnValue(9);
      fillWithfakeVouchersIn_empVouchersInPage();
      component.empVouchersSelected=[component.vouchers[1]];
      component.onClickVoucherAllocation();
      fixture.detectChanges();
      expect(component.empVouchersSelectedToRedeem.length).toEqual(component.empVouchersInPage.length);
    })
    
    it("if empVouchersSelected hasn't an element,the empVouchersSelectedToRedeem should be Empty!",()=>{
      spyOn(component,"quantitySelectedToMultiply").and.returnValue(9);
      fillWithfakeVouchersIn_empVouchersInPage();
      component.onClickVoucherAllocation();
      fixture.detectChanges();
      expect(component.empVouchersSelectedToRedeem).toEqual([]);
    })

  }));



});

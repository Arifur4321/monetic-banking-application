import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { EmpWalletComponent } from './emp-wallet.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { imports, Helper } from 'src/test-utility/test-utilities';

import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

import { DTOList } from 'src/app/model/dto-list';
import { VoucherDTO } from 'src/app/model/voucher-dto';

describe('EmpWalletComponent', () => {
  let component: EmpWalletComponent;
  let fixture: ComponentFixture<EmpWalletComponent>;
  let empVouchersService: EmpVouchersService;
  let helper: Helper;
  let translate: TranslateTestingUtility<EmpWalletComponent>;
  let modalManager: ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpWalletComponent ],
      imports:[
        imports,
        NgxPaginationModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpWalletComponent);
    empVouchersService = fixture.debugElement.injector.get(EmpVouchersService);
    modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    component = fixture.componentInstance;
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
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement

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

  describe('calculateTotalImport()', () => {
    it('should count right', () => {
      component.empVouchers = helper.createVoucherArray(3);
      //1*1+2*2+3*3
      component.calculateTotalImport();
      expect(component.totalImport).toBe(14);
    });

    it('should return 0 if array empty', () => {
      component.empVouchers = [];
      component.calculateTotalImport();

      expect(component.totalImport).toBe(0);
    });
  });

});

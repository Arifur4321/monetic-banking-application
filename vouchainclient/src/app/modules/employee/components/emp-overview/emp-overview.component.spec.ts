import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { EmpOverviewComponent } from './emp-overview.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { EmpShowProfileService } from '../../services/rest/emp-show-profile.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';

import { EmployeeDTO } from 'src/app/model/employee-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { DTOList } from 'src/app/model/dto-list';
import { VoucherDTO } from 'src/app/model/voucher-dto';


describe('EmpOverviewComponent', () => {
  let component: EmpOverviewComponent;
  let fixture: ComponentFixture<EmpOverviewComponent>;
  let empVouchersService: EmpVouchersService;
  let showProfileService: EmpShowProfileService;
  let helper: Helper;
  let translate: TranslateTestingUtility<EmpOverviewComponent>;
  let transactionsService : TransactionsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpOverviewComponent ],
      imports:[
        imports,
        NgxPaginationModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpOverviewComponent);
    component = fixture.componentInstance;
    empVouchersService = fixture.debugElement.injector.get(EmpVouchersService);
    showProfileService = fixture.debugElement.injector.get(EmpShowProfileService);
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly get employee from service', () => {
    fixture = TestBed.createComponent(EmpOverviewComponent);
    component = fixture.componentInstance;
    showProfileService = fixture.debugElement.injector.get(EmpShowProfileService);
    let emp: EmployeeDTO = new EmployeeDTO();
    emp.usrEmail = "mail@provider.it";
    emp.usrId = '1';
    emp.empFirstName = "ProvaNome";
    emp.empLastName = "ProvaCognome";
    emp.empMatricola = "123456";
    let spy = spyOn(showProfileService, 'getShowProfile').and.returnValue(of(emp));
    fixture.detectChanges();
    let values = fixture.debugElement.queryAll(By.css(".emp-ow-profile-text-subtitle"));
    expect(values[0].nativeElement.innerText).toBe('ProvaNome');
    expect(values[1].nativeElement.innerText).toBe('ProvaCognome');
    expect(values[2].nativeElement.innerText).toBe('123456');
    expect(values[3].nativeElement.innerText).toBe('mail@provider.it');

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

  describe('voucher table', () => {

    it('should display 3 lines if there are 3 vouchers', () => {
      let empVouchers = new DTOList<VoucherDTO>();
      empVouchers.list = helper.createVoucherArray(3);
      empVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(empVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('should only display 4 lines if there are more than 4 vouchers', () => {
      let empVouchers = new DTOList<VoucherDTO>();
      empVouchers.list = helper.createVoucherArray(20);
      empVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(empVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(4);
    });

    it('should display one row if there are no vouchers', () => {
      let empVouchers = new DTOList<VoucherDTO>();
      empVouchers.list = new Array();
      empVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(empVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let empVouchers = new DTOList<VoucherDTO>();
      empVouchers.list = new Array();
      empVouchers.status = "OK";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(empVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.OVERVIEW.WALLET.TABLE_EMPTY);
    });

    it('should display the correct message if response is negative', () => {
      let empVouchers = new DTOList<VoucherDTO>();
      empVouchers.list = new Array();
      empVouchers.status = "KO";
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(of(empVouchers))
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(empVouchersService, 'getExpendableVouchersEmp').and.returnValue(throwError({ status: 404 }));
      component.showVouchersList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  describe('transactions table', () => {
    
    it('should display 3 lines if there are 3 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(3);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('should only display 4 lines if there are more than 4 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(4);
    });

    it('should display one row if there are no transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual('Nessuna transazione trovata');
    });

    it('should display the correct message if response is negative', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "KO";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(throwError({ status: 404 }));
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;
      
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  }); 


});

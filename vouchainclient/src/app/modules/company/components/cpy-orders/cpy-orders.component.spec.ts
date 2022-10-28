import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CpyOrdersComponent } from './cpy-orders.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyOrdersService } from '../../services/rest/cpy-orders.service';

import { DTOList } from 'src/app/model/dto-list';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { InvoiceDTO } from 'src/app/model/invoice-dto';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('CpyOrdersComponent', () => {
  let component: CpyOrdersComponent;
  let fixture: ComponentFixture<CpyOrdersComponent>;
  let helper: Helper;
  let transactionsService: TransactionsService;
  let authenticatorService : AuthenticationService;
  let cpyOrdersService : CpyOrdersService;
  let translate: TranslateTestingUtility<CpyOrdersComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyOrdersComponent],
      imports: [
        imports,
        NgxPaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyOrdersComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
    cpyOrdersService = fixture.debugElement.injector.get(CpyOrdersService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('payed orders table', () => {
    let transactionList;

    beforeEach(() => {
      spyOn(authenticatorService, 'getLoggedUserId');
      transactionList = new DTOList<TransactionDTO>();

    });

    it('should display 3 lines if there are 3 transactions', () => {
      transactionList.list = helper.createTransactionArray(3);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 transactions', () => {
      transactionList.list = helper.createTransactionArray(5);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display 5 lines if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.TABLES.ORDERS.EMPTY_TABLE);
    });

    it('should display the correct message if response is negative', () => {
      transactionList.list = new Array();
      transactionList.status = "KO";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(throwError({ status: 404 }));
      component.showPayedOrders("2020-01-01", "2020-07-06", "payed");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  describe('not payed orders table', () => {
    let transactionList;

    beforeEach(() => {
      spyOn(authenticatorService, 'getLoggedUserId');
      transactionList = new DTOList<TransactionDTO>();

    });

    it('should display 2 lines if there are 2 transactions valid', () => {
      transactionList.list = helper.createTransactionArray(3);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(2);
    });

    it('next button should be disabled if there are less than 6 valid transactions', () => {
      transactionList.list = helper.createTransactionArray(9);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.queryAll(By.css('.pagination-next'))[1].nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display 5 lines if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.queryAll(By.css('.pagination-next'))[1].nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display one row if there are no valid transactions', () => {
      let arr = helper.createTransactionArray(2);
      arr[0].trcCancDate = 'something';
      arr[1].trcCancDate = 'something';
      transactionList.list = arr;
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual(translate.IT.TABLES.ORDERS.EMPTY_TABLE);
    });

    it('should display the correct message if response is negative', () => {
      transactionList.list = new Array();
      transactionList.status = "KO";
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(of(transactionList));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement

      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(cpyOrdersService, 'getCpyOrdersList').and.returnValue(throwError({ status: 404 }));
      component.showNotPayedOrders("2020-01-01", "2020-07-06", "not_payed");
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement

      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  it('should show orders detail modal (showOrderDetails)', fakeAsync(()=>{
    let modal = fixture.debugElement.query(By.css('#cpy-orders-modal-vouchers-detail')).nativeElement;
    let trc = helper.createTransactionArray(1)[0];
    component.showOrderDetails(trc);
    tick(100);
    fixture.detectChanges();

    expect(modal).toHaveClass('show');
  }));

  describe('onClickDownloadInvoice', () => {
    let invDTO : InvoiceDTO;
    let modalManager: ModalsManagerService;
    beforeEach(() => {
      invDTO = new InvoiceDTO();
      modalManager = fixture.debugElement.injector.get(ModalsManagerService);
    });

    it('should call convert and download service if response status is ok', ()=>{
      let spy = spyOn(transactionsService, 'convertAndDownloadInvoice');
      spyOn(transactionsService, 'getInvoice').and.returnValue(of(invDTO));
      invDTO.status= 'OK';
      component.onClickDownloadInvoice('pdf', '5' , "2020-07-06");

      expect(spy).toHaveBeenCalled();
    });

    it('should call error modal if response status is not ok', ()=>{
      let spy = spyOn(modalManager, 'errorsModalGeneric');
      spyOn(transactionsService, 'getInvoice').and.returnValue(of(invDTO));
      invDTO.status= 'KO';
      component.onClickDownloadInvoice('pdf', '5' , "2020-07-06");

      expect(spy).toHaveBeenCalled();
    });

    it('should call error modal if service return an error', ()=>{
      let spy = spyOn(modalManager, 'errorsModalGeneric');
      spyOn(transactionsService, 'getInvoice').and.returnValue(throwError({status: 404}));
      component.onClickDownloadInvoice('pdf', '5' , "2020-07-06");

      expect(spy).toHaveBeenCalled();
    });
  });
});

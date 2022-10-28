import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';

import { EmpTransactionsComponent } from './emp-transactions.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { TransactionsService } from 'src/app/services/rest/transactions.service';

import { DTOList } from 'src/app/model/dto-list';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmpTransactionsComponent', () => {
  let component: EmpTransactionsComponent;
  let fixture: ComponentFixture<EmpTransactionsComponent>;
  let helper: Helper;
  let transactionsService: TransactionsService;
  let translate: TranslateTestingUtility<EmpTransactionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpTransactionsComponent ],
      imports: [
        imports,
        NgxPaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpTransactionsComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showTransactionDetails', () => {
    let trc: TransactionDTO;
    let modal;

    beforeEach(() => {
      trc = helper.createTransactionArray(1)[0];
      modal = fixture.debugElement.query(By.css('#emp-transactions-modal-transaction-detail'));
    });

    it('should show details modal', fakeAsync(() => {
      component.showTransactionDetails(trc);
      tick(100);
      fixture.detectChanges();

      expect(modal.nativeElement).toHaveClass('show');
    }));

    it('details modal should have only one table when transaction type is ALL', fakeAsync(() => {
      trc.trcType = "ALL";
      component.showTransactionDetails(trc);
      tick(100);
      fixture.detectChanges();
      let tables = modal.queryAll(By.css('table'));

      expect(tables.length).toBe(1);
    }));

    it('modals should have two tables when transaction type is SPS', fakeAsync(() => {
      trc.trcType = "SPS";
      spyOn(component, 'getTransactionRecipient');
      component.transactionRecipient = helper.createMerchantArray(1)[0];
      component.showTransactionDetails(trc);
      tick(100);
      fixture.detectChanges();
      let tables = modal.queryAll(By.css('table'));

      expect(tables.length).toBe(2);
    }));
  });

  describe('transactions table', () => {

    it('should display 3 lines if there are 3 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(3);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(5);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display five lines if there are more than 5 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no transactions', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual('Nessuna transazione trovata');
    });

    it('should display the correct message if response is negative', () => {
      let transactionList = new DTOList<TransactionDTO>();
      transactionList.list = new Array();
      transactionList.status = "KO";
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(of(transactionList))
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(throwError({ status: 404 }));
      component.showTransactionsList(1);
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });
});

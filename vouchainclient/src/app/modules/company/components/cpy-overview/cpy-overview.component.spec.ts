/*  spec class for testing  the main model*/
import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, discardPeriodicTasks, waitForAsync } from '@angular/core/testing';

import { CpyOverviewComponent } from './cpy-overview.component';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

//Utility
import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

//Models
import { DTOList } from 'src/app/model/dto-list';
import { CompanyDTO } from 'src/app/model/company-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';

//Services
import { CpyShowProfileService } from '../../services/rest/cpy-show-profile.service';
import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { TransactionsService } from 'src/app/services/rest/transactions.service';



describe('CpyOverviewComponent', () => {
  let component: CpyOverviewComponent;
  let fixture: ComponentFixture<CpyOverviewComponent>;
  let cpyVouchersService: CpyVouchersService;
  let showProfileService: CpyShowProfileService;
  let helper: Helper;
  let translate: TranslateTestingUtility<CpyOverviewComponent>;
  let transactionsService : TransactionsService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyOverviewComponent],
      imports: [
        imports
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyOverviewComponent);
    component = fixture.componentInstance;
    cpyVouchersService = fixture.debugElement.injector.get(CpyVouchersService);
    showProfileService = fixture.debugElement.injector.get(CpyShowProfileService);
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //va ricreata la component perché quella ormai è già inizializzata
  it('should properly get company from service', () => {
    fixture = TestBed.createComponent(CpyOverviewComponent);
    component = fixture.componentInstance;
    showProfileService = fixture.debugElement.injector.get(CpyShowProfileService);
    let cpy: CompanyDTO = new CompanyDTO();
    cpy.cpyRagioneSociale = 'Ragione di prova';
    cpy.cpyPartitaIva = "987654321";
    cpy.cpyCodiceFiscale = "fghuio789456kl";
    cpy.cpyPec = "mail@provider.com";
    let spy = spyOn(showProfileService, 'getShowProfile').and.returnValue(of(cpy));
    fixture.detectChanges();
    let values = fixture.debugElement.queryAll(By.css(".cpy-ow-profile-text-subtitle"));
    expect(values[0].nativeElement.innerText).toBe('Ragione di prova');
    expect(values[1].nativeElement.innerText).toBe('987654321');
    expect(values[2].nativeElement.innerText).toBe('fghuio789456kl');
    expect(values[3].nativeElement.innerText).toBe('mail@provider.com');

  });


  describe('calculateTotalActiveImport()', () => {
    it('should count right', () => {
      component.activeVouchers = helper.createVoucherArray(3);
      //1*1+2*2+3*3
      component.calculateTotalActiveImport();
      expect(component.totalActiveImport).toBe(14);
    });

    it('should return 0 if array empty', () => {
      component.activeVouchers = [];
      component.calculateTotalActiveImport();

      expect(component.totalActiveImport).toBe(0);
    });
  });

  describe('voucher table', () => {

    it('should display 3 lines if there are 3 vouchers', () => {

      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(3);
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('should only display 4 lines if there are more than 4 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(4);
    });

    it('should display one row if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = new Array();
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
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
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(throwError({ status: 404 }));
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
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
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(transactionsService, 'showTransactionsList').and.returnValue(throwError({ status: 404 }));
      component.showTransactionsList();
      fixture.detectChanges();
      let table = fixture.debugElement.queryAll(By.css('tbody'))[1];
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  }); 

});

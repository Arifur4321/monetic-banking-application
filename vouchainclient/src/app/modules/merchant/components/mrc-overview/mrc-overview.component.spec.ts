import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { MrcOverviewComponent } from './mrc-overview.component';

import { By } from '@angular/platform-browser';
import { throwError, of } from 'rxjs';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { MrcWalletService } from '../../services/rest/mrc-wallet.service';
import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { TransactionsService } from 'src/app/services/rest/transactions.service';

import { TransactionDTO } from 'src/app/model/transaction-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { DTOList } from 'src/app/model/dto-list';
import { VoucherDTO } from 'src/app/model/voucher-dto';

describe('MrcOverviewComponent', () => {
  let component: MrcOverviewComponent;
  let fixture: ComponentFixture<MrcOverviewComponent>;
  let mrcVouchersService: MrcWalletService;
  let showProfileService: MrcShowProfileService;
  let helper: Helper;
  let translate: TranslateTestingUtility<MrcOverviewComponent>;
  let transactionsService : TransactionsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrcOverviewComponent ],
      imports:[
        imports 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcOverviewComponent);
    component = fixture.componentInstance;
    mrcVouchersService = fixture.debugElement.injector.get(MrcWalletService);
    showProfileService = fixture.debugElement.injector.get(MrcShowProfileService);
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly get merchant from service', () => {
    fixture = TestBed.createComponent(MrcOverviewComponent);
    component = fixture.componentInstance;
    showProfileService = fixture.debugElement.injector.get(MrcShowProfileService);
    let mrc: MerchantDTO = new MerchantDTO();
    mrc.mrcFirstNameRef = "ProvaNome";
    mrc.mrcLastNameRef = "ProvaCognome";
    mrc.mrcRagioneSociale = 'Ragione di prova';
    mrc.mrcPartitaIva = "987654321";
    mrc.mrcCodiceFiscale = "fghuio789456kl";
    let spy = spyOn(showProfileService, 'getShowProfile').and.returnValue(of(mrc));
    fixture.detectChanges();
    let values = fixture.debugElement.queryAll(By.css(".mrc-profile-text-subtitle"));
    expect(values[0].nativeElement.innerText).toBe('ProvaNome ProvaCognome');
    expect(values[1].nativeElement.innerText).toBe('Ragione di prova');
    expect(values[2].nativeElement.innerText).toBe('987654321');
    expect(values[3].nativeElement.innerText).toBe('fghuio789456kl');

  });

  describe('calcImportsInWallet()', () => {
    it('should count right', () => {
      component.activeVouchersForImports = helper.createVoucherArray(3);
      //1*1+2*2+3*3
      component.calcImportsInWallet();
      expect(component.totalImports).toBe(14);
    });

    it('should return 0 if array empty', () => {
      component.activeVouchersForImports = [];
      component.calcImportsInWallet();

      expect(component.totalImports).toBe(0);
    });
  });

  describe('voucher table', () => {

    it('should display 3 lines if there are 3 vouchers', () => {

      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(3);
      activeVouchers.status = "OK";
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(of(activeVouchers))
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
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(of(activeVouchers))
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
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(of(activeVouchers))
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
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(of(activeVouchers))
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
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(mrcVouchersService, 'getExpendedVoucherMrc').and.returnValue(throwError({ status: 404 }));
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

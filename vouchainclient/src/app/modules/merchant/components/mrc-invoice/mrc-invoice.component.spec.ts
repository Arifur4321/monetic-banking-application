import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { MrcInvoiceComponent } from './mrc-invoice.component';
import { imports, Helper } from 'src/test-utility/test-utilities';
import { NgxPaginationModule } from 'ngx-pagination';

import { MrcWalletService } from '../../services/rest/mrc-wallet.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { DTOList } from 'src/app/model/dto-list';
import { ValidatorService } from 'src/app/services/validator.service';
import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { By } from '@angular/platform-browser';
import { MrcVouchersService } from '../../services/rest/mrc-vouchers.service';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('MrcInvoiceComponent', () => {
  let component: MrcInvoiceComponent;
  let fixture: ComponentFixture<MrcInvoiceComponent>;
  let helper: Helper;
  let transactionsService: TransactionsService;
  let translate: TranslateTestingUtility<MrcInvoiceComponent>;
  let transVoucherService : MrcVouchersService;
  let walletService : MrcWalletService;
  let modalsManager : ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrcInvoiceComponent ],
      imports: [
        imports,
        NgxPaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcInvoiceComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    transactionsService = fixture.debugElement.injector.get(TransactionsService);
    transVoucherService = fixture.debugElement.injector.get(MrcVouchersService);
    walletService = fixture.debugElement.injector.get(MrcWalletService);
    modalsManager = fixture.debugElement.injector.get(ModalsManagerService);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('redeemed orders table', () => {
    let transactionList;

    beforeEach(() => {
      transactionList = new DTOList<TransactionDTO>();

    });

    it('should display 3 lines if there are 3 transactions', () => {
      transactionList.list = helper.createTransactionArray(3);
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 transactions', () => {
      transactionList.list = helper.createTransactionArray(5);
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display 5 lines if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 transactions', () => {
      transactionList.list = helper.createTransactionArray(20);
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no transactions', () => {
      transactionList.list = new Array();
      transactionList.status = "OK";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement;

      expect(h1.innerText).toEqual('Nessun elemento presente');
    });

    it('should display the correct message if response is negative', () => {
      transactionList.list = new Array();
      transactionList.status = "KO";
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(of(transactionList));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(transVoucherService, 'getReedemedVoucherOrdersList').and.returnValue(throwError({ status: 404 }));
      component.showRedeemedOrderList("2020-01-01", "2020-07-06");
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  describe('invoice voucher table', () => {

    it('should display 3 lines if there are 3 vouchers', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = helper.createVoucherArray(3);
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));
      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', fakeAsync(() => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = helper.createVoucherArray(3);
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      tick(1000);
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.queryAll(By.css('.pagination-next'))[1].nativeElement;

      expect(next).toHaveClass('disabled');
    }));

    it('should only display five lines if there are more than 5 vouchers', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = helper.createVoucherArray(20);
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = helper.createVoucherArray(20);
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.queryAll(By.css('.pagination-next'))[1].nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no vouchers', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = new Array();
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='OK';
      vouchers.list = new Array();
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.TABLES.VOUCHERS.EMPTY_TABLE);
    });

    it('should display one row if status is not OK', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='KO';
      vouchers.list = new Array();
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers))
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if status is not OK', () => {
      let vouchers = new DTOList<VoucherDTO>();
      vouchers.status='KO';
      vouchers.list = new Array();
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(of(vouchers));
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(walletService, 'getExpendedVoucherMrc').and.returnValue(throwError({ status: 404 }));
      component.showVouchersAvailableList();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  it('onClickExportInvoiceButton annulla', () => {
    let button = fixture.debugElement.query(By.css('#modal-info-footer-button-cancel')).nativeElement;
    component.onClickExportInvoiceButton();
    
    expect(button.disabled).toBeFalsy();
  });

  it('onClickExportInvoiceButton modal should show', fakeAsync(() => {
    let modal = fixture.debugElement.query(By.css('#modalBankConfirm')).nativeElement;
    component.mrcVouchersInPage = helper.createVoucherArray(3);
    component.onClickExportInvoiceButton();
    fixture.detectChanges();
    tick(300);
    expect(modal).toHaveClass('show');
  }));

  describe('selected voucher table', () => {
    let modal;

    beforeEach(() => {
      modal = fixture.debugElement.query(By.css('#modalBankConfirm'));
    });

    it('should display 3 lines if there are 3 vouchers', () => {
      let vouchers = helper.createVoucherArray(3);
      component.mrcVouchersInPage = vouchers;
      component.onClickExportInvoiceButton();
      fixture.detectChanges();
      let table = modal.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', () => {
      let vouchers = helper.createVoucherArray(3);
      component.mrcVouchersInPage = vouchers;
      component.onClickExportInvoiceButton();
      fixture.detectChanges();
      fixture.detectChanges();
      let next: HTMLElement = modal.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display five lines if there are more than 5 vouchers', () => {
      let vouchers = helper.createVoucherArray(20);
      component.mrcVouchersInPage = vouchers;
      component.onClickExportInvoiceButton();
      fixture.detectChanges();
      let table = modal.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let vouchers = helper.createVoucherArray(20);
      component.mrcVouchersInPage = vouchers;
      component.onClickExportInvoiceButton();
      fixture.detectChanges();
      fixture.detectChanges();
      let next: HTMLElement = modal.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should call error modal if there are no vouchers selected', () => {
      let spy = spyOn(modalsManager, 'errorsModalGeneric');
      component.mrcVouchersInPage = new Array<VoucherDTO>();
      component.onClickExportInvoiceButton();
      fixture.detectChanges();
      let table = modal.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('sendInvoice', () => {
    let vouchers;
    let spyRefresh;
    beforeEach(() => {
      spyOn(component, 'checkBankData').and.returnValue(true);
      spyRefresh = spyOn(component, 'showVouchersAvailableList');
      vouchers = new DTOList<VoucherDTO>();
    });

    it('should disable cancel button', () => {
     spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
     component.sendInvoice();
     let button = fixture.debugElement.query(By.css('#modal-info-footer-button-cancel')).nativeElement;

      expect(button.disabled).toBeTruthy();
    });

    it('should refresh voucher list if response ok ', fakeAsync(() => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'OK';
      component.sendInvoice();
      tick(15000);

      expect(spyRefresh).toHaveBeenCalled();
     }));

     it('should enable x button if response ok ', fakeAsync(() => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'OK';
      component.sendInvoice();
      tick(15000);
      let button = fixture.debugElement.query(By.css('#mrc-invoice-modal-button-x')).nativeElement;

      expect(button.disabled).toBeFalsy();
     }));

     it('should show success message if response ok ', fakeAsync(() => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'OK';
      component.sendInvoice();
      tick(15000);
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#mrc-invoice-modal-redeem-voucher-body-success'));

      expect(element).toBeTruthy();
     }));

     it('should show correct success message if response ok ', fakeAsync(() => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'OK';
      component.sendInvoice();
      tick(15000);
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#mrc-invoice-success-description'));

      expect(element.nativeElement.innerText).toEqual(translate.IT.MODALS.BODY.INVOICES.SUCCESS.VOUCHERS_EXPORT_BODY);
     }));

     it('should enable x button if response is not ok', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'KO';
      component.sendInvoice();
      let button = fixture.debugElement.query(By.css('#mrc-invoice-modal-button-x')).nativeElement;

      expect(button.disabled).toBeFalsy();
     });

     it('should show error message if response is not ok', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'KO';
      component.sendInvoice();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#mrc-invoice-modal-redeem-voucher-body-error'));

      expect(element).toBeTruthy();
     });

     it('should show correct error message if response is not ok', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(of(vouchers));
      vouchers.status = 'KO';
      component.sendInvoice();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#mrc-modify-error-description'));
      
      expect(element.nativeElement.innerText).toEqual(translate.IT.MODALS.BODY.INVOICES.ERRORS.VOUCHERS_ERROR);
     });

     it('should enable x button if response is an error', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(throwError({ status: 404 }));
      vouchers.status = 'KO';
      component.sendInvoice();
      let button = fixture.debugElement.query(By.css('#mrc-invoice-modal-button-x')).nativeElement;

      expect(button.disabled).toBeFalsy();
     });

     it('should show error message if response is an error', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(throwError({ status: 404 }));
      vouchers.status = 'KO';
      component.sendInvoice();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#mrc-invoice-modal-redeem-voucher-body-error'));

      expect(element).toBeTruthy();
     });

     it('should show correct error message if response is an error', () => {
      spyOn(transVoucherService, 'redeemVoucherOrders').and.returnValue(throwError({ status: 404 }));
      vouchers.status = 'KO';
      component.sendInvoice();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#mrc-modify-error-description'));
      
      expect(element.nativeElement.innerText).toEqual(translate.IT.MODALS.BODY.INVOICES.ERRORS.VOUCHERS_ERROR);
     });

  });

  it('should show detail modal (showOrderDetails)', fakeAsync(() => {
    let trc :TransactionDTO = helper.createTransactionArray(1)[0];
    let modal = fixture.debugElement.query(By.css('#mrc-invoice-modal-vouchers-detail'));
    component.showOrderDetails(trc);
    tick(100);
    
    expect(modal.nativeElement).toHaveClass('show');
  }));

  describe('closeModal', () => {

    beforeEach(fakeAsync(() => {
      //Apro il modal
      component.mrcVouchersInPage = helper.createVoucherArray(3);
      component.onClickExportInvoiceButton();
      tick(300);
    }));

    it('should hide recap modal', () => {
      let modal = fixture.debugElement.query(By.css('#modalBankConfirm')).nativeElement;
      component.closeModal();
      expect(modal).not.toHaveClass('show');
    });

    it('should call killVouchersSelection', () => {
      let spy = spyOn(component, 'onKillVouchersSelection');
      component.closeModal();
      expect(spy).toHaveBeenCalled();
    });

    it('should refresh order list', () => {
      let spy = spyOn(component, 'showRedeemedOrderList');
      component.closeModal();
      expect(spy).toHaveBeenCalled();
    });

    it('should enable cancel button', () => {
      let button = fixture.debugElement.query(By.css('#modal-info-footer-button-cancel')).nativeElement;
      component.closeModal();
      expect(button.disabled).toBeFalsy();
    });

  });    
});

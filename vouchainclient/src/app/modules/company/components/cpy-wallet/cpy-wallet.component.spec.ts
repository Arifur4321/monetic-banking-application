import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CpyWalletComponent } from './cpy-wallet.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { VoucherDTO } from 'src/app/model/voucher-dto';
import { DTOList } from 'src/app/model/dto-list';

import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('CpyWalletComponent', () => {
  let component: CpyWalletComponent;
  let fixture: ComponentFixture<CpyWalletComponent>;
  let cpyVouchersService: CpyVouchersService;
  let helper: Helper;
  let translate: TranslateTestingUtility<CpyWalletComponent>;
  let authenticatorService: AuthenticationService;
  let modalManager: ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyWalletComponent],
      imports: [
        imports,
        NgxPaginationModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyWalletComponent);
    component = fixture.componentInstance;
    cpyVouchersService = fixture.debugElement.injector.get(CpyVouchersService);
    authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
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
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));
      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(5);
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should only display five lines if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let activeVouchers = new DTOList<VoucherDTO>();
      activeVouchers.list = helper.createVoucherArray(20);
      activeVouchers.status = "OK";
      let spy = spyOn(cpyVouchersService, 'showActiveVouchers').and.returnValue(of(activeVouchers))
      component.showActiveVouchers();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
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

  describe('purchasable voucher table', () => {

    it('should display 3 lines if there are 3 vouchers', () => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = helper.createVoucherArray(3);
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));
      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 vouchers', fakeAsync(() => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = helper.createVoucherArray(3);
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      tick(1000);
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    }));

    it('should only display five lines if there are more than 5 vouchers', () => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = helper.createVoucherArray(20);
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(5);
    });

    it('next button should be enabled if there are more than 5 vouchers', () => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = helper.createVoucherArray(20);
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no vouchers', () => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = new Array();
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let rows = tables[1].queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no vouchers', () => {
      let purchasableVouchers = new DTOList<VoucherDTO>();
      purchasableVouchers.list = new Array();
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(of(purchasableVouchers))
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.TABLES.VOUCHERS.EMPTY_TABLE);
    });

    it('should display the correct message if an error occours', () => {
      let spy = spyOn(cpyVouchersService, 'showPurchasableVouchers').and.returnValue(throwError({ status: 404 }));
      component.showPurchasableVouchers();
      fixture.detectChanges();
      let tables = fixture.debugElement.queryAll(By.css('tbody'));
      let row = tables[1].query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });
  });

  it('should convert correctly (idifyVoucherValueAndEndDate)', () => {
    let id = '20020201212';

    expect(component.idifyVoucherValueAndEndDate('2.00', '2020-12-12')).toEqual(id);
  });

  it('should create the correct voucher (addSelectedVouchersDTO)', () => {
    let vchPrep: VoucherDTO = helper.createVoucherArray(1)[0];
    component.selectedPurchasableQuantities.set('120201212', 1)
    spyOn(component, 'idifyVoucherValueAndEndDate').and.returnValue('120201212');
    spyOn(authenticatorService, 'getLoggedUserId').and.returnValue('1');
    component.addSelectedVouchersDTO(vchPrep);

    expect(component.purchasedVouchersDTO[0]).toEqual(vchPrep);
  });

  it('(onClickBuyVoucher) true', fakeAsync(() => {
    let vchPrep: VoucherDTO = helper.createVoucherArray(1)[0];
    component.selectedPurchasableVouchers.add(vchPrep);
    let modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher')).nativeElement;
    component.onClickBuyVoucher();
    tick(1000);
    fixture.detectChanges();

    expect(modal).toHaveClass('show');
  }));

  it('(onClickBuyVoucher) false', fakeAsync(() => {
    component.selectedPurchasableVouchers = new Set();
    let modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher')).nativeElement;
    let spy = spyOn(modalManager, 'errorsModalGeneric').and.callThrough();
    component.onClickBuyVoucher();
    tick(1000);
    fixture.detectChanges();

    expect(modal).not.toHaveClass('show');
    expect(spy).toHaveBeenCalled();
  }));

  describe('closeModalBuyVoucher', () => {
    let modal;
    let router;

    beforeEach(fakeAsync(() => {
      router = TestBed.get(Router);
      let vchPrep: VoucherDTO = helper.createVoucherArray(1)[0];
      component.selectedPurchasableVouchers.add(vchPrep);
      modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher')).nativeElement;
      component.onClickBuyVoucher();
      tick(1000);
      fixture.detectChanges();
    }));

    it('should hide modal', fakeAsync(() => {
      component.closeModalBuyVoucher();
      tick(1000);
      fixture.detectChanges();

      expect(modal).not.toHaveClass('show');
    }));

    it('should navigate to orders if successBuyvouchers is true', () => {
      component.successBuyVoucher = true;
      let spy = spyOn(router, 'navigate');
      component.closeModalBuyVoucher();

      expect(spy).toHaveBeenCalledWith(['company/cpyDashboard/orders']);
    });

  });

  describe('onClickConfirmPurchase', () => {
    let response

    beforeEach(fakeAsync(() => {
      let vchPrep: VoucherDTO = helper.createVoucherArray(1)[0];
      component.selectedPurchasableVouchers.add(vchPrep);
      spyOn(component, "addSelectedVouchersDTO").and.callFake(() => {
        component.purchasedVouchersDTO[0] = vchPrep;
      })
      response = new DTOList<VoucherDTO>();
      
    }));

    it(' response OK', () => {
      response.status = 'OK';
      spyOn(cpyVouchersService, 'purchaseVouchers').and.returnValue(of(response));
      component.onClickConfirmPurchase();
      fixture.detectChanges();
      translate.updateTranslation();
      let modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher'));
      let title = modal.query(By.css('h4'));

      expect(title.nativeElement.innerText).toEqual(translate.IT.MODALS.HEADER.WALLET.SUCCESS.BUY_VOUCHER_TITLE);
    });

    it('response not OK', () => {
      response.status = 'KO';
      spyOn(cpyVouchersService, 'purchaseVouchers').and.returnValue(of(response));
      component.onClickConfirmPurchase();
      fixture.detectChanges();
      translate.updateTranslation();
      let modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher'));
      let title = modal.query(By.css('h4'));

      expect(title.nativeElement.innerText).toEqual(translate.IT.MODALS.HEADER.WALLET.ERRORS.BUY_VOUCHER_TITLE);
    });

    it('response error', () => {
      spyOn(cpyVouchersService, 'purchaseVouchers').and.returnValue(throwError({status: 404}));
      component.onClickConfirmPurchase();
      fixture.detectChanges();
      translate.updateTranslation();
      let modal = fixture.debugElement.query(By.css('#cpy-wallet-modal-buy-voucher'));
      let title = modal.query(By.css('h4'));

      expect(title.nativeElement.innerText).toEqual(translate.IT.MODALS.HEADER.WALLET.ERRORS.BUY_VOUCHER_TITLE);
    });
  });

  describe('onClickCreateNewVoucher', () => {
    let response

    beforeEach(fakeAsync(() => {
      response = new VoucherDTO();
    }));

    it(' response OK', () => {
      response.status = 'OK';
      spyOn(cpyVouchersService, 'createNewVoucherType').and.returnValue(of(response));
      component.onClickCreateNewVoucher();

      expect(component.successNewVoucher).toBeTruthy();
    });

    it('response not OK', () => {
      response.status = 'KO';
      spyOn(cpyVouchersService, 'createNewVoucherType').and.returnValue(of(response));
      component.onClickCreateNewVoucher();
      
      expect(component.errorNewVoucher).toBeTruthy();
    });

    it('response error', () => {
      spyOn(cpyVouchersService, 'createNewVoucherType').and.returnValue(throwError({status: 404}));
      component.onClickCreateNewVoucher();

      expect(component.errorNewVoucher).toBeTruthy();
    });
  });

});




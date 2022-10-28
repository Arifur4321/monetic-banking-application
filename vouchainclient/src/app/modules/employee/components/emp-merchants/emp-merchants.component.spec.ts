import { ComponentFixture, TestBed, getTestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { EmpMerchantsComponent } from './emp-merchants.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { imports, Helper } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpShowMerchantsService } from '../../services/rest/emp-show-merchants.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';

import { DTOList } from 'src/app/model/dto-list';
import { MerchantDTO } from 'src/app/model/merchant-dto';

describe('EmpMerchantsComponent', () => {
  let component: EmpMerchantsComponent;
  let fixture: ComponentFixture<EmpMerchantsComponent>;

  let authenticatorService: AuthenticationService;
  let empShowMrcService: EmpShowMerchantsService;
  let empVouchersService: EmpVouchersService;
  let helper: Helper;
  let translate: TranslateTestingUtility<EmpMerchantsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpMerchantsComponent ],
      imports:[
        imports,
        NgxPaginationModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpMerchantsComponent);
    component = fixture.componentInstance;
    authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
    empShowMrcService = fixture.debugElement.injector.get(EmpShowMerchantsService);
    empVouchersService = fixture.debugElement.injector.get(EmpVouchersService);
    helper = new Helper();
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('merchant table', () => {
    let merchantList_table;

    beforeEach(() => {
      merchantList_table = new DTOList<MerchantDTO>();
      spyOn(empShowMrcService, 'showMerchantsList').and.returnValue(of(merchantList_table));
    });

    it('should display 3 lines if there are 3 merchants', () => {
      merchantList_table.list = helper.createMerchantArray(3);
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(3);
    });

    it('next button should be disabled if there are less than 6 merchants', () => {
      merchantList_table.list = helper.createMerchantArray(5);
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let next = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).toHaveClass('disabled');
    });

    it('should display 5 lines if there are more than 5 merchants', () => {
      merchantList_table.list = helper.createMerchantArray(8);
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(5);

    });

    it('next button should be enabled if there are more than 5 merchants', () => {
      merchantList_table.list = helper.createMerchantArray(8);
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let next: HTMLElement = fixture.debugElement.query(By.css('.pagination-next')).nativeElement;

      expect(next).not.toHaveClass('disabled');
    });

    it('should display one row if there are no merchants', () => {
      merchantList_table.list = new Array();
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let rows = table.queryAll(By.css('tr'));

      expect(rows.length).toBe(1);
    });

    it('should display the correct message if there are no merchants', () => {
      merchantList_table.list = new Array();
      merchantList_table.status = "OK";
      component.showMerchantsList();
      fixture.detectChanges();
      let table = fixture.debugElement.query(By.css('tbody'));
      let row = table.query(By.css('tr'));
      let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
      expect(h1.innerText).toEqual(translate.IT.MERCHANTS.TABLE_EMPTY);
    });

  });

  it('should display the correct message if an error occours', () => {
    let spy = spyOn(empShowMrcService, 'showMerchantsList').and.returnValue((throwError({ status: 404 })));
    component.showMerchantsList();
    fixture.detectChanges();
    let table = fixture.debugElement.query(By.css('tbody'));
    let row = table.query(By.css('tr'));
    let h1: HTMLHeadElement = row.query(By.css('h1')).nativeElement
    expect(h1.innerText).toEqual(translate.IT.ERRORS.GENERIC);
  });

});

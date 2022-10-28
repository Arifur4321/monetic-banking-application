import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';

import { CpyUploadContractComponent } from './cpy-upload-contract.component';

import { imports} from 'src/test-utility/test-utilities';
import { By } from '@angular/platform-browser';
import { CpyUploadService } from '../../services/rest/cpy-upload.service';
import { throwError, of } from 'rxjs';
import { CompanyDTO } from 'src/app/model/company-dto';
import { Router } from '@angular/router';
import * as myMessages from 'src/globals/messages';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

describe('CpyUploadContractComponent', () => {
  let component: CpyUploadContractComponent;
  let fixture: ComponentFixture<CpyUploadContractComponent>;
  let uploadService: CpyUploadService;
  let router: Router;
  let translate: TranslateTestingUtility<CpyUploadContractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyUploadContractComponent],
      imports: [
        imports
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyUploadContractComponent);
    component = fixture.componentInstance;
    uploadService = fixture.debugElement.injector.get(CpyUploadService);
    router = TestBed.get(Router);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onUploadclick', () => {

    it('should display a message if there are no file selected', () => {
      component.fileUpload = fixture.debugElement.query(By.css('#fileUpload'));
      component.fileUpload.nativeElement.files = undefined;
      component.onUploadClick();
      translate.updateTranslation();
      let message = fixture.debugElement.query(By.css('#cpy-upcon-err-msg'));

      expect(message).toBeTruthy();
      expect(message.nativeElement.innerText).toEqual(translate.IT.ERRORS.ERROR_UPLOAD_CONTRACT);
    });

  });

});

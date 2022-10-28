import { TranslateService } from "@ngx-translate/core";
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

//per tradurre le stringhe già presenti nell'html usare il metodo, 
//per tradurre quelle inserite tramite angular basta fixture.detectChanges() 
//ma bisogna creare la testing utility (inizializza le cose che fanno funzionare la traduzione)

export class TranslateTestingUtility<T> {
  private translate: TranslateService;
  private http: HttpTestingController;
  private fixture: ComponentFixture<T>;
  IT = require('../assets/i18n/it.json');

  constructor(fixture: ComponentFixture<T>, testBed: TestBed) {
    this.translate = testBed.get(TranslateService);
    this.http = testBed.get(HttpTestingController);
    this.translate.setTranslation('it', this.IT);
    this.fixture = fixture;
  }

  updateTranslation() {
    spyOn(this.translate, 'getBrowserLang').and.returnValue('it');
    this.http.match('./assets/i18n/it.json')[0].flush(this.IT);
    this.fixture.detectChanges();
  }

}
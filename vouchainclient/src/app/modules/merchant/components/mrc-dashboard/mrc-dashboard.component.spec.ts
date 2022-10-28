import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MrcDashboardComponent } from './mrc-dashboard.component';
import { By } from '@angular/platform-browser';

describe('MrcDashboardComponent', () => {
  let component: MrcDashboardComponent;
  let fixture: ComponentFixture<MrcDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MrcDashboardComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expected to be defined', () => {
    expect(component).toBeDefined();
  });
  it('expected to have img tag!', () => {
    const usedClass = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(usedClass.innerHTML).toBeDefined();
  });
  it('expected to have in img tag a Class called .img-fluid!', () => {
    const usedClass = fixture.debugElement.query(By.css('.img-fluid'))
      .nativeElement;
    expect(usedClass.innerHTML).toBeDefined();
  });
  it('expected to have in img tag a Id called #mrc-bottom-image-dashboard!', () => {
    const usedClass = fixture.debugElement.query(
      By.css('#mrc-bottom-image-dashboard')
    ).nativeElement;
    expect(usedClass.innerHTML).toBeDefined();
  });

  //Da rifare con la REGEX è più preciso!
  it('expected to have in img tag an Attribute src equal to /assets/images/vouchain_app02bis.png', () => {
    const tag = fixture.debugElement.nativeElement.querySelector(
      'img.img-fluid#mrc-bottom-image-dashboard'
    );
    //element.src avrà come valore http://localhost:9876/assets/images/vouchain_app02bis.png perchè lo si sta testando cambiando l'uri(è normale) si prende la parte interessata..
    expect(tag.src.toString().substring(21)).toEqual(
      '/assets/images/vouchain_app02bis.png'
    );
  });

  it('expected tag app-mrc-navbar to be Truthy', () => {
    const tag = fixture.debugElement.nativeElement.querySelector(
      'app-mrc-navbar'
    );
    expect(tag).toBeTruthy();
  });

  it('expected tag router-outlet to be Truthy', () => {
    const tag = fixture.debugElement.nativeElement.querySelector(
      'router-outlet'
    );
    expect(tag).toBeTruthy();
  });

});

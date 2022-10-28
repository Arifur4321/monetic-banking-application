import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  isNotEmpty(value: string): boolean {
    return value !== undefined && value.trim().length > 0;
  }

  isValidCap(cap: string): boolean {
    let regex = new RegExp(/^[0-9]{5}$/);

    return regex.test(cap);
  }

  isValidCFiscale(cf: string): boolean {
    if (cf === undefined) {
      return false;
    }

    /* Using cfpiva library: https://github.com/dennybiasiolli/node-cfpiva */
    var cfpiva = require('cfpiva');

    return cfpiva.controllaCF(cf) || cfpiva.controllaPIVA(cf);
  }

  isValidCuu(cuu: string): boolean {
    let regex = new RegExp(/^[0-9a-zA-Z]{7}$/);

    return regex.test(cuu);
  }

  isValidPhone(phone: string): boolean {
    let regex = new RegExp(/^[0-9]*$/);

    return regex.test(phone) && this.isNotEmpty(phone);
  }

  isValidEmail(email: string): boolean {
    /* More info: https://emailregex.com/ */
    let regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return regex.test(email);
  }

  isValidIBAN(iban: string): boolean {
    /* questo è valido per l'iban italiano */
    /* let regex = new RegExp('^[A-Za-z]{2}[0-9]{2}[A-Z]{1}[0-9]{22}$'); */
    /* let regex = new RegExp(
      /^[A-Za-z]{2}[0-9]{2}[A-Za-z][0-9]{10}[0-9A-Za-z]{12}$/
    );
    
    return regex.test(iban); */

    /* Using iban.js library: https://github.com/arhs/iban.js */
    var IBAN = require('iban');

    return IBAN.isValid(iban);
  }

  isValidNewPass(oldPassword: string, newPassword: string): boolean {
    return !(oldPassword === newPassword);
  }

  isValidPassRe(password: string, passretype: string): boolean {
      return passretype === password;
  }

  isValidPassword(password: string): boolean {
    /* Password must have at least: one lowercase letter, one uppercase letter and one number. It should accept any characters and lenght must be minimum 8. */
    let regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\S]{8,}$/
    );

    return regex.test(password);
  }

  isValidPIVA(piva: string): boolean {
    if (piva === undefined) {
      return false;
    }

    /* Using cfpiva.js library: https://github.com/dennybiasiolli/node-cfpiva */
    var cfpiva = require('cfpiva');

    return cfpiva.controllaPIVA(piva);
  }

  readableVoucherName(vchName: string): string {
    let voucherName: string[];

    voucherName = vchName.split(/\_/g);

    return voucherName[0] + ' ' + voucherName[1] + ' ' + voucherName[2] + ' €';
  }
}

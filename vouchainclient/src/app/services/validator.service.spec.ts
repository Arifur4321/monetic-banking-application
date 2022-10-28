import { TestBed } from '@angular/core/testing';

import { ValidatorService } from './validator.service';

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isNotEmpty', () => {
    it('should return true on isNotEmpty when passing a string', () => {
      expect(service.isNotEmpty('abcdef')).toBeTruthy();
    });

    it('should return false on isNotEmpty when passing an empty string', () => {
      expect(service.isNotEmpty('')).toBeFalsy();
    });

    it('should return false on isNotEmpty when passing a blank string', () => {
      expect(service.isNotEmpty('     ')).toBeFalsy();
    });

    it('should return false on isNotEmpty when passing an undefined value', () => {
      let test
      expect(service.isNotEmpty(test)).toBeFalsy();
    });
  });

  describe('VisValidCap', () => {
    it('should return true on isValidCap when passing a valid Cap', () => {
      expect(service.isValidCap('00125')).toBeTruthy();
    });

    it('should return false on isValidCap when empty', () => {
      expect(service.isValidCap('')).toBeFalsy();
    });

    it('should return false on isValidCap when blank', () => {
      expect(service.isValidCap('        ')).toBeFalsy();
    });

    it('should return false on isValidCap when longer than 5 char', () => {
      expect(service.isValidCap('012345')).toBeFalsy();
    });

    it('should return false on isValidCap when shorter than 5 char', () => {
      expect(service.isValidCap('0123')).toBeFalsy();
    });

    it('should return false on isValidCap when passing mixed letters and numbers', () => {
      expect(service.isValidCap('00ab5')).toBeFalsy();
    });
  });

  describe('isValidCuu', () => {
    it('should return true on isValidCuu when passing a valid Cuu', () => {
      expect(service.isValidCuu('00125ab')).toBeTruthy();
    });

    it('should return false on isValidCuu when longer than 7 char', () => {
      expect(service.isValidCuu('123abc45')).toBeFalsy();
    });

    it('should return false on isValidCuu when shorter than 7 char', () => {
      expect(service.isValidCuu('123ab1')).toBeFalsy();
    });

    it('should return false on isValidCuu if empty', () => {
      expect(service.isValidCuu('')).toBeFalsy();
    });

    it('should return false on isValidCuu if blank', () => {
      expect(service.isValidCuu('      ')).toBeFalsy();
    });
  });

  describe('isValidEmail', () => {
    it('should return true on isValidEmail when passing a valid email', () => {
      expect(service.isValidEmail('prova@gmail.com')).toBeTruthy();
    });

    it('should return true on isValidEmail when passing a valid email (with uppercase)', () => {
      expect(service.isValidEmail('PROva@gmail.com')).toBeTruthy();
    });

    it('should return false on isValidEmail if empty', () => {
      expect(service.isValidEmail('')).toBeFalsy();
    });

    it('should return false on isValidEmail if only spaces', () => {
      expect(service.isValidEmail('    ')).toBeFalsy();
    });

    it('should return false on isValidEmail without @', () => {
      expect(service.isValidEmail('provagmail.com')).toBeFalsy();
    });

    it('should return false on isValidEmail without dots', () => {
      expect(service.isValidEmail('prova@gmailcom')).toBeFalsy();
    });

    it('should return false on isValidEmail without dots after @', () => {
      expect(service.isValidEmail('prova.prova@gmailcom')).toBeFalsy();
    });

    it('should return false on isValidEmail without user', () => {
      expect(service.isValidEmail('@gmail.com')).toBeFalsy();
    });

    it('should return false on isValidEmail without host name', () => {
      expect(service.isValidEmail('prova@.com')).toBeFalsy();
    });

    it('should return false on isValidEmail without domain', () => {
      expect(service.isValidEmail('prova@gmail.')).toBeFalsy();
    });

    it('should return false on isValidEmail with spaces in', () => {
      expect(service.isValidEmail('prova @gmail.com')).toBeFalsy();
    });
  });

  describe('isValidIBAN', () => {
    it('should return true on isValidIBAN when passing a valid IBAN', () => {
      expect(service.isValidIBAN('IT89U0300203280757297997738')).toBeTruthy();
    });

    it('should return false on isValidIBAN when passing an empty string', () => {
      expect(service.isValidIBAN('')).toBeFalsy();
    });

    it('should return false on isValidIBAN when passing a blank string', () => {
      expect(service.isValidIBAN('    ')).toBeFalsy();
    });

    it('should return false on isValidIBAN when passing an iban without nation', () => {
      expect(service.isValidIBAN('89U0300203280757297997738')).toBeFalsy();
    });

    it('should return false on isValidIBAN when passing an iban with too much letters', () => {
      expect(service.isValidIBAN('ITA89U0300203280757297997738')).toBeFalsy();
    });

    it('should return false on isValidIBAN when passing an iban with wrong european check digits', () => {
      expect(service.isValidIBAN('IT88U0300203280757297997738')).toBeFalsy();
    });

    //ITA only
    it('should return false on isValidIBAN when passing an iban with wrong CIN (control code)', () => {
      expect(service.isValidIBAN('IT89A0300203280757297997738')).toBeFalsy();
    });
  });

  describe('isValidPassword', () => {
    it('should return true on isValidPassword when passing a valid password with uppercase, lowercase, and numbers', () => {
      expect(service.isValidPassword('Abcd1234')).toBeTruthy();
    });

    it('should return true on isValidPassword when passing a valid password with uppercase, lowercase, numbers, and symbols', () => {
      expect(service.isValidPassword('Abcd123!')).toBeTruthy();
    });

    it('should return false on isValidPassword when passing an empty string', () => {
      expect(service.isValidPassword('')).toBeFalsy();
    });

    it('should return false on isValidPassword when passing a blank string', () => {
      expect(service.isValidPassword('     ')).toBeFalsy();
    });

    it('should return false on isValidPassword when passing a password too short', () => {
      expect(service.isValidPassword('Abcd123')).toBeFalsy();
    });

    it('should return false on isValidPassword when passing a password without uppercase', () => {
      expect(service.isValidPassword('abcd1234')).toBeFalsy();
    });

    it('should return false on isValidPassword when passing a password without lowercase', () => {
      expect(service.isValidPassword('ABCD1234')).toBeFalsy();
    });

    it('should return false on isValidPassword when passing a password without number', () => {
      expect(service.isValidPassword('ABCDabcd')).toBeFalsy();
    });

    it('should return true on isValidPassRe when passing the same password', () => {
      expect(service.isValidPassRe('Abcd1234', 'Abcd1234')).toBeTruthy();
    });

    it('should return false on isValidPassRe when passing a different password', () => {
      expect(service.isValidPassRe('Abcd1234', 'abcd1234')).toBeFalsy();
    });

    it('should return true on isValidNewPass when passing a new valid password', () => {
      expect(service.isValidNewPass('Abcd1234', 'Efgh5678')).toBeTruthy();
    });

    it('should return false on isValidNewPass when passing the same password', () => {
      expect(service.isValidNewPass('Abcd1234', 'Abcd1234')).toBeFalsy();
    });
  });

  describe('isValidCFiscale()', () => {

    it('should return true if code is valid', () => {
      expect(service.isValidCFiscale('dsncld93l46h501r')).toBeTruthy();
    });

    it('flag attribute should be false if code is empty', () => {
      expect(service.isValidCFiscale('')).toBeFalsy();
    });

    it('flag attribute should be false if code is blank', () => {
      expect(service.isValidCFiscale('      ')).toBeFalsy();
    });

    it('flag attribute should be false if code is undefined', () => {
      let test;
      expect(service.isValidCFiscale(test)).toBeFalsy();
    });

    it('flag attribute should be false if code is shorter than expected', () => {
      expect(service.isValidCFiscale('dsn93l46h501r')).toBeFalsy();
    });

    it('flag attribute should be false if code is longer than expected', () => {
      expect(service.isValidCFiscale('dsncld93l46h501rr')).toBeFalsy();
    });

    it('flag attribute should be false if code have less letters than expected', () => {
      expect(service.isValidCFiscale('0sncld93l46h501r')).toBeFalsy();
    });

    it('flag attribute should be false if code have numbers in place of letters', () => {
      expect(service.isValidCFiscale('dsn4ld93cldl46h501r')).toBeFalsy();
    });

    it('flag attribute should be false if code doesn\'t end with valid control character ', () => {
      expect(service.isValidCFiscale('dsncld93l46h501i')).toBeFalsy();
    });
  });

  describe('isInvalidPIVA()', () => {
    it('flag attribute should be true if pIva is valid  ', () => {
      expect(service.isValidPIVA('07643520567')).toBeTruthy();
    });

    it('flag attribute should be false if pIva is empty', () => {
      expect(service.isValidPIVA('')).toBeFalsy();
    });

    it('flag attribute should be false if pIva is blank', () => {
      expect(service.isValidPIVA('     ')).toBeFalsy();
    });

    it('flag attribute should be false if pIva is undefined', () => {
      let test;
      expect(service.isValidPIVA(test)).toBeFalsy();
    });

    it('flag attribute should be false if pIva is shorter than 11 char', () => {
      expect(service.isValidPIVA('123456')).toBeFalsy();
    });

    it('flag attribute should be false if pIva is longer than 11 char', () => {
      expect(service.isValidPIVA('012345678912')).toBeFalsy();
    });

    it('flag attribute should be false if control character is wrong', () => {
      expect(service.isValidPIVA('07643520566')).toBeFalsy();
    });
  });
});

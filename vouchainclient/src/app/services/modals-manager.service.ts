/* --- DEFAULT IMPORTS --- */
import { Injectable } from '@angular/core';

/* --- CUSTOM IMPORTS --- */

/* jQuery */
declare var $: any;

/* Services */
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ModalsManagerService {
  /* vvv ATTRIBUTES vvv*/

  /* vvv ERRORS MODAL vvv */

  /* The Entire Modal */
  private errorsModal = $('#vouchain-modal-errors');

  /* The Header */
  private errorsModalHeader = $('#vouchain-modal-errors-header');
  private errorsModalHeaderTitle = $('#vouchain-modal-errors-header-title');
  private errorsModalHeaderButton = $('#vouchain-modal-errors-header-button');

  /* The Body */
  private errorsModalBody = $('#vouchain-modal-errors-body');

  /* The Footer */
  private errorsModalFooter = $('#vouchain-modal-errors-footer');
  private errorsModalFooterButton = $('#vouchain-modal-errors-footer-button');

  /* ^^^ ERRORS MODAL ^^^ */

  /* vvv INFO MODAL vvv */

  /* The Entire Modal */
  private infoModal = $('#vouchain-modal-info');

  /* The Header */
  private infoModalHeader = $('#vouchain-modal-info-header');
  private infoModalHeaderTitle = $('#vouchain-modal-info-header-title');
  private infoModalHeaderButton = $('#vouchain-modal-info-header-button');

  /* The Body */
  private infoModalBody = $('#vouchain-modal-info-body');

  /* The Footer */
  private infoModalFooter = $('#vouchain-modal-info-footer');
  private infoModalFooterButton = $('#vouchain-modal-info-footer-button');

  /* ^^^ INFO MODAL ^^^ */

  /* vvv SUCCESS MODAL vvv */

  /* The Entire Modal */
  private successModal = $('#vouchain-modal-success');

  /* The Header */
  private successModalHeader = $('#vouchain-modal-success-header');
  private successModalHeaderTitle = $('#vouchain-modal-success-header-title');
  private successModalHeaderButton = $('#vouchain-modal-success-header-button');

  /* The Body */
  private successModalBody = $('#vouchain-modal-success-body');

  /* The Footer */
  private successModalFooter = $('#vouchain-modal-success-footer');
  private successModalFooterButton = $('#vouchain-modal-success-footer-button');

  /* ^^^ SUCCESS MODAL ^^^ */

  /* ^^^ ATTRIBUTES ^^^*/

  constructor(private translationService: TranslateService) { }

  /* vvv METHODS vvv */

  /* vvv ERRORS MODAL vvv */

  errorsModalGeneric(i18nKeyForTitle: string, i18nKeyForBody: string, value?) {
    this.errorsModalReset();

    this.errorsModalHeaderTitle.html(
      this.translationService.instant(i18nKeyForTitle)
    );
    this.errorsModalBody.html(
      '<p>' +
      this.translationService.instant(i18nKeyForBody, { value }) +
      '</p>'
    );
    this.errorsModalFooterButton.html(
      this.translationService.instant('MODALS.FOOTER.CLOSE_BUTTON')
    );

    this.errorsModalShow();
  }

  /* TODO: metodi per modificare l'HTML di ogni singolo, sono necessari??? */
  /* 
  errorsModalSetHeader(htmlForHeader: string) {
    this.errorsModalHeader.html(htmlForHeader);
  }

  errorsModalSetHeaderTitle(htmlForHeaderTitle: string) {
    this.errorsModalHeaderTitle.html(htmlForHeaderTitle);
  }

  errorsModalSetHeaderButton(htmlForHeaderButton: string) {
    this.errorsModalHeaderButton.html(htmlForHeaderButton);
  }
  errorsModalSetBody(htmlForBody: string) {
    this.errorsModalBody.html(htmlForBody);
  }

  errorsModalSetFooter(htmlForFooter: string) {
    this.errorsModalFooter.html(htmlForFooter);
  }

  errorsModalSetFooterButton(htmlForFooterButton: string) {
    this.errorsModalFooterButton.html(htmlForFooterButton);
  }
 */

  errorsModalHide() {
    this.errorsModal.modal('hide');
  }

  errorsModalReset() {
    /* this.errorsModalHeader.html(''); */
    this.errorsModalHeaderTitle.html('');
    /* this.errorsModalHeaderButton.html(''); */
    this.errorsModalBody.html('');
    /* this.errorsModalFooter.html(''); */
    this.errorsModalFooterButton.html('');

    this.errorsModalHide();
  }

  errorsModalShow() {
    this.errorsModal.modal('show');
  }

  /* ^^^ ERRORS MODAL ^^^ */

  /* vvv INFO MODAL vvv */

  infoModalGeneric(i18nKeyForTitle: string, i18nKeyForBody: string) {
    this.infoModalReset();

    this.infoModalHeaderTitle.html(
      this.translationService.instant(i18nKeyForTitle)
    );
    this.infoModalBody.html(
      '<p>' + this.translationService.instant(i18nKeyForBody) + '</p>'
    );
    this.infoModalFooterButton.html(
      this.translationService.instant('MODALS.FOOTER.CLOSE_BUTTON')
    );

    this.infoModalShow();
  }

  infoModalHide() {
    this.infoModal.modal('hide');
  }

  infoModalReset() {
    this.infoModalHeaderTitle.html('');
    this.infoModalBody.html('');
    this.infoModalFooterButton.html('');

    this.infoModalHide();
  }

  infoModalShow() {
    this.infoModal.modal('show');
  }

  /* ^^^ INFO MODAL ^^^ */

  /* vvv SUCCESS MODAL vvv */

  successModalGeneric(i18nKeyForTitle: string, i18nKeyForBody: string, backLink?: string) {
    this.successModalReset();

    this.successModalHeaderTitle.html(
      this.translationService.instant(i18nKeyForTitle)
    );

    if (backLink) {
      this.successModalBody.html(
        '<p>' + this.translationService.instant(i18nKeyForBody) + '</p><br><a type="button" class="btn btn-outline-success float-right" href="' + backLink + '">Torna alla DashBoard</a>'
      );
      $('#vouchain-modal-success-header-button').hide();
      $('#vouchain-modal-success-footer-button').hide();
    } else {
      this.successModalBody.html(
        '<p>' + this.translationService.instant(i18nKeyForBody) + '</p>'
      );

    }

    this.successModalFooterButton.html(
      this.translationService.instant('MODALS.FOOTER.CLOSE_BUTTON')
    );

    this.successModalShow();
  }

  successModalHide() {
    this.successModal.modal('hide');
  }

  successModalReset() {
    this.successModalHeaderTitle.html('');
    this.successModalBody.html('');
    this.successModalFooterButton.html('');

    this.successModalHide();
  }

  successModalShow() {
    this.successModal.modal('show');
  }

  /* ^^^ SUCCESS MODAL ^^^ */

  /* ^^^ METHODS ^^^ */
}

import { Component, OnInit } from '@angular/core';

import * as myMessages from 'src/globals/messages';
import { CompanyDTO } from 'src/app/model/company-dto';
import { CpyUploadService } from '../../services/rest/cpy-upload.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cpy-upload-contract',
  templateUrl: './cpy-upload-contract.component.html',
  styleUrls: ['./cpy-upload-contract.component.css'],
})
export class CpyUploadContractComponent implements OnInit {
  notSelectedFile: boolean = false;
  cpyDTO: CompanyDTO;
  ctrNoValid: boolean = false;
  homepage: string = environment.homeUrl;
  msgUpload: string;

  /* --- */
  errorGeneric: boolean = false;

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;

  constructor(
    private route: Router,
    private translatorService: TranslateService,
    private uploadService: CpyUploadService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.msgUpload = this.translatorService.instant(
        'CPY.UPLOAD_CONTRACT.CTR_SIGNED_DIGITALLY'
      );
    }, 1);
  }

  onFileSelect() {
    if (this.fileUpload.nativeElement.files[0] !== undefined) {
      this.notSelectedFile = false;
      this.ctrNoValid = false;
      this.errorGeneric = false;

      this.msgUpload = this.msgUpload = this.translatorService.instant(
        'CPY.UPLOAD_CONTRACT.FILE_SELECTED',
        { value: this.fileUpload.nativeElement.files[0].name }
      );
    } else {
      this.msgUpload = this.translatorService.instant(
        'CPY.UPLOAD_CONTRACT.CTR_SIGNED_DIGITALLY'
      );
    }
  }

  onUploadClick() {
    this.notSelectedFile = false;
    this.ctrNoValid = false;
    this.errorGeneric = false;

    const fileUpload = this.fileUpload.nativeElement;
    const fileLoaded = fileUpload.files[0];

    if (fileLoaded !== undefined) {
      const formData = new FormData();
      formData.append('cpyContract', fileLoaded);

      this.uploadService.upload(formData).subscribe(
        (response) => {

          this.cpyDTO = response;

          if (this.cpyDTO.status === 'OK') {
            this.route.navigate(['company/cpyDashboard']);
          } else if (this.cpyDTO.status === 'KO') {
            if (this.cpyDTO.errorDescription === myMessages.contractNotValid) {
              this.ctrNoValid = true;
            } else {
              this.errorGeneric = true;
            }
          }
        },
        (error) => {
          this.errorGeneric = true;
        }
      );
    } else {
      this.notSelectedFile = true;
    }
  }
}

/* Default Imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Components Imports */
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ModalsComponent } from 'src/app/components/modals/modals.component';

/* Modules Imports */
import {
  DatePickerModule,
  DateRangePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FooterComponent, ModalsComponent],
  imports: [
    CommonModule,
    DatePickerModule,
    DateRangePickerModule,
    FontAwesomeModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule,
  ],
  exports: [
    DatePickerModule,
    DateRangePickerModule,
    FontAwesomeModule,
    FooterComponent,
    FormsModule,
    ModalsComponent,
    NgxPaginationModule,
    TranslateModule,
  ],
})
export class SharedModule {}

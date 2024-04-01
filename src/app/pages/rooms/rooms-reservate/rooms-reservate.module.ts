import { CommonModule, NgClass, NgStyle } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { DialogBookMeetingComponent } from "./dialog-book-meeting/dialog-book-meeting.component";
import { HourPickerComponent } from "./hour-picker/hour-picker.component";
import { ReservateHoursOverviewComponent } from "./reservate-hours-overview/reservate-hours-overview.component";
import { ReservateOverviewComponent } from "./reservate-overview/reservate-overview.component";
import { ReservateUserMapComponent } from "./reservate-user-map/reservate-user-map.component";
import { RoomsReservatePage } from "./rooms-reservate.page";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CurrentDayClassPipe, DayClassPipe, GetSelectedDatePipe, IsDateBeforeTodayPipe, SplitIntoRowsPipe } from "../../../core/pipes/date-picker.pipe";

const routes: Routes = [
  { path: "", component: RoomsReservatePage },
]

@NgModule({
  declarations: [
    RoomsReservatePage,
    DatePickerComponent,
    HourPickerComponent,
    ReservateHoursOverviewComponent,
    ReservateOverviewComponent,
    ReservateUserMapComponent,

    DialogBookMeetingComponent,
  
  ],
  imports: [
    TranslateModule,

    // Mat
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,

    // Angular
    RouterModule.forChild(routes),

    NgStyle,
    CommonModule,
    NgClass,
    FormsModule,

    //Pipes
    GetSelectedDatePipe,
    SplitIntoRowsPipe,
    DayClassPipe,
    CurrentDayClassPipe,
    IsDateBeforeTodayPipe 
  ],
  providers: [],
})
export class RoomsReservateModule {}

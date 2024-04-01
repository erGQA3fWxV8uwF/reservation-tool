import { CommonModule, NgClass } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BookingsDatePickerComponent } from "./bookings-date-picker/bookings-date-picker.component";
import { BookingsMapPage } from "./bookings-map/bookings-map.page";
import { BookingsPage } from "./bookings.page";
import { DialogDeleteComponent } from "./dialog-delete/dialog-delete.component";
import { CurrentDayClassPipe, DayClassPipe, GetSelectedDatePipe, SplitIntoRowsPipe } from "../../core/pipes/date-picker.pipe";

const routes: Routes = [
  {
    path: "map/:roomId/:reservationId/:date",
    component: BookingsMapPage,
  },
  {
    path: "bookings",
    component: BookingsPage,}
];
@NgModule({
  declarations: [
    BookingsPage,
    BookingsDatePickerComponent,
    BookingsMapPage,
    DialogDeleteComponent,
  ],
  imports: [
    TranslateModule,

    // Mat
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,

    //Angular
    NgClass,
    CommonModule,
    RouterModule.forChild(routes),

    //Pipes
    GetSelectedDatePipe,
    SplitIntoRowsPipe,
    DayClassPipe,
    CurrentDayClassPipe,
  ],
  providers: [],
})
export class BookingsModule {}

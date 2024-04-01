import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { ReservationService } from "src/app/core/services/reservation.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-dialog-delete",
  templateUrl: "./dialog-delete.component.html",
  styleUrls: ["./dialog-delete.component.sass"],
})
export class DialogDeleteComponent {
  storedTheme: string = "theme-light";
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    private _reservationService: ReservationService,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    public themeService: ThemeService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteReservation() {
    const event = this.data.event;
    this._reservationService.deleteReservation(event).then(() => {
      const translatedMessage = this._translateService.instant(
        "MANAGEROOMS.SNACKBARSUCCESFULL"
      );
      this._snackBar.open(translatedMessage, "", {
        panelClass: "success-snackbar",
        duration: 3500,
      });
    });

    this.dialogRef.close();
  }

}

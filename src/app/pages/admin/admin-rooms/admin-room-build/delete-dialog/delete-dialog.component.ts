import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { DeskService } from "src/app/core/services/desk.service";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: "app-delete-dialog",
  templateUrl: "./delete-dialog.component.html",
  styleUrls: ["./delete-dialog.component.sass"],
})
export class DeleteDialogComponent {
  isCheckboxChecked: boolean = false;
  storedTheme: string = "theme-light";

  constructor(
    private _deskService: DeskService,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    public themeService: ThemeService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  


  deleteDesk() {
    this._deskService.deleteDesk(this.data.id).then(() => {
      const translatedMessage = this._translateService.instant(
        "MANAGEROOMS.SNACKBARSUCCESFULL"
      );
      this._snackBar.open(translatedMessage, "", {
        panelClass: "success-snackbar",
        duration: 3500,
      });
    });
  }
}

import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: "app-dialog-delete-room",
  templateUrl: "./dialog-delete-room.component.html",
  styleUrls: ["./dialog-delete-room.component.sass"],
})
export class DialogDeleteRoomComponent {
  storedTheme: string = "theme-light";
  isCheckboxChecked: boolean = false;
  room = this.data.event;
  roomName: string = this.room.name;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _roomService: RoomService,
    private _fireStorageService: FireStorageService,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar, 
    public themeService: ThemeService,

  ) {}



  deleteRoomFromDb() {
    this._roomService
      .deleteRoom(this.room.uuid)
      .then(() => {
        const translatedMessage = this._translateService.instant(
          "MANAGEROOMS.SNACKBARSUCCESFULL"
        );
        this._snackBar.open(translatedMessage, "", {
          panelClass: "success-snackbar",
          duration: 3500,
        });
      })
      .catch((error) => {
        console.error("Error deleting room: ", error);
      });
    this._fireStorageService
      .deleteFile(this.roomName)
      .then(() => {
        const translatedMessage = this._translateService.instant(
          "MANAGEROOMS.SNACKBARSUCCESFULL"
        );
        this._snackBar.open(translatedMessage, "", {
          panelClass: "success-snackbar",
          duration: 3500,
        });
      })
      .catch((error) => {
        console.error("Error deleting file: ", error);
      });
    this._roomService.deleteAllReservationsFromRoom(this.room.uuid);
  }
}

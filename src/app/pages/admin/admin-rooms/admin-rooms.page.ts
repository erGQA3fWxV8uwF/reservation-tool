import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";

import { DialogCreateRoomComponent } from "./dialog-create-room/dialog-create-room.component";
import { DialogDeleteRoomComponent } from "./dialog-delete-room/dialog-delete-room.component";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-admin-rooms',
  templateUrl: './admin-rooms.page.html',
  styleUrls: ['./admin-rooms.page.sass'],
})
export class AdminRoomsPage implements OnInit {
  rooms: any[] = [];
  getRoomsSubscribe: Subscription = new Subscription();
  storedTheme: string = "theme-light";
  displayedColumns: string[] = ["roomName", "type", "buttons"];

  constructor(
    public roomService: RoomService,
    public _reservationService: ReservationService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {}

  ngOnInit(): void {
    this.getData();
  }



  async getData() {
    await new Promise<void>((resolve) => {
      this.getRoomsSubscribe = this._reservationService
        .getRoomTypeReservation()
        .subscribe((rooms) => {
          this.rooms = rooms;
          resolve();
        });
    });
  }

  createRoom(type: string, data?: any) {
    this.openCreateRoomDialog(type, data);
  }

  openCreateRoomDialog(type: string, data: any) {
    const dialogRef = this._matDialog.open(DialogCreateRoomComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
      data: { event: data, type: type },
    });
  }

  deleteRoom(data?: any) {
    this.openDeleteRoomDialog(data);
  }

  openDeleteRoomDialog(room: any) {
    const dialogRef = this._matDialog.open(DialogDeleteRoomComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
      data: { event: room },
    });
  }
  openFailSnackbar() {
    const translatedMessage = this._translateService.instant(
      "MANAGEROOMS.SNACKBAR"
    );

    this._snackBar.open(translatedMessage, "", {
      panelClass: "fail-snackbar",
      duration: 3500,
    });
  }
}

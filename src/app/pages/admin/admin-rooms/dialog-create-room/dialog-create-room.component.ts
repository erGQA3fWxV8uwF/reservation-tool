import { Component, Inject, OnInit } from "@angular/core";

import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { FireStorageService } from "src/app/core/services/fire-storage.service";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-dialog-create-room",
  templateUrl: "./dialog-create-room.component.html",
  styleUrls: ["./dialog-create-room.component.sass"],
})
export class DialogCreateRoomComponent implements OnInit {
  storedTheme: string = "theme-light";
  room = this.data?.event;
  type = this.data.type;
  roomName: string = this.room?.name;
  roomType: string = this.room?.type;

  roomPreviewImage: any | undefined;
  mapImage: any | undefined;
  imagePreview: string = this.room?.path;

  disableReservation: boolean = false;
  roomData: any;
  createRoomForm: any;
  chartLines: any[] = [1, 2, 3];
  times: string[] = ["08", "12", "16"];
  dataToday: number[][] = [[3, 3, 5, 5, 8, 8, 10, 10, 10]];
  dataTomorrow: number[][] = [[0, 1, 5, 7, 3, 3, 10, 3, 3]];
  maxCapacity: number = 10;

  constructor(
    public formBuilder: FormBuilder,
    private _roomService: RoomService,
    private _fireStorageService: FireStorageService,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    public themeService: ThemeService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isSelectTypeDisabled();
    this.createRoomForm = this.formBuilder.group({
      roomType: [
        { value: this.roomType, disabled: this.disableReservation },
        Validators.required,
      ],
      roomName: [this.roomName, Validators.required],
    });
  }





  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length) {
      this.roomPreviewImage = input.files[0];

      // Vorschau für das ausgewählte Bild
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.roomPreviewImage);
    }
  }

  selectMap(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length) {
      this.mapImage = input.files[0];
    }
  }
  isSelectTypeDisabled() {
    if (this.type === "edit") {
      this.disableReservation = true;
    }
  }

  async storeRoomToDb() {
    const formValues = this.createRoomForm.value;
    const roomName = formValues.roomName;
    const roomType = formValues.roomType;
    let roomPreviewPath = null;
    let mapPath = null;

    if (this.roomPreviewImage) {
      roomPreviewPath = await this._fireStorageService.uploadFileToCloud(
        this.roomPreviewImage,
        roomName,
        "preview"
      );
    }
    if (this.mapImage) {
      mapPath = await this._fireStorageService.uploadFileToCloud(
        this.mapImage,
        roomName,
        "map"
      );
    }

    if (this.type == "edit") {
      let roomData: any = {
        name: roomName,
      };

      if (roomPreviewPath) {
        roomData.path = roomPreviewPath;
      }

      if (mapPath) {
        roomData.mapPath = mapPath;
      }

      this.roomData = roomData;
    } else {
      const roomData = {
        name: roomName,
        type: roomType,
        path: roomPreviewPath,
        mapPath: mapPath,
        maxCapacity: roomType === "meeting" ? 1 : 0,
      };
      this.roomData = roomData;
    }

    if (this.type == "create") {
      this._roomService
        .addRoom(this.roomData)
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
          console.error("Error adding room: ", error);
        });
    } else {
      this._roomService
        .editRoom(this.roomData, this.room.uuid)
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
          console.error("Error editing room: ", error);
        });
    }
  }

  calculateBarHeight() {
    let barHeight = 70 / this.maxCapacity;
    return barHeight;
  }


}

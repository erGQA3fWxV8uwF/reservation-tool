import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { DeskService } from "src/app/core/services/desk.service";
import { RoomService } from "src/app/core/services/room.service";
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
import { HelpDialogComponent } from "./help-dialog/help-dialog.component";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  templateUrl: './admin-room-build.page.html',
  styleUrls: ['./admin-room-build.page.sass'],
})
export class AdminRoomBuildPage {
  storedTheme: string = "theme-light";
  desks: any[] = [];
  mapSrc: string = "";
  newMarker: any[] = [];
  bookedMarkerCoordinates: any[] = [];

  @Input() startHour: number = 8;
  @Input() endHour: number = 17;
  @Input() selectedDate: any;
  @ViewChild("map", { static: false }) imgRef: ElementRef | undefined;

  constructor(
    public dialog: MatDialog,
    private el: ElementRef,
    private _roomService: RoomService,
    private _deskService: DeskService,
    private _renderer: Renderer2,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.mapSrc = this._roomService.selectedRoom.mapPath;
      await this._roomService.getRoomDesks().then((desks) => {
        this.desks = desks;
      });
    } catch (error) {
      console.error(error);
    }
  }



  async onImageLoad() {
    if (this.desks.length > 0) {
      this.calculateCoordinates();
    } else {
      await this._roomService.getRoomDesks().then((desks) => {
        this.desks = desks;
        this.calculateCoordinates();
      });
    }
  }

  async calculateCoordinates(desks?: any[]) {
    if (desks) {
      this.desks = desks;
    } else this.desks = await this._roomService.getRoomDesks();

    this.desks.forEach((element) => {
      let yInPixel = Math.round(
        (element.y / 100) * this.imgRef?.nativeElement.offsetHeight
      );
      let xInPixel = Math.round(
        (element.x / 100) * this.imgRef?.nativeElement.offsetWidth
      );
      element.x = xInPixel;
      element.y = yInPixel;
    });
  }

  generateNewMarker(event: MouseEvent): void {
    const tempDiv = this._renderer.createElement("div");
    this._renderer.setStyle(tempDiv, "width", "1vw");
    this._renderer.setStyle(tempDiv, "height", "1vw");
    this._renderer.setStyle(tempDiv, "position", "fixed");
    this._renderer.setStyle(tempDiv, "left", "100vw");
    this._renderer.appendChild(this.el.nativeElement, tempDiv);
    let vhInPixels = tempDiv.getBoundingClientRect().height;
    let vwInPixels = tempDiv.getBoundingClientRect().width;
    this._renderer.removeChild(this.el.nativeElement, tempDiv);

    const mapElement = document.querySelector("img") as HTMLElement;
    let xCoordinate = event.clientX - mapElement.getBoundingClientRect().left;
    let yCoordinate = event.clientY - mapElement.getBoundingClientRect().top;
    yCoordinate = yCoordinate - vwInPixels;
    xCoordinate = xCoordinate - vhInPixels;
    this.newMarker.push({
      x: xCoordinate,
      y: yCoordinate,
    });

    this._roomService.selectedRoom.maxCapacity += 1;
  }

  deleteNewMarker(index: any) {
    this.newMarker.splice(index, 1);
    this._roomService.selectedRoom.maxCapacity -= 1;
  }

  deleteMarker(id: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.bookedMarkerCoordinates = [];
      this._roomService.getRoomDesks().then((desks) => {
        this.desks = desks;
        this.calculateCoordinates();
      });
    });
  }

  addDesksToDb() {
    this.newMarker.forEach((element) => {
      const map = document.querySelector("img") as HTMLElement;
      let widthInPercent = (element.x / map.offsetWidth) * 100;
      let heightInPercent = (element.y / map.offsetHeight) * 100;
      const deskData = {
        x: widthInPercent,
        y: heightInPercent,
        room: this._roomService.selectedRoom.uuid,
      };

      const saveData = new Promise((resolve) => {
        resolve(this._deskService.addDesks(deskData));
      });

      const getNewData = new Promise((resolve) => {
        resolve(this._roomService.getRoomDesks());
      });

      saveData
        .then(() => {
          getNewData.then((desks: any) => {
            this.desks = desks;
            this._roomService.setSimpleId(desks);
            this._roomService.updateMaxCapacity(
              this._roomService.selectedRoom.maxCapacity
            );
            this.calculateCoordinates(desks);
            const translatedMessage = this._translateService.instant(
              "MANAGEROOMS.SNACKBARSUCCESFULL"
            );
            this._snackBar.open(translatedMessage, "", {
              panelClass: "success-snackbar",
              duration: 2000,
            });
          });
        })
        .catch((error) => {
          console.error("Error adding desk: ", error);
        });
    });

    this.newMarker = [];
    this.bookedMarkerCoordinates = [];
  }

  openHelpDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
    });
  }
}

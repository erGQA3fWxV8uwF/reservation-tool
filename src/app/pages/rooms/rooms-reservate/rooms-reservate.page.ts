import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";

import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { DialogFailComponent } from "./dialog-fail/dialog-fail.component";
import { DialogBookMeetingComponent } from "./dialog-book-meeting/dialog-book-meeting.component";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: "app-rooms-reservate",
  templateUrl: "./rooms-reservate.page.html",
  styleUrls: ["./rooms-reservate.page.sass"],
})
export class RoomsReservatePage implements OnInit {
  storedTheme: string = "theme-light";
  panelOpenState: boolean = false;
  roomType?: string;
  totalCapacity: number = 0;
  capacitys: number[] = [];
  selectedTime: any = "";
  reservations: any[] = [];
  selectedCapacity: number = 1;
  getlanguagesubscribe: any;
  roomUuid: string = "";
  freePlaces: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  hours: string[] = [
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
  ];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  endMinuteString: string = "00";
  startMinuteString: string = "00";
  startTime: number = 0;
  endTime: number = 0;
  reservationDate: any;
  reservationEndDate: any;
  userUuid: string = "";
  bookingDisabled: boolean = true;
  passedData?: any;
  passedDate?: Date;
  times: string[] = ["08", "09", "10", "11", "12", "13", "14", "15", "16"];
  chartLines: any[] = [1, 2, 3];
  displayWidth: number = window.innerWidth;
  prevSelectedDate?: Date;

  getRoomsSubscribe: Subscription = new Subscription();

  @Output() resultChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public roomService: RoomService,
    public deskService: DeskService,
    private _matDialog: MatDialog,
    private _reservationService: ReservationService,
    private _router: Router,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {
    this.roomType = this.roomService.selectedRoom.type;

    this.deskService.clearDeskUuid();
    const passedData =
      this._router.getCurrentNavigation()?.extras.state?.["data"];
    if (typeof passedData != "undefined") {
      this.passedData = passedData;
      this.deskService.setDeskUuid(passedData.desks);
      this.startHour = Math.floor(passedData.startTime / 100);
      this.startMinute = ((passedData.startTime % 100) / 25) * 15;

      this.endHour = Math.floor(passedData.endTime / 100);
      this.endMinute = ((passedData.endTime % 100) / 25) * 15;
      const [day, month, year] = passedData.date.split(".");

      this.passedDate = new Date(year, month - 1, day);
      this.prevSelectedDate = this.passedDate;
      this.reservationDate = this.passedDate;
    } else {
      if (this.roomType !== "meeting") {
        this.startHour = 8;
        this.startMinute = 0;
        this.endHour = 17;
        this.endMinute = 0;
      } else {
        const currentDate = new Date();

        const currentHour = currentDate.getHours();

        this.startHour = currentHour + 1;
        this.endHour = currentHour + 2;

        this.startMinute = 0;
        this.endMinute = 0;
      }
    }
  }

  async ngOnInit() {
    if (this.reservationDate == undefined) {
      this.reservationDate = new Date().setHours(0, 0, 0, 0);
      this.reservationDate = new Date(this.reservationDate);
    }
    this.roomUuid = this.roomService.selectedRoom.uuid;
    this.totalCapacity = this.roomService.selectedRoom.maxCapacity;

    this.getRoomsSubscribe = this._reservationService
      .getReservationsForRoom(this.roomUuid)
      .subscribe((reservations) => {
        this.reservations = reservations;
      });
    for (let i = 1; i <= this.totalCapacity; i++) {
      this.capacitys.push(i);
    }
  }


  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.displayWidth = event.target.innerWidth; // Aktualisiere die Displaybreite bei Größenänderungen
    this.calculateBarHeight(); // Rufe die Methode bei Änderungen der Displaygröße auf
  }

  handleDateClicked(result: any) {
    this.freePlaces = result.map((desk: any) => Object.keys(desk).length);
    this.freePlaces.pop();
    this.freePlaces.pop();
  }

  handleDate(selectedDate: any) {
    if (
      this.prevSelectedDate?.getTime() !== selectedDate.getTime() &&
      selectedDate.getTime() === this.passedDate?.getTime()
    ) {
      this.deskService.setDeskUuid(this.passedData?.desks);
    }

    this.reservationDate = selectedDate;
    this.prevSelectedDate = selectedDate;
  }
  handleMeetingStartHourClicked(startTime: any[]) {
    this.startHour = startTime[0];
    this.startMinute = startTime[1];
  }
  handleMeetingEndHourClicked(endTime: any[]) {
    this.endHour = endTime[0];
    this.endMinute = endTime[1];
  }

  handleHours(hours: any[]) {
    this.startHour = hours[0];
    this.startMinute = hours[1];
    this.endHour = hours[2];
    this.endMinute = hours[3];
  }

  handlePanelState(panelState: any) {
    this.panelOpenState = panelState;
  }

  handleEndDate(selectedEndDate: any) {
    this.reservationEndDate = selectedEndDate;
  }

  setTime() {
    const startHourNum = Number(this.startHour);
    const startMinuteNum = Number(this.startMinute / 15) * 25;
    const endHourNum = Number(this.endHour);
    const endMinuteNum = Number(this.endMinute / 15) * 25;

    const startTime = startHourNum * 100 + startMinuteNum;
    const endTime = endHourNum * 100 + endMinuteNum;

    return [startTime, endTime];
  }

  async doReservation() {
    const userData = JSON.parse(localStorage.getItem("user")!);
    const uid = userData ? userData.uid : null;
    this.userUuid = uid;
    const [startTime, endTime] = this.setTime();
    let roundedStartTime = this.roundToNearestQuarter(startTime);
    let roundedEndTime = this.roundToNearestQuarter(endTime);
    if (this.passedData && this.deskService?.deskUuids.length > 0)
      await this._reservationService.deleteReservation(this.passedData);

    if (
      this.roomType == "meeting" &&
      this.checkReservationOverlap() == false &&
      startTime < endTime &&
      roundedStartTime !== roundedEndTime
    ) {
      this._reservationService.loadDataForReservation(
        this.startHour,
        this.endHour,
        roundedStartTime,
        roundedEndTime,
        this.reservationDate,
        this.userUuid
      );
    } else if (this.roomType != "meeting" && startTime < endTime) {
      this._reservationService.loadDataForReservation(
        this.startHour,
        this.endHour,
        startTime,
        endTime,
        this.reservationDate,
        this.userUuid
      );
    } else {
      let translatedMessage = "";
      if (this.checkReservationOverlap() == true) {
        translatedMessage = this._translateService.instant(
          "TAKERESERVATION.MEETING_OVERLAP"
        );
        this.openFailDialog(translatedMessage);
      } else if (startTime > endTime) {
        translatedMessage = this._translateService.instant(
          "TAKERESERVATION.MEETING_STARTTIME"
        );
        this.openFailDialog(translatedMessage);
      } else {
        this.openFailDialog("Error : Not all values set correctly");
      }
    }
  }

  roundToNearestQuarter(time: number) {
    const minutes = time % 100;
    const roundUp = 25 - (minutes % 25);
    const roundDown = minutes % 25;

    const shouldRoundUp = roundUp < roundDown;

    const roundedMinutes = shouldRoundUp
      ? minutes + roundUp
      : minutes - roundDown;

    return Math.floor(time / 100) * 100 + (roundedMinutes % 100);
  }

  openFailDialog(errorText?: string) {
    const matDialogRef = this._matDialog.open(DialogFailComponent, {
      width: "90%",
      height: "auto",
      maxWidth: "900px",
      data: {
        errorText: errorText ?? null,
      },
    });
  }

  openBookMeetingDialog() {
    const matDialogRef = this._matDialog.open(DialogBookMeetingComponent, {
      width: "90%",
      height: "auto",
      maxWidth: "900px",
      data: {
        passedData: this.passedData ?? undefined,
        roomUuid: this.roomUuid,
      },
    });
  }

  checkReservationOverlap() {
    const [startTime, endTime] = this.setTime();
    let selectedDateUnixTime = Math.floor(
      new Date(this.reservationDate).getTime() / 1000
    );

    let reservations = this.reservations.filter(
      (eventData) => eventData.date.seconds == selectedDateUnixTime
    );
    if (reservations) {
      for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];
        if (
          startTime < reservation.endTime &&
          endTime > reservation.startTime
        ) {
          return true;
        }
      }
    }
    return false;
  }
  isReservationDateInvalid(): boolean {
    if (!this.reservationDate) {
      return true; // Disable the button if reservationDate is not set.
    }

    const currentDate = new Date();
    const maxReservationDate = new Date();
    maxReservationDate.setDate(currentDate.getDate() + 30);

    if (this.reservationDate && this.reservationEndDate) {
      return (
        this.reservationDate > maxReservationDate ||
        this.reservationEndDate > maxReservationDate
      );
    } else {
      return this.reservationDate > maxReservationDate;
    }
  }

  // Add a method to check if passedData is defined
  isPassedDataDefined(): boolean {
    return typeof this.passedData !== "undefined";
  }
  calculateBarHeight() {
    if (this.displayWidth < 600) {
      let barHeigth = 70 / this.totalCapacity;
      return barHeigth;
    }
    if (this.displayWidth < 800) {
      let barHeigth = 85 / this.totalCapacity;
      return barHeigth;
    } else {
      let barHeigth = 140 / this.totalCapacity;
      return barHeigth;
    }
  }
  getBarStyle(value: number) {
    if (value >= this.totalCapacity) {
      return { "background-color": "rgb(244, 5,214)" };
    }
    if (value >= this.totalCapacity / 2) {
      return { "background-color": "rgb(228, 172,26)" };
    } else {
      return { "background-color": "rgb(13, 201,203)" };
    }
  }
  calculateBarHeightNumbers(value: number) {
    let fixbarHeight;
    if (this.displayWidth < 600) {
      let barHeigth = 70 / this.totalCapacity;
      fixbarHeight = barHeigth * value;
    }
    if (this.displayWidth < 800) {
      let barHeigth = 85 / this.totalCapacity;
      fixbarHeight = barHeigth * value;
    } else {
      let barHeigth = 140 / this.totalCapacity;
      fixbarHeight = barHeigth * value;
    }
    if (fixbarHeight < 20) {
      return "numberAbove";
    } else {
      return "";
    }
  }
}

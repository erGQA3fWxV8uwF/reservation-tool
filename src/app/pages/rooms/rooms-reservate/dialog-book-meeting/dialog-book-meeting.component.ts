import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
@Component({
  selector: "app-dialog-book-meeting",
  templateUrl: "./dialog-book-meeting.component.html",
  styleUrls: ["./dialog-book-meeting.component.sass"],
})
export class DialogBookMeetingComponent {
  reservationDate: any;
  reservationType: string = "meeting";
  currentDate: Date = new Date();
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  
  private _passedDate?: Date;
  private _prevSelectedDate?: Date;
  private _roomUuid: string = this.data._roomUuid;
  private _passedData? = this.data._passedData;
  private _reservations: any[] = [];
  private _getRoomsSubscribe: Subscription = new Subscription();

  constructor(
    public _reservationService: ReservationService,
    private _deskService: DeskService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (typeof this._passedData != "undefined") {
      this._deskService.setDeskUuid(this._passedData.desks);
      this.startHour = Math.floor(this._passedData.startTime / 100);
      this.startMinute = ((this._passedData.startTime % 100) / 25) * 15;

      this.endHour = Math.floor(this._passedData.endTime / 100);
      this.endMinute = ((this._passedData.endTime % 100) / 25) * 15;
      const [day, month, year] = this._passedData.date.split(".");

      this._passedDate = new Date(year, month - 1, day);
      this._prevSelectedDate = this._passedDate;
      this.reservationDate = this._passedDate;
    } else {
      this.reservationDate = new Date().setHours(0, 0, 0, 0);
      this.reservationDate = new Date(this.reservationDate);
      const currentHour = this.currentDate.getHours();
      this.startHour = currentHour + 1;
      this.endHour = currentHour + 2;
      this.startMinute = 0;
      this.endMinute = 0;
    }
  }
  async ngOnInit() {
    this._getRoomsSubscribe = this._reservationService
      .getReservationsForRoom(this._roomUuid)
      .subscribe((reservations) => {
        this._reservations = reservations;
      });
  }
  ngOnDestroy(): void {
    this._getRoomsSubscribe.unsubscribe();
  }
  async bookMeeting() {
    const userData = JSON.parse(localStorage.getItem("user")!);
    const uid = userData ? userData.uid : null;
    const [startTime, endTime] = this.setTime();
    if (this._passedData)
      await this._reservationService.deleteReservation(this._passedData);
    if (this.checkReservationOverlap() == false && startTime < endTime) {
      this._reservationService.loadDataForReservation(
        this.startHour,
        this.endHour,
        startTime,
        endTime,
        this.reservationDate,
        uid
      );
    } else {
      console.log("error");
    }
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
  checkReservationOverlap() {
    const [startTime, endTime] = this.setTime();
    let selectedDateUnixTime = Math.floor(
      new Date(this.reservationDate).getTime() / 1000
    );
    let reservations = this._reservations.filter(
      (eventData: any) => eventData.date.seconds == selectedDateUnixTime
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
  handleHours(hours: any[]) {
    this.startHour = hours[0];
    this.startMinute = hours[1];
    this.endHour = hours[2];
    this.endMinute = hours[3];
  }
}

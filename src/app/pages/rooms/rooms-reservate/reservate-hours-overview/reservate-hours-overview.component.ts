import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: 'app-reservate-hours-overview',
  templateUrl: './reservate-hours-overview.component.html',
  styleUrls: ['./reservate-hours-overview.component.sass'],
})
export class ReservateHoursOverviewComponent {
  storedTheme: string = "theme-light";
  currentMonthName: string = "";
  mouseIsHeld: boolean = false;

  prevStartHour?: number;
  prevEndHour?: number;
  prevStartMinute?: number;
  prevEndMinute?: number;
  today: number = new Date().setHours(0, 0, 0, 0);

  startDay: Date = new Date();
  weekdays: string[] = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  tableHours: number[] = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  selectedDate: Date;
  weekDates: Date[] = [];
  formattedDates: string[] = [];

  private _roomUuid: string;
  private _weekChecker: number = 0;
  private _reservations: any[] = [];

  private _selectedLanguage?: string;
  private _prevDate?: any;

  private _languageSubscribe: Subscription = new Subscription();
  private _userUuid = this._authService.userData.uid;
  private _roomSubscribe: Subscription = new Subscription();

  @Input("startHour") startHour: any = 8;
  @Input("endHour") endHour: any = 9;
  @Input("startMinute") startMinute: any = 0;
  @Input("endMinute") endMinute: any = 0;
  @Input("date") passedDate?: any;
  @Input("edit") edit?: boolean = false;

  @Output() dateClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateClickedDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() startTimeClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() endTimeClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _reservationService: ReservationService,
    private _roomService: RoomService,
    private _authService: AuthService,
    public themeService: ThemeService,

  ) {
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);
    this._roomUuid = this._roomService.selectedRoom.uuid;
  }

  ngOnInit(): void {
    let currenthour = new Date().getHours();
    if (currenthour > 18 || currenthour < 6) {
      //Check ob zeit ausserhalb der tabelle liegt
      currenthour = 8;
    }
    this.startTimeClicked.emit(currenthour);
    this.endTimeClicked.emit(currenthour + 1);

    if (this.edit) {
      this.prevStartHour = this.startHour;
      this.prevEndHour = this.endHour;
      this.prevStartMinute = this.startMinute;
      this.prevEndMinute = this.endMinute;
      this._prevDate = this.passedDate;
      this.selectedDate = this.passedDate;
      this.startDay = new Date(this.selectedDate.setHours(0, 0, 0, 0));
    }
    if (typeof this.passedDate != "undefined")
      this.getWeekStartDay(this.startDay);
    this.calculateWeekDates(this.startDay);
    this._roomSubscribe = this._reservationService
      .getReservationsForRoom(this._roomUuid)
      .subscribe((reservations: any[]) => {
        this._reservations = reservations;
      });
  }



  ngOnDestroy(): void {
    this._roomSubscribe.unsubscribe();
    this._languageSubscribe.unsubscribe();
  }
  getLanguage() {
    this._languageSubscribe = this._authService.angularFireStore
      .collection("users")
      .doc(this._authService.userData.uid)
      .get()
      .subscribe((doc) => {
        let langArray: any = doc.data();
        this._selectedLanguage = langArray.language;
      });
  }

  getWeekStartDay(date: any) {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    this.startDay = startOfWeek;
  }

  calculateWeekDates(startDay: Date) {
    let weekDayNumber = String(startDay.getDate()).padStart(2, "0");
    startDay.setHours(0, 0, 0, 0);
    let weekDay = this.weekdays[new Date(startDay).getDay()];

    let formattedDates = [weekDay + " " + weekDayNumber];
    let weekArray = [new Date(startDay)];
    for (let i = 0; i < 6; i++) {
      startDay.setDate(startDay.getDate() + 1);
      startDay.setHours(0, 0, 0, 0);
      let weekDayNumber = String(startDay.getDate()).padStart(2, "0");
      let wochentag = this.weekdays[new Date(startDay).getDay()];
      formattedDates.push(wochentag + " " + weekDayNumber);
      weekArray.push(new Date(startDay));
    }
    this.formattedDates = formattedDates;
    this.weekDates = weekArray;
    this.currentMonthName = weekArray[3].toLocaleString(
      this._selectedLanguage,
      {
        month: "long",
      }
    );
  }

  setPreviousWeek() {
    var previousStartDay = this.startDay;
    previousStartDay.setDate(previousStartDay.getDate() - 7);
    this.getWeekStartDay(this.startDay);
    this.calculateWeekDates(this.startDay);
    this._weekChecker -= 1;
  }

  setNextWeek() {
    var nextStartDay = this.startDay;
    nextStartDay.setDate(nextStartDay.getDate() + 7);
    this.getWeekStartDay(this.startDay);
    this.calculateWeekDates(this.startDay);
    this._weekChecker += 1;
  }

  markDateClass(date: Date) {
    let selectedDateValue = this.selectedDate.getDay();
    const selectedDate = date.getDay();
    if (this.checkIfDateInPast(date)) {
      if (this.storedTheme === "theme-dark") {
        return "disabled-dark";
      }
      return "disabled";
    } else if (selectedDateValue == selectedDate && this._weekChecker == 0) {
      return "reserved";
    }
    return "";
  }

  setSelectedDay(date: Date) {
    if (this.checkIfDateInPast(date)) {
      return;
    }
    this._weekChecker = 0;
    this.selectedDate = date;
    this.dateClickedDate.emit(date);
  }

  colorReservedFields(date: Date, hour: number, quarter: number) {
    const time = hour * 100 + quarter * 25;
    const selectedStartTime =
      this.startHour * 100 + (this.startMinute / 15) * 25;
    const selectedEndTime = this.endHour * 100 + (this.endMinute / 15) * 25;

    let unixTime = Math.floor(new Date(date).getTime() / 1000);
    let results = this._reservations.filter(
      (eventData) => eventData.date.seconds == unixTime
    );

    let editCase = false;

    if (this.edit && date.getTime() === this._prevDate.getTime()) {
      editCase = true;
    }

    let prevStartTime;
    if (
      this.prevStartHour !== undefined &&
      this.prevStartMinute !== undefined
    ) {
      prevStartTime =
        this.prevStartHour * 100 + (this.prevStartMinute / 15) * 25;
    }
    let prevEndTime;
    if (this.prevEndHour !== undefined && this.prevEndMinute !== undefined)
      prevEndTime = this.prevEndHour * 100 + (this.prevEndMinute / 15) * 25;

    let isReserved = false;
    let isSelected =
      time >= selectedStartTime &&
      time < selectedEndTime &&
      date.getTime() === this.selectedDate.getTime();
    let sameUser = false;
    let dateInPast = new Date(this.today) > date;

    if (results) {
      for (let index = 0; index < results.length; index++) {
        const result = results[index];

        const withinResultTime =
          time >= result.startTime && time < result.endTime;
        const withinPrevTime =
          prevStartTime &&
          prevEndTime &&
          time >= prevStartTime &&
          time < prevEndTime;
        const isSameUser = result.user == this._userUuid;

        if (withinResultTime) {
          if (
            editCase &&
            prevStartTime &&
            prevEndTime &&
            withinPrevTime &&
            !selectedStartTime
          ) {
            isSelected = true;
            break;
          } else if (
            !editCase ||
            (editCase && !(prevStartTime && prevEndTime && withinPrevTime))
          ) {
            isReserved = true;
            sameUser = isSameUser;
            break;
          }
        }
      }
    }

    if (dateInPast) {
      if (this.storedTheme === "theme-dark") {
        return "disabled-dark";
      }
      return "disabled";
    } else if (isReserved && isSelected) {
      return "red";
    } else if (sameUser && isReserved) {
      return "sameUser";
    } else if (isReserved) {
      return "reserved";
    } else if (isSelected) {
      return "currentSelected";
    } else {
      return "";
    }
  }

  setStartTimeWithTable(hour: any, quarter: any, day: any) {
    if (this.checkIfDateInPast(day)) {
      return;
    }
    this.endHour = hour;
    this.mouseIsHeld = true;
    this.setSelectedDay(day);
    let quarterAsMinutes = quarter * 15;
    this.startMinute = quarterAsMinutes;
    this.startHour = hour;

    let startTime = [this.startHour, this.startMinute];
    this.startTimeClicked.emit(startTime);
  }

  setEndTimeWithTable(hour: any, quarter: any, day: any) {
    if (this.checkIfDateInPast(day)) {
      return;
    }
    let quarterAsMinutes = quarter * 15;
    this.endMinute = quarterAsMinutes;
    this.endHour = hour;
    let endTime = [this.endHour, this.endMinute];
    this.endTimeClicked.emit(endTime);
    this.mouseIsHeld = false;
  }

  endTimeHover(hour: number, quarter: number) {
    if (this.mouseIsHeld === true) {
      let quarterAsMinutes = quarter * 15;
      this.endMinute = quarterAsMinutes;
      this.endHour = hour;
    }
  }

  checkIfDateInPast(date: Date) {
    let dateInPast = new Date(this.today) > date;

    if (dateInPast) {
      return true;
    }
    return false;
  }

  lastRow(index: number) {
    if (index === 13) {
      return "hideLastRow";
    }
    return "";
  }
}

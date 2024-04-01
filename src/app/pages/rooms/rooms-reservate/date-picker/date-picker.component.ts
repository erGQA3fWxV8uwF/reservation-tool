import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { ThemeService } from "src/app/core/services/theme.service";
@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.sass"],
})
export class DatePickerComponent implements OnInit {
  currentMonth: string[] = [];
  currentYear: number = 0;
  storedTheme: string = "theme-light";
  monthIndex: number = 0;
  allDays: number[] = [];
  daysOfWeek = ["M", "D", "M", "D", "F", "S", "S"];
  monthChecker: number = 0;
  eventsForDate?: any;
  selectedDay: any | null = null;
  selectedValue: string = "en";

  langArray?: any;
  userData?: any;

  translateMonthsSubscribe: Subscription = new Subscription();
  translateDaysSubscribe: Subscription = new Subscription();
  getLanguageSubscribe: Subscription = new Subscription();
  DataSubscription: Subscription = new Subscription();

  @Input("date") passedDate?: any;
  @Output() dateClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateClickedDate: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _reservationService: ReservationService,
    private _translateService: TranslateService,
    private _deskService: DeskService,
    private _authService: AuthService,
    public themeService: ThemeService,

  ) {}

  ngOnInit(): void {
    this.translateMonthsSubscribe = this._translateService
      .get("MONTHS")
      .subscribe((translations: any) => {
        this.currentMonth = Object.keys(translations).map(
          (key) => translations[key]
        );
      });
    this.translateDaysSubscribe = this._translateService
      .get("DAYS")
      .subscribe((translations: any) => {
        this.daysOfWeek = Object.keys(translations).map(
          (key) => translations[key]
        );
      });

    if (typeof this.passedDate != "undefined") {
      this.setDate(this.passedDate);
    } else {
      const currentDate = new Date();
      this.userData = JSON.parse(localStorage.getItem("user")!);
      this.currentYear = currentDate.getFullYear();
      this.monthIndex = currentDate.getMonth();

      this.selectedDay = currentDate.getDate();
    }

    this.getDays();
    this.clickOnDate(this.selectedDay, true);
    this.getLanguage();
  }



  ngOnDestroy(): void {
    this.translateDaysSubscribe.unsubscribe();
    this.translateMonthsSubscribe.unsubscribe();
    this.getLanguageSubscribe?.unsubscribe();
    this.DataSubscription.unsubscribe();
  }

  isDateBeforeToday(date: any): boolean {
    date = date + 1;
    const selectedDate = new Date(this.currentYear, this.monthIndex, date);
    const currentDate = new Date();

    return selectedDate < currentDate;
  }

  getSelectedDate(): string {
    if (this.selectedDay !== null) {
      const selectedDate = new Date(
        this.currentYear,
        this.monthIndex,
        this.selectedDay
      );
      const weekday = selectedDate.toLocaleDateString(this.selectedValue, {
        weekday: "short",
      });
      const month = this.currentMonth[this.monthIndex];
      const formattedDate = `${weekday}, ${month}, ${this.selectedDay}`;
      return formattedDate;
    }
    return "";
  }
  getLanguage() {
    this.getLanguageSubscribe = this._authService.angularFireStore
      .collection("users")
      .doc(this.userData?.uid)
      .get()
      .subscribe((doc) => {
        this.langArray = doc.data();
        this.selectedValue = this.langArray.language;
      });
  }

  setNextMonth() {
    this.monthChecker += 1;
    this.monthIndex++;
    this.getDays();
    if (this.monthIndex == 12) {
      this.currentYear++;
      this.monthIndex = 0;
    }
  }

  setPreviousMonth() {
    this.monthChecker -= 1;
    this.monthIndex--;
    this.getDays();
    if (this.monthIndex == -1) {
      this.currentYear--;
      this.monthIndex = 11;
    }
  }

  getDays() {
    const days = new Date(this.currentYear, this.monthIndex + 1, 0).getDate();
    this.allDays = [];
    for (let i = 1; i <= days; i++) {
      this.allDays.push(i);
    }
    return this.allDays;
  }

  clearNumberOfReservations() {
    this._deskService.clearNumberOfReservationsValue();
  }

  splitIntoRows(days: number[]): number[][] {
    const rows: number[][] = [];
    let row: number[] = [];

    const firstDay = new Date(this.currentYear, this.monthIndex, 0).getDay();
    if (firstDay) {
      const emptyCells = Array(firstDay);
      row.push(...emptyCells);
    }

    for (const day of days) {
      row.push(day);

      if (row.length === 7) {
        rows.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      const remainingDays = 7 - row.length;
      row.push(...Array(remainingDays));
      rows.push(row);
    }

    return rows;
  }

  clickOnDate(day: number, init: boolean = false) {
    if (!init) this._deskService.clearDeskUuid();
    this.selectedDay = day;
    this.monthChecker = 0;
    const selectedDate = new Date(this.currentYear, this.monthIndex, day);
    const currentDate = new Date();
    this.DataSubscription = this._reservationService
      .loadDataForPicker(selectedDate)
      .subscribe(
        (data) => {
          this.eventsForDate = data;
          this.eventsForDate = Object.values(this.eventsForDate?.slice(8, 19));
          this.dateClicked.emit(this.eventsForDate);
          this.dateClickedDate.emit(selectedDate);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async setDate(date: Date) {
    this.selectedDay = date.getDate();
    this.monthIndex = date.getMonth();
    this.currentYear = date.getFullYear();
    console.log(this.eventsForDate);
    this.DataSubscription = this._reservationService
      .loadDataForPicker(date)
      .subscribe(
        (data) => {
          this.eventsForDate = data;
          this.eventsForDate = Object.values(this.eventsForDate?.slice(8, 19));
          this.dateClicked.emit(this.eventsForDate);
          this.dateClickedDate.emit(date);
        },
        (error) => {
          console.error(error);
        }
      );
  }




  changeLanguage(lang: string) {
    this._translateService.use(lang);
  }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/core/services/auth.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-bookings-date-picker',
  templateUrl: './bookings-date-picker.component.html',
  styleUrls: ['./bookings-date-picker.component.sass'],
})
export class BookingsDatePickerComponent implements OnInit, OnDestroy {
  storedTheme: string = "theme-light";
  currentMonth: string[] = [];
  currentYear: number = 0;
  monthIndex: number = 0;
  allDays: number[] = [];
  daysOfWeek = ["M", "D", "M", "D", "F", "S", "S"];
  eventsForDate: any[] = [];
  eventData: any[] = [];
  selectedDay?: number; 

  selectedValue: any;
  langArray?: any;
  userData: any;

  monthsSubscribe: Subscription = new Subscription();
  daysSubscribe: Subscription = new Subscription();
  languageSubscribe: Subscription = new Subscription();
  private _reservationSub: Subscription = new Subscription();

  constructor(
    private _reservationService: ReservationService,
    private _translateService: TranslateService,
    private _authService: AuthService,
    public themeService: ThemeService,

  ) {}

  ngOnInit(): void {
    this.monthsSubscribe = this._translateService
      .get("MONTHS")
      .subscribe((translations: any) => {
        this.currentMonth = Object.keys(translations).map(
          (key) => translations[key]
        );
      });
    this.daysSubscribe = this._translateService
      .get("DAYS")
      .subscribe((translations: any) => {
        this.daysOfWeek = Object.keys(translations).map(
          (key) => translations[key]
        );
      });
    this.userData = JSON.parse(localStorage.getItem("user")!);
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.monthIndex = currentDate.getMonth();
    this.getDays();
    this.selectedDay = currentDate.getDate();
    this.loadReservations();
    this.getLanguage();
    this._reservationService.getEventData(this.userData.uid);
  }



  ngOnDestroy(): void {
    this.monthsSubscribe.unsubscribe();
    this.daysSubscribe.unsubscribe();
    this.languageSubscribe.unsubscribe();
    this._reservationSub.unsubscribe();
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
    this.languageSubscribe = this._authService.angularFireStore
      .collection("users")
      .doc(this.userData.uid)
      .get()
      .subscribe((doc) => {
        this.langArray = doc.data();
        this.selectedValue = this.langArray.language;
      });
  }

  setNextMonth() {
    this.monthIndex++;
    this.getDays();
    if (this.monthIndex == 12) {
      this.currentYear++;
      this.monthIndex = 0;
    }
  }

  setPreviousMonth() {
    this.monthIndex--;
    this.getDays();
    if (this.monthIndex == -1) {
      this.currentYear--;
      this.monthIndex = 11;
    }
  }

  getDays() {
    const days = new Date(this.currentYear, this.monthIndex + 1, 0).getDate(); // Anzahl der Tage im aktuellen Monat abrufen
    this.allDays = [];
    for (let i = 1; i <= days; i++) {
      this.allDays.push(i); // Tage zum Array hinzufügen
    }
    return this.allDays; // Array mit den Tagen des Monats zurückgeben
  }

  splitIntoRows(days: number[]): number[][] {
    const rows: number[][] = [];
    let row: number[] = [];

    const firstDay = new Date(this.currentYear, this.monthIndex, 0).getDay(); // Wochentag des ersten Tages des Monats abrufen
    if (firstDay) {
      // Wenn der erste Tag nicht auf einen Montag fällt, leere Zellen am Anfang hinzufügen
      const emptyCells = Array(firstDay);
      row.push(...emptyCells);
    }

    for (const day of days) {
      row.push(day); // Tag zur aktuellen Zeile hinzufügen
      if (row.length === 7) {
        // Wenn die Zeile voll ist (7 Tage), zur Liste der Zeilen hinzufügen und eine neue Zeile erstellen
        rows.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      // Wenn die letzte Zeile nicht vollständig ist, leere Zellen am Ende hinzufügen
      const remainingDays = 7 - row.length;
      row.push(...Array(remainingDays));
      rows.push(row);
    }

    return rows; // Liste der Zeilen zurückgeben
  }

  getDayClass(day: number) {
    const eventsForDate = this._reservationService.returnSortedData();
    const date = new Date(this.currentYear, this.monthIndex, day);
    const seconds = date.getTime() / 1000; // Konvertiere das Datum in Sekunden

    const result = eventsForDate.find(
      (eventData) => eventData.date.seconds === seconds
    );

    const todaysDateInSeconds = Math.floor(date.getTime() / 1000);
    if (
      this.eventData &&
      this.eventData.length > 0 &&
      this.eventData[0].date.seconds <= todaysDateInSeconds
    ) {
      if (result == undefined) {
        return "";
      } else {
        return "isReservation";
      }
    } else {
      return "";
    }
  }

  async loadReservations() {
    const user = JSON.parse(localStorage.getItem("user")!);
    const uid = user.uid;

    this._reservationSub = this._reservationService
      .getReservations(uid)
      .subscribe((data: any) => {
        this.eventData = data;
      });
  }

  getCurrentDayClass(day: number) {
    const currentDate = new Date();
    if (
      this.currentYear === currentDate.getFullYear() &&
      this.monthIndex === currentDate.getMonth() &&
      day === currentDate.getDate()
    ) {
      return "currentDay"; // Wenn das Datum dem aktuellen Datum entspricht, die Klasse 'current-day' zurückgeben
    } else {
      return "";
    }
  }
}

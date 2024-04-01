import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";
import { DialogDeleteComponent } from "./dialog-delete/dialog-delete.component";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.sass"],
})
export class BookingsPage implements OnInit {
  storedTheme: string = "theme-light";
  eventData: any[] = [];
  eventDataRule: any[] = [];
  rules: any[] = [];
  rooms: any[] = [];
  desksData: any = [];
  todaysDate: Date = new Date();

  getRoomsSubscribe: Subscription = new Subscription();
  ruleSubscribe: Subscription = new Subscription();
  deskSubscription: Subscription = new Subscription();
  reservationSubscription: Subscription = new Subscription();

  constructor(
    public _reservationService: ReservationService,
    private _roomService: RoomService,
    private _deskService: DeskService,
    private _router: Router,
    private _matDialog: MatDialog,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {}

  ngOnInit(): void {
    this.getRoomsSubscribe = this._roomService.rooms.subscribe((rooms: any) => {
      this.rooms = rooms;
      this.loadReservations();
    });

    this.deskSubscription = this._deskService.desks.subscribe((data) => {
      this.desksData = data;
    });
  }

  ngOnDestroy(): void {
    this.getRoomsSubscribe.unsubscribe();
    this.deskSubscription.unsubscribe();
    this.reservationSubscription.unsubscribe();
  }

  getRoomName(uuid: string): string {
    const room = this.rooms.find((room) => room.uuid === uuid);
    return room ? room.name : "";
  }
  loadReservations() {
    const user = JSON.parse(localStorage.getItem("user")!);
    const uid = user.uid;

    this.reservationSubscription = this._reservationService
      .getReservations(uid)
      .pipe(
        tap((data: any) => {
          data.forEach((element: any) => {});

          const filteredData = this.groupReservationsByRoomTime(data);

          const filteredDataWithoutRuleId = filteredData.filter((item) => {
            return !item.reservations.some(
              (reservation: any) => reservation.ruleId
            );
          });

          const filteredDataWithRuleId = filteredData.filter((item) => {
            return item.reservations.some(
              (reservation: any) => reservation.ruleId
            );
          });

          this.eventData = filteredDataWithoutRuleId;
          this.eventDataRule = filteredDataWithRuleId;

          this.rules.forEach((rule) => {
            rule.reservations = [];
            this.eventDataRule.forEach((data) => {
              data.reservations.forEach((entry: { ruleId: any }) => {
                if (entry.ruleId === rule.id) {
                  rule.reservations.push(entry);
                }
              });
            });
          });
        })
      )
      .subscribe();
  }

  getSimpleIdForDesk(deskId: string): string | undefined {
    const desk = this.desksData.find((deskObj: any) => deskObj.uuid === deskId);
    return desk?.simpleId;
  }

  groupReservationsByRoomTime(reservations: any[]): any[] {
    const groupedReservations: any[] = [];

    reservations.forEach((reservation) => {
      groupedReservations.push({
        id: reservation.id,
        room: reservation.room,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        date: reservation.date,
        reservations: [reservation],
        type: this.getRoomType(reservation.room),
      });
    });
    return groupedReservations;
  }

  formateTime(number: number): string {
    const hours = Math.floor(number / 100);
    const minutes = ((number % 100) / 25) * 15;
    const formatedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return formatedTime;
  }

  calculateTime(timestamp: any) {
    const seconds = timestamp;
    const date = new Date(seconds * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year}`;
    return formattedDate;
  }
  getRoomType(uuid: string) {
    const room = this.rooms.find((room) => room.uuid === uuid);
    return room ? room.type : "";
  }

  getDayOfWeek(timestamp: any): string {
    const seconds = timestamp;
    const date = new Date(seconds * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year}`;

    const dayOfWeek = this._translateService.instant(
      "daysOfWeek." + date.getDay()
    );

    return `${dayOfWeek} ${formattedDate}`;
  }

  colorCurrentReservation(date: any): string {
    this.todaysDate.setHours(0, 0, 0, 0);
    const todaysDateInSeconds = Math.floor(this.todaysDate.getTime() / 1000);
    if (todaysDateInSeconds == date) {
      return "today";
    } else {
      return "notToday";
    }
  }

  deleteReservations(data: any, rule?: any) {
    this.openDialog(data, rule);
  }

  async editReservation(data: any) {
    data.date = this.calculateTime(data.date.seconds);
    const setRoom = new Promise((resolve) => {
      resolve(this._roomService.setSelectedRoomFromId(data.room));
    });

    setRoom.then(() =>
      this._router.navigate(["/rooms/reservate"], { state: { data: data } })
    );
  }

  openDialog(data: any, rule?: string) {
    const matDialogRef = this._matDialog.open(DialogDeleteComponent, {
      width: "80%",
      height: "auto",
      maxWidth: "600px",
      data: { event: data, rule: rule },
    });
  }
}

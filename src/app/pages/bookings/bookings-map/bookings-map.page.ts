import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, take } from "rxjs";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-bookings-map',
  templateUrl: './bookings-map.page.html',
  styleUrls: ['./bookings-map.page.sass'],
})
export class BookingsMapPage {
  selectedRoom: any[] = [];
  mapSrc: string = "";
  desks: any = [];
  marker: any[] = [];
  bookedDesks: any[] = [];
  reservationId?: string;
  bookedDeskDatas: any[] = [];
  roomUuid: string = "";
  room: any;
  selectedDate: Date = new Date();
  viewDate: number = 0;

  storedTheme?: string = "theme-light";
  activatedRouteSubscription: Subscription = new Subscription();
  roomSub: Subscription = new Subscription();
  bookedDeskSubscription: Subscription = new Subscription();

  constructor(
    public roomService: RoomService,
    public deskService: DeskService,
    public _reservationService: ReservationService,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    public themeService: ThemeService,

  ) {}

  async ngOnInit() {
    this.activatedRouteSubscription = this._activatedRoute.params.subscribe(
      (params) => {
        this.roomUuid = params["roomId"];
        this.reservationId = params["reservationId"];
        this.viewDate = params["date"];

        this.roomSub = this.roomService
          .getSpecificRoom(this.roomUuid)
          .subscribe((room) => {
            this.selectedRoom.push(room);
            this.mapSrc = this.selectedRoom[0].mapPath;
          });
      }
    );
    await this.getBookedDesk();
  }

  ngOnDestroy() {
    this.activatedRouteSubscription.unsubscribe();
    this.roomSub.unsubscribe();
    this.bookedDeskSubscription.unsubscribe();
  }

  async getBookedDesk() {
    this.marker = [];
    let service = this.deskService
      .getSpecificBookedDesks(this.reservationId)
      .pipe(take(1))
      .subscribe((bookedDesks) => {
        this.desks.push(bookedDesks);
        this.desks.forEach((element: any) => {
          element.desks.forEach((element: any) => {
            this.deskService.getDeskByUuid(element).subscribe((data) => {
              this.calculateMarkerPosition(data);
            });
          });
        });
        service.unsubscribe();
      });
  }
  calculateMarkerPosition(desk: any) {
    const img = document.querySelector("img") as HTMLElement;
    let yInPixel = Math.round((desk.y / 100) * img.offsetHeight);
    let xInPixel = Math.round((desk.x / 100) * img.offsetWidth);

    this.marker.push({
      y: yInPixel,
      x: xInPixel,
      id: desk.uuid,
    });
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

    return `${dayOfWeek}       ${formattedDate}`;
  }
}

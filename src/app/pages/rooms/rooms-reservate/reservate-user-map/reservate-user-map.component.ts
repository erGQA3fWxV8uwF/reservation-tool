import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { DeskService } from "src/app/core/services/desk.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { RoomService } from "src/app/core/services/room.service";
@Component({
  selector: 'app-reservate-user-map',
  templateUrl: './reservate-user-map.component.html',
  styleUrls: ['./reservate-user-map.component.sass'],
})
export class ReservateUserMapComponent implements OnInit {
  desks: any[] = [];
  mapSrc: string = "";
  occupiedDesks: string[] = [];
  loading:boolean = false
  imgLoaded:boolean = false
  occupiedDesksSubscription: Subscription = new Subscription();
  reservationTakenSubscription: Subscription = new Subscription();
  occupiedDesksWithName: any;

  @Input() startHour: number = 8;
  @Input() endHour: number = 17;
  @Input() selectedDate: any;
  @Input() edit: boolean = false;
  @ViewChild("map", { static: false }) imgRef: ElementRef | undefined;

  constructor(
    private _reservationService: ReservationService,
    private _roomService: RoomService,
    public deskService: DeskService
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

  ngOnChanges(): void {
    this.updateOccupiedDesks();
  }

  ngOnDestroy() {
    this.occupiedDesksSubscription.unsubscribe();
    this.reservationTakenSubscription.unsubscribe();
  }

  async onImageLoad() {
    if (this.desks.length > 0) {
      this.imgLoaded=true;
      this.calculateCoordinates();
      this.loading = true; 

      this.reservationTakenSubscription = this._reservationService
        .getReservationTakenObservable()
        .subscribe(() => {
          this.updateOccupiedDesks();
        });
      this.updateOccupiedDesks();
    } else {
      await this._roomService.getRoomDesks().then((desks) => {
        this.imgLoaded=true;
        this.desks = desks;
        this.calculateCoordinates();
        this.loading = true; 

        this.reservationTakenSubscription = this._reservationService
          .getReservationTakenObservable()
          .subscribe(() => {
            this.updateOccupiedDesks();
          });
        this.updateOccupiedDesks();
      });
    }
  }

  async updateOccupiedDesks(): Promise<void> {
    if (this.occupiedDesksSubscription) {
      this.occupiedDesksSubscription.unsubscribe();
    }
    this.occupiedDesksSubscription = this.deskService
      .getNonAvailableDesks(
        this.selectedDate,
        this.startHour,
        this.endHour,
        this.edit
      )
      .subscribe((result) => {
        this.occupiedDesks = result;
      this.updateOccupiedDeskNames(result);
    });
  }

  updateOccupiedDeskNames(occupiedDesks: string[] = []) {
    this.occupiedDesksWithName = {};
    if (!occupiedDesks.length) return;
    occupiedDesks.forEach(async (desk: string) => {
      try {
        const user = await this.deskService.getOccupiedDeskUser(
          this.selectedDate,
          desk
        );
        this.occupiedDesksWithName = {
          ...this.occupiedDesksWithName,
          [desk]: user,
        };
      } catch (error) {
        console.error(`Error fetching data for desk ${desk}: ${error}`);
      }
    });
  }

  getDeskColorClass(deskUuid: string) {
    if (this.occupiedDesks.includes(deskUuid)) return "occupiedDesk";
    if (
      this.deskService.isDeskSelected(deskUuid) &&
      !this.occupiedDesks.includes(deskUuid)
    )
      return "selectedDesk";
    else return "notSelectedDesk";
  }

  calculateCoordinates() {
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
}

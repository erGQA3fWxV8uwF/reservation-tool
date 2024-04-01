import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, map, take } from "rxjs";
import { DeskService } from "./desk.service";
import { RoomService } from "./room.service";
import { DialogFailComponent } from "src/app/pages/rooms/rooms-reservate/dialog-fail/dialog-fail.component";
import { DialogSuccesfullComponent } from "src/app/pages/rooms/rooms-reservate/dialog-succesfull/dialog-succesfull.component";



@Injectable({
  providedIn: "root",
})
export class ReservationService {
  reservationsCollection: AngularFirestoreCollection<any> =
    this._angularFirestore.collection("reservations");
  reservations: Observable<any[]>;
  currentDate: Date;
  counterOfCreatedReservations: number = 0;
  edit: boolean = false;
  eventData: any[] = [];

  arrWithDatesWhereReservationFailed: any[] = [];
  roomDataForReservations: any[] = [];
  private reservationTakenSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private _angularFirestore: AngularFirestore,
    private _deskService: DeskService,
    private _matDialog: MatDialog,
    private _roomService: RoomService,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _router: Router
  ) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.currentDate = currentDate;

    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 2);

    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    this.reservationsCollection =
      this._angularFirestore.collection("reservations");
    this.reservations = this._angularFirestore
      .collection("reservations", (ref) =>
        ref.where("date", ">", yesterday).where("date", "<", tomorrow)
      )
      .valueChanges();
  }

  getRoomTypeReservation() {
    let roomDesksCollection = this._angularFirestore.collection("rooms");
    return roomDesksCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const uuid = action.payload.doc.id;
          const maxCapacity = data?.maxCapacity;
          const mapPath = data.mapPath;
          const name = data.name;
          const path = data.path;
          const type = data.type;
          return { maxCapacity, mapPath, name, path, type, uuid, ...data };
        });
      })
    );
  }

  getReservationsForRoom(roomUuid: string): Observable<any[]> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    return this._angularFirestore
      .collection("reservations", (ref) => ref.where("room", "==", roomUuid))
      .valueChanges()
      .pipe(
        map((reservations: any[]) => {
          return reservations.map((reservation) => ({
            ...reservation,
            id: reservation.uuid,
          }));
        })
      );
  }

  getReservations(uid: string, selectedDate?: Date): Observable<any[]> {
    let query
      if (selectedDate) {          
        let startDate = new Date(selectedDate); 
        startDate.setDate(selectedDate.getDate() - 1); 
        
        let endDate = new Date(selectedDate); 
        endDate.setDate(selectedDate.getDate() + 1); 
                  
        query = this._angularFirestore.collection("reservations", (ref) => ref.where("user", "==", uid).where("date", "<", endDate).where("date", ">", startDate))
        
      }
    else {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);    
      query = this._angularFirestore.collection("reservations", (ref) => ref.where("user", "==", uid).where("date", ">=", currentDate))
    } 
  

  return query
    .snapshotChanges()
    .pipe(
      map((reservations: any[]) => {
        return reservations.map((reservation) => ({
          id: reservation.payload.doc.id,
          ...reservation.payload.doc.data(),
        }));
      })
    );
}


  returnSortedData() {
    return this.eventData;
  }

  getEventData(userUuid: string) {
    this._angularFirestore
      .collection("reservations", (ref) => ref.where("user", "==", userUuid))
      .snapshotChanges()
      .pipe(
        map((reservations: any[]) => {
          return reservations.map((reservation) => ({
            id: reservation.payload.doc.id,
            ...reservation.payload.doc.data(),
          }));
        })
      )
      .subscribe((data: any[]) => {
        this.eventData = data;
      });
  }

  loadDataForPicker(reservationDate: any, roomUuid: string = "") {
    return this._roomService.getCapacityAtDate(reservationDate, roomUuid);
  }

  loadDataForReservation(
    startHour: number,
    endHour: number,
    startTime: number,
    endTime: number,
    reservationDate: any,
    userUuid: string
  ) {
    try {
      this._roomService
        .getCapacityAtDate(reservationDate, this._roomService.selectedRoom.uuid)
        .pipe(take(1))
        .subscribe((roomData) => {
          this.roomDataForReservations = roomData;
          let startHourIndex = startHour;

          if (this._roomService.selectedRoom.type === "meeting") {
            while (startHourIndex <= endHour) {
              this.roomDataForReservations[startHourIndex] += 1;
              startHourIndex++;
            }
          } else {
            while (startHourIndex <= endHour) {
              let prevReservationCount = Object.keys(
                this.roomDataForReservations[startHourIndex]
              ).length;
              let newObj = false;
              if (!prevReservationCount) {
                this.roomDataForReservations[startHourIndex] = {
                  ...this._deskService.deskUuids,
                };
              } else {
                let additionalCount = 0;
                let prevValues = Object.values(
                  this.roomDataForReservations[startHourIndex]
                );

                this._deskService.deskUuids.forEach(
                  (desk: string, index: number) => {
                    let newDeskKey =
                      prevReservationCount + index + additionalCount;

                    while (
                      newDeskKey in this.roomDataForReservations[startHourIndex]
                    ) {
                      additionalCount += 1;
                      newDeskKey =
                        prevReservationCount + index + additionalCount;
                    }

                    prevValues.push(desk);
                    this.roomDataForReservations[startHourIndex] = {
                      ...prevValues,
                    };
                  }
                );
              }
              startHourIndex += 1;
            }
          }
          this.takeReservation(startTime, endTime, reservationDate, userUuid);
        });
    } catch (error) {
      console.error(error);
    }
  }

  takeReservation(
    startTime: number,
    endTime: number,
    reservationDate: any,
    userUuid: string
  ) {
    if (
      this._deskService.numberOfReservations === 0 &&
      this._roomService.selectedRoom.type !== "meeting"
    ) {
      const translatedText = this._translateService.instant(
        "TAKERESERVATION.UNSELECTED_DESK"
      );

      this.openFailDialog(translatedText);
      return;
    }

    const updatePath = `capacity.${reservationDate.toDateString()}`;
    this._angularFirestore
      .collection("rooms")
      .doc(this._roomService.selectedRoom.uuid)
      .update({
        [updatePath]: this.roomDataForReservations,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    let reservation = {};
    if (this._roomService.selectedRoom.type !== "meeting")
      reservation = {
        startTime: startTime,
        endTime: endTime,
        date: reservationDate,
        room: this._roomService.selectedRoom.uuid,
        desks: this._deskService.deskUuids,
        user: userUuid,
      };
    else {
      reservation = {
        startTime: startTime,
        endTime: endTime,
        date: reservationDate,
        room: this._roomService.selectedRoom.uuid,
        user: userUuid,
      };
    }

    this._angularFirestore
      .collection("reservations")
      .add(reservation)
      .then((docRef) => {
        if (this.edit) {
          const translatedMessage = this._translateService.instant(
            "TAKERESERVATION.EDIT_SUCCESS"
          );
          this._router.navigate(["/myBookings"]);
          this._snackBar.open(translatedMessage, "", {
            panelClass: "success-snackbar",
            duration: 2000,
          });
        } else this.openSuccessDialog();
        this.edit = false;

        this._deskService.clearNumberOfReservationsValue();
      })
      .catch((error) => {});

    this._deskService.clearDeskUuid();
    this.reservationTakenSubject.next();
  }
  getReservationTakenObservable(): Observable<void> {
    return this.reservationTakenSubject.asObservable();
  }

  openSuccessDialog() {
    const dialogRef = this._matDialog.open(DialogSuccesfullComponent, {
      width: "90%",
      height: "auto",
      maxWidth: "900px",
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openFailDialog(errorText?: string) {
    const dialogRef = this._matDialog.open(DialogFailComponent, {
      width: "90%",
      height: "auto",
      maxWidth: "900px",
      data: {
        errorText: errorText ?? null,
      },
    });
  }

  async deleteReservation(event: any): Promise<void> {
    try {
      const startHour = event.startTime / 100;
      const endHour = event.endTime / 100;
      let reservationDate: any;

      if (typeof event.date === "string") {
        this.edit = true;
        const [day, month, year] = event.date.split(".");
        reservationDate = new Date(year, month - 1, day);
      } else {
        reservationDate = new Date(event.date.seconds * 1000);
      }

      const numberOfReservations = event.places;
      const roomID = event.room;
      let prevCapacity: any = {};
      prevCapacity = await this._roomService
        .getCapacityAtDate(reservationDate, roomID)
        .pipe(take(1))
        .toPromise();

      let indexToUpdateStart = startHour;
      const indexToUpdateEnd = endHour;

      if (!event?.desks) {
        while (indexToUpdateStart <= indexToUpdateEnd) {
          const currentValue = prevCapacity[indexToUpdateStart];
          const updatedValue = currentValue - 1;
          prevCapacity[indexToUpdateStart] = updatedValue;
          indexToUpdateStart++;
        }
      } else {
        while (indexToUpdateStart <= indexToUpdateEnd) {
          const prevValueArr = Object.entries(prevCapacity[indexToUpdateStart]);
          const filteredArr = prevValueArr.filter(
            ([key, value]) => !event.desks.includes(value)
          );
          const newValue = Object.fromEntries(filteredArr);

          prevCapacity[indexToUpdateStart] = newValue;
          indexToUpdateStart++;
        }
      }

      reservationDate = reservationDate.toDateString();
      const newCapacity = prevCapacity;
      const updatePath = `capacity.${reservationDate}`;

      await this._angularFirestore
        .collection("rooms")
        .doc(roomID)
        .update({
          [updatePath]: newCapacity,
        });

      const reservationRef = this._angularFirestore
        .collection("reservations")
        .doc(event.id);
      await reservationRef.delete();
    } catch (error) {
      console.error(error);
    }
  }
}

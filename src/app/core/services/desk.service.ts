import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Observable, map } from "rxjs";
import { RoomService } from "./room.service";

@Injectable({
  providedIn: "root",
})
export class DeskService {
  desksCollection: AngularFirestoreCollection<any>;
  desks: Observable<any[]>;
  deskUuids: any = [];
  numberOfReservations: number = 0;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _roomService: RoomService
  ) {
    this.desksCollection = this._angularFirestore.collection("desks");
    this.desks = this.desksCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const room = data.room;
          const x = data.x;
          const y = data.y;
          const simpleId = data.simpleId;
          const uuid = action.payload.doc.id;

          return { room, x, y, simpleId, uuid };
        });
      })
    );
  }

  addDesks(deskData: any) {
    return this._angularFirestore.collection("desks").add(deskData);
  }

  setDeskUuid(deskUuid: string) {
    if (!this.deskUuids.includes(deskUuid)) {
      if (Array.isArray(deskUuid)) {
        this.deskUuids.push(...deskUuid);
        this.numberOfReservations += deskUuid.length;
      } else {
        this.deskUuids.push(deskUuid);
        this.numberOfReservations += 1;
      }
    }
  }

  deleteDeskUuid(deskUuid: string) {
    this.deskUuids = this.deskUuids.filter((uuid: string) => {
      return uuid !== deskUuid;
    });
    this.numberOfReservations -= 1;
  }

  clearNumberOfReservationsValue() {
    this.numberOfReservations = 0;
  }
  clearDeskUuid() {
    this.deskUuids = [];
  }
  isDeskSelected(deskUuid: string) {
    return Object.values(this.deskUuids).includes(deskUuid);
  }
  async deleteDesk(id: any) {
    const roomDocRef = this._angularFirestore
      .collection("rooms")
      .doc(this._roomService.selectedRoom.uuid);
    roomDocRef.update({
      maxCapacity: this._roomService.selectedRoom.maxCapacity - 1,
    });
    this._angularFirestore.collection("desks").doc(id).delete();
    this._roomService.selectedRoom.maxCapacity -= 1;
  }
  getNonAvailableDesks(
    selectedDate: any,
    startHour: number,
    endHour: number,
    edit: boolean = false
  ): Observable<string[]> {
    return this._roomService.getCapacityAtDate(selectedDate).pipe(
      map((currentCapacities: any[]) => {
        let indexToUpdateStart = startHour;
        const indexToUpdateEnd = endHour - 1;
        const notAvailable: string[] = [];
        if (edit) {
          while (indexToUpdateStart <= indexToUpdateEnd) {
            const currentValue = currentCapacities[indexToUpdateStart];
            if (currentValue) {
              const deskUuids = Object.values(currentValue) as string[];
              deskUuids.forEach((deskUuid) => {
                if (
                  !notAvailable.includes(deskUuid) &&
                  !this.isDeskSelected(deskUuid)
                ) {
                  notAvailable.push(deskUuid);
                }
              });
            }

            indexToUpdateStart++;
          }
        } else {
          while (indexToUpdateStart <= indexToUpdateEnd) {
            const currentValue = currentCapacities[indexToUpdateStart];

            if (currentValue) {
              const deskUuids = Object.values(currentValue) as string[];
              deskUuids.forEach((deskUuid) => {
                if (!notAvailable.includes(deskUuid)) {
                  notAvailable.push(deskUuid);
                }
              });
            }

            indexToUpdateStart++;
          }
        }

        return notAvailable;
      })
    );
  }
  
  async getOccupiedDeskUser(selectedDate: any, deskUuid: string) {
    const dayAfter = new Date(selectedDate);
    dayAfter.setDate(selectedDate.getDate() + 1);

    const dayBefore = new Date(selectedDate);
    dayBefore.setDate(selectedDate.getDate() - 1);

    const reservationCollection = this._angularFirestore.collection("reservations", (ref) =>
      ref
        .where("desks", "array-contains", deskUuid)
        .where("date", ">", dayBefore)
        .where("date", "<", dayAfter)
    );
    const reservation = await reservationCollection.get().toPromise();
    const userId: any = reservation?.docs.map((doc) => {
      const data: any = doc.data();
      return data.user;
    });

    const userDoc = await this._angularFirestore
      .collection("users")
      .doc(userId[0])
      .get()
      .toPromise();
    const userData: any = userDoc?.data();

    if (userData) {
      return {
        displayName: userData?.displayName,
        photoURL: userData?.photoURL,
      };
    } else {
      return {};
    }
  }

  getSpecificBookedDesks(reservationId?: string) {
    return this._angularFirestore
      .collection("reservations")
      .doc(reservationId)
      .valueChanges();
  }
  getDeskByUuid(deskUuId: string) {
    return this._angularFirestore
      .collection("desks")
      .doc(deskUuId)
      .valueChanges();
  }
}


import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Observable, map } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class RoomService {
  selectedRoom: any;
  roomsCollection: AngularFirestoreCollection<any>;
  rooms: any;

  constructor(private _angularFirestore: AngularFirestore) {
    this.roomsCollection = this._angularFirestore.collection("rooms");
    this.rooms = this.roomsCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const { name, maxCapacity, capacity, type, mapPath, path } =
            action.payload.doc.data();
          const uuid = action.payload.doc.id;
          return { uuid, name, capacity, maxCapacity, type, path, mapPath };
        });
      })
    );
  }

  setSelectedRoom(room: any) {
    this.selectedRoom = room;
    localStorage.setItem("selectedRoom", JSON.stringify(room));
  }
  async setSelectedRoomFromId(uuid: string) {
    return new Promise<void>((resolve, reject) => {
      this.roomsCollection
        .doc(uuid)
        .get()
        .subscribe(
          (doc) => {
            const { name, maxCapacity, type, mapPath, path } = doc.data();
            const roomUuid = doc.id;

            const room = {
              uuid: roomUuid,
              name,
              maxCapacity,
              type,
              path,
              mapPath,
            };

            this.setSelectedRoom(room);
            resolve(); // Resolve the promise to indicate completion
          },
          (error) => {
            reject(error); // Reject the promise in case of an error
          }
        );
    });
  }

  addRoom(roomData: any) {
    return this._angularFirestore.collection("rooms").add(roomData);
  }
  deleteRoom(roomId: string): Promise<void> {
    return this._angularFirestore.collection("rooms").doc(roomId).delete();
  }
  editRoom(postData: any, roomID: any): Promise<void> {
    return this._angularFirestore
      .collection("rooms")
      .doc(roomID)
      .update(postData);
  }

  deleteAllReservationsFromRoom(roomID: any) {
    let dataArr: any[] = [];

    this._angularFirestore
      .collection("reservations", (ref) => ref.where("room", "==", roomID))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const reservation: any = doc.data();
          reservation.id = doc.id;
          dataArr.push(reservation);
        });

        dataArr.forEach((reservation) => {
          this._angularFirestore
            .collection("reservations")
            .doc(reservation.id)
            .delete();
        });
      });
  }
  async getRoomDesks(): Promise<any[]> {
    if (this.selectedRoom) {
      const roomDesksCollection = this._angularFirestore.collection(
        "desks",
        (ref) => ref.where("room", "==", this.selectedRoom.uuid)
      );

      const snapshot = await roomDesksCollection.get().toPromise();

      const desks: any = snapshot?.docs.map((doc) => {
        const data: any = doc.data();
        const uuid = doc.id;
        return { uuid, ...data };
      });

      return desks;
    } else {
      return [];
    }
  }
  updateMaxCapacity(desksToAdd: number) {
    return this._angularFirestore
      .collection("rooms")
      .doc(this.selectedRoom.uuid)
      .update({ maxCapacity: desksToAdd });
  }
  async setSimpleId(desks: any[]) {
    const updatePromises: Promise<any>[] = [];
    let i = 1;

    for (const data of desks) {
      const updatePromise = this._angularFirestore
        .collection("desks")
        .doc(data.uuid)
        .update({
          simpleId: i + "-" + this.selectedRoom.name,
        });

      updatePromises.push(updatePromise);
      i++;
    }

    Promise.all(updatePromises);
  }

  getCapacityAtDate(date: any, roomUuid: string = ""): Observable<any[]> {
    date = date.toDateString();

    let roomDoc;
    if (roomUuid.length) {
      roomDoc = this._angularFirestore.collection("rooms").doc(roomUuid);
    } else {
      roomDoc = this._angularFirestore
        .collection("rooms")
        .doc(this.selectedRoom.uuid);
    }

    return roomDoc.snapshotChanges().pipe(
      map((snapshot) => {
        const roomData = snapshot?.payload.data();
        const capacityData = roomData?.capacity;
        let capacityObject: any[];

        if (capacityData && capacityData[date]) {
          capacityObject = capacityData[date];
        } else {
          if (this.selectedRoom?.type === "meeting") {
            capacityObject = Array(24).fill(0);
          } else {
            capacityObject = Array(24).fill({});
          }
        }
        return capacityObject;
      })
    );
  }
  getAllCapacities(roomUuid: string = ""): Observable<any[]> {
    let roomDoc;
    if (roomUuid.length) {
      roomDoc = this._angularFirestore.collection("rooms").doc(roomUuid);
    } else {
      roomDoc = this._angularFirestore.collection("rooms").doc(this.selectedRoom.uuid);
    }

    return roomDoc.snapshotChanges().pipe(
      map((snapshot) => {
        const roomData = snapshot?.payload.data();
        return roomData?.capacity;
      })
    );
  }

  getSpecificRoom(roomId: any) {
    return this._angularFirestore
      .collection("rooms")
      .doc(roomId)
      .valueChanges();
  }
}

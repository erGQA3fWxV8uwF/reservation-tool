import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  userCollection: AngularFirestoreCollection<any>;
  users: any;
  private _todayDate: Date = new Date();
  private _startDate : Date= new Date(2022, 1 - 1, 1);
  
  constructor(private _angularFirestore: AngularFirestore) {
    this._todayDate.setHours(0, 0, 0, 0);
    this.userCollection = this._angularFirestore.collection("users");
    this.users = this.userCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const { displayName, uid } = action.payload.doc.data();
          const uuid = action.payload.doc.id;
          return { displayName, uid };
        });
      }),
      map((users) => {
        return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
      })
    );
  }

  getUserCoffeList(): Observable<any> {
    let roomDesksCollection = this._angularFirestore.collection("users");
    return roomDesksCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((action) => {
          const data: any = action.payload.doc.data();
          const displayName = data.displayName;
          const id = action.payload.doc.id;
          const email = data.email;
          const coffee = data.coffee;
          const photoURL = data.photoURL;
          return { id, coffee, displayName, email, photoURL };
        });
      })
    );
  }

  getUserData(userId: string): Observable<any[]> {
    return this._angularFirestore
      .collection("users")
      .doc(userId)
      .snapshotChanges()
      .pipe(
        map((user: any) => {
          return {
            id: user.payload.id,
            ...user.payload.data(),
          };
        })
      );
  }



  async updateCoffeeList(uid: string, coffee: Array<object>): Promise<void> {
    this._angularFirestore.collection("users").doc(uid).update({
      coffee: coffee,
    });
  }
  getReservationsForUser(uid: string) {
    return this._angularFirestore
      .collection("reservations", (ref) => {
        let query = ref
          .where("user", "==", uid)
          .where("date", ">=", this._todayDate);

        return query;
      })
      .valueChanges();
  }

  getReservations() {
    return this._angularFirestore
      .collection("reservations", (ref) => {
        let query = ref.where("date", ">=", this._todayDate);
        return query;
      })
      .valueChanges();
  }
  getRoomName(uid: string) {
    return this._angularFirestore
      .collection("rooms", (ref) => {
        let query = ref.where("uid", "==", uid);

        return query;
      })
      .valueChanges();
  }
  getReservationsForUserWithOld(uid: string) {
    return this._angularFirestore
      .collection("reservations", (ref) => {
        let query = ref
          .where("user", "==", uid)
          .where("date", ">=", this._startDate);
        return query;
      })
      .valueChanges();
  }
  getReservationsWithOld() {
    return this._angularFirestore
      .collection("reservations", (ref) => {
        let query = ref.where("date", ">=", this._startDate);
        return query;
      })
      .valueChanges();
  }

  updateExpiredPayment(userid: string) {
    this._angularFirestore.collection("users").doc(userid).update({
      coffee: [],
    });
  }
  updatePayment(userid: string, updateCoffeeList: any) {
    this._angularFirestore.collection("users").doc(userid).update({
      coffee: updateCoffeeList,
    });
  }
}

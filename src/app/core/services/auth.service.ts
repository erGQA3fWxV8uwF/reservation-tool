import { Injectable } from "@angular/core";
import { GoogleAuthProvider } from "@angular/fire/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { User } from "./user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;
  userRole: string = "member";

  constructor(
    public angularFireStore: AngularFirestore,
    private _angularFireAuth: AngularFireAuth,
    private _router: Router
  ) {
    this._angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user")!);
        this.loadAdminStatus();
      } else {
        localStorage.setItem("user", "null");
        JSON.parse(localStorage.getItem("user")!);
        this.loadAdminStatus();
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user")!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  signOut() {
    return this._angularFireAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this._router.navigate(["/login"]);
    });
  }

  setDefaultUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFireStore.doc(
      `users/${user.uid}`
    );

    return new Promise<void>((resolve, reject) => {
      userRef.get().subscribe(
        (doc) => {
          if (doc.exists) {
            resolve();
          } else {
            const userData: User = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              language: "de",
              role: "member",
              coffee: [],
            };
            userRef
              .set(userData, { merge: true })
              .then(() => resolve())
              .catch((error) => reject(error));
          }
        },
        (error) => reject(error)
      );
    });
  }

  authenticateWithGoogleHD() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "pomino.ch" });
    return this.authLogin(provider);
  }

  authLogin(provider: any) {
    return this._angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user?.email?.endsWith("@pomino.ch")) {
          return this.setDefaultUserData(result.user)
            .then(() => {
              const uid = result.user?.uid ?? "";
              return this.checkUserRole(uid);
            })
            .then(() => {
              return this._router.navigate(["/"]);
            });
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loadAdminStatus(): void {
    const userUuid = this.userData?.uid;
    this.checkUserRole(userUuid).then((role) => {
      if (role === "admin") {
        this.userRole = "admin";
      }
   else if  (role === "waiter") {
        this.userRole = "waiter";
      }
    });
  }

  checkUserRole(userID: any): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      this.angularFireStore
        .collection("users")
        .doc(userID)
        .get()
        .subscribe(
          (doc) => {
            if (!doc.exists) {
              resolve(null); // Benutzer existiert nicht, also gibt null zurück
            } else {
              const userData: any = doc.data();
              const userRole = userData.role || "member"; // Wenn das Feld "role" nicht existiert, setzt es auf "member"              resolve(userRole);
          resolve(userRole)
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getAllUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.angularFireStore
        .collection("users")
        .get()
        .subscribe(
          (querySnapshot) => {
            const users: User[] = [];

            querySnapshot.forEach((doc) => {
              const userData = doc.data() as User;
              users.push(userData);
            });

            resolve(users);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  updateUserRole(userId: string, newRole: string) {
    this.angularFireStore
      .collection("users")
      .doc(userId)
      .update({
        role: newRole,
      })
      .then(() => {
        console.log(`Role for user with ID ${userId} updated to ${newRole}`);
      })
      .catch((error) => {
        console.error("Error updating user role: ", error);
      });
  }
}

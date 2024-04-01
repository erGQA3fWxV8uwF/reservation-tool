// theme.service.ts
import { Injectable, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  storedTheme$ = signal<string>("theme-light");

  constructor(private _angularFirestore: AngularFirestore) {}

  setDarkMode(uid: string, isDark: boolean) {
    this.storedTheme$.set(isDark === true ? "theme-dark" : "theme-light");

    this._angularFirestore
      .collection("users")
      .doc(uid)
      .update({
        darkMode: isDark === true ? "theme-dark" : "theme-light",
      });
  }
  loadDarkMode(uid: string) {
    return this._angularFirestore
      .collection("users", (ref) => {
        let query = ref.where("uid", "==", uid);
        return query;
      })
      .valueChanges()
      .subscribe((users: any[]) => {
        if (users.length > 0) {
          const darkMode = users[0].darkMode || "theme-light";
          this.storedTheme$.set(darkMode);
        } else {
          this.storedTheme$.set("theme-light");
        }
      });
  }
}

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
@Injectable({
  providedIn: "root",
})
export class AdminGuard  {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise<boolean | UrlTree>((resolve, reject) => {
      const userId = this.authService.userData?.uid;
      this.authService
        .checkUserRole(userId)
        .then((role) => {
          if (role === "admin") {
            resolve(true);
          } else if (role === "waiter") {
            resolve(true);
          } else {
            resolve(this.router.parseUrl("/"));
          }
        })
        .catch((error) => {
          console.error("Fehler beim Überprüfen des Admin-Status:", error);
        });
    });
  }
}

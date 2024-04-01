import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminGuard } from "./core/guards/admin.guard";
import { AuthGuard } from "./core/guards/auth.guard";
import { AdminPage } from "./pages/admin/admin.page";
import { RoomsPage } from "./pages/rooms/rooms.page";

import { AdminModule } from "./pages/admin/admin.module";
import { AuthModule } from "./pages/auth/auth.module";
import { LoginPage } from "./pages/auth/login/login.page";
import { RoomsModule } from "./pages/rooms/rooms.module";
import { SettingsModule } from "./pages/settings/settings.module";
import { SettingsPage } from "./pages/settings/settings.page";
import { BookingsModule } from './pages/bookings/bookings.module';
import { AdminRoomsModule } from "./pages/admin/admin-rooms/admin-rooms.module";
import { AdminUserManagmentModule } from './pages/admin/admin-user-management/admin-user-managment.module';
import { AdminReservationsModule } from "./pages/admin/admin-reservations/admin-reservations.module";

const routes: Routes = [
  {path: "" , redirectTo: "/rooms", pathMatch: 'full'},
  {
    path: "rooms",
    component: RoomsPage,
    canActivate: [AuthGuard],
   
  },
  {
    path: "rooms/reservate",
    loadChildren: () =>
      import("./pages/rooms/rooms-reservate/rooms-reservate.module").then(
        (m) => m.RoomsReservateModule
      ),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
  },
  

  {
    path: "admin",
    component: AdminPage,
    canActivate: [AuthGuard, AdminGuard],
    
  },
  
  {
    canActivate: [AuthGuard, AdminGuard],
    path: "admin/coffees",
    loadChildren: () =>
    import("./pages/admin/admin-coffee/admin-coffee.module").then(
      (m) => m.AdminCoffeeModule
      ),
    },
    {
      path: "admin/rooms",
      loadChildren: () =>
      import("./pages/admin/admin-rooms/admin-rooms.module").then(
        (m) => m.AdminRoomsModule
        ),
        canActivate: [AuthGuard, AdminGuard],
        
      },
      
      {
        path: "admin/reservations",
        loadChildren: () =>
        import(
          "./pages/admin/admin-reservations/admin-reservations.module"
          ).then((m) => m.AdminReservationsModule),
          canActivate: [AuthGuard, AdminGuard],
        },
        {
          path: "admin/user-management",
          loadChildren: () =>
          import(
            "./pages/admin/admin-user-management/admin-user-managment.module"
            ).then((m) => m.AdminUserManagmentModule),
            canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "bookings",
    canActivate: [AuthGuard],
    loadChildren: () =>
    import("./pages/bookings/bookings.module").then(
      (m) => m.BookingsModule
    ),
    
  },
  { path: "settings", component: SettingsPage, canActivate: [AuthGuard] },

  { path: "login", component: LoginPage  },

  {path: '**' , redirectTo: "/rooms", pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    RoomsModule,
    AdminModule,
    SettingsModule,
    AuthModule,
    // AdminRoomsModule,
    // AdminUserManagmentModule,
    // AdminReservationsModule,
    BookingsModule, 
  ]
    ,
  exports: [RouterModule],
})
export class AppRoutingModule {}

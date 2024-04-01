import { NgClass } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AdminReservationsPage } from "./admin-reservations.page";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
const routes: Routes = [
  { path: '', component: AdminReservationsPage } 
];
@NgModule({
  declarations: [AdminReservationsPage],
  imports: [
    TranslateModule,
    

    // Mat
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    

    //Angular
    RouterModule.forChild(routes),
    NgClass,
    FormsModule,
    
  ],
  providers: [],
})
export class AdminReservationsModule {}

import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AdminUserManagementPage } from "./admin-user-management.page";
import { MatFormFieldControl, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  { path: "", component: AdminUserManagementPage },
]

@NgModule({
  declarations: [AdminUserManagementPage],
  imports: [
    TranslateModule,

    // Mat
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,

    
    MatTableModule,
    MatFormFieldModule,

    //Angular
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class AdminUserManagmentModule {}

import { CommonModule, NgClass, NgStyle } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { AdminRoomsPage } from "./admin-rooms.page";
import { DialogCreateRoomComponent } from "./dialog-create-room/dialog-create-room.component";
import { DialogDeleteRoomComponent } from "./dialog-delete-room/dialog-delete-room.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { AdminGuard } from "src/app/core/guards/admin.guard";
import { MatButtonModule } from "@angular/material/button";
import { BarStylePipe } from "./dialog-create-room/bar-style.pipe";
import { SplitIntoRowsPipe } from "../../../core/pipes/date-picker.pipe";
import { MatSelectModule } from "@angular/material/select";
import {MatInputModule} from '@angular/material/input';import { AdminRoomBuildPage } from "./admin-room-build/admin-room-build.page";
import { AdminRoomBuildModule } from "./admin-room-build/admin-room-build.module";
 const routes: Routes = [
  { path: "", component: AdminRoomsPage },
  {
    path: "build/:id",
    component: AdminRoomBuildPage,
    canActivate: [AuthGuard, AdminGuard],
  },
];

// },
@NgModule({
  declarations: [
    AdminRoomsPage,
    DialogCreateRoomComponent,
    DialogDeleteRoomComponent,
  ],
  imports: [
    TranslateModule,

    // Mat
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatOptionModule,
    MatCardModule,
    MatInputModule,    MatFormFieldModule,
    MatCheckboxModule,

    //Angular
    CommonModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NgStyle,
    
    //Pipes 
    BarStylePipe,
    SplitIntoRowsPipe , 
    
    AdminRoomBuildModule,
    RouterModule.forChild(routes),

  ],
  providers: [],
})
export class AdminRoomsModule {}

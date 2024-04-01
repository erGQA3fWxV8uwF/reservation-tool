import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { take } from "rxjs";
import { UserService } from "src/app/core/services/user.service";
import { DialogPayComponent } from "./dialog-pay/dialog-pay.component";
import { ThemeService } from "src/app/core/services/theme.service";

@Component({
  selector: 'app-admin-coffee',
  templateUrl: './admin-coffee.page.html',
  styleUrls: ['./admin-coffee.page.sass'],

})
export class AdminCoffeePage {
  //ngx-charts-props
  view: any = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel1 = "Name";
  showYAxisLabel = true;
  yAxisLabel1 = "Amount of Coffee";
  yAxisLabel2 = "Amount of Coffee";
  xAxisLabel2 = "Weekday";

  xData: string = "";
  yData: number = 0;
  single: any = [];
  single2: any = [];
  displayedColumns: string[] = ["Profil","Name","Mail","coffee","Payed","Status","button"];

  coffeeList: any = [];
  storedTheme: string = "theme-light";
  getUserCoffeListService: any;
  coffeePayementState: string = "offen";
  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
  };
  dataSource = new MatTableDataSource(this.coffeeList);

  @ViewChild("pdfContent") pdfContent!: ElementRef;
  constructor(
    public userService: UserService,
    private _changeDetector: ChangeDetectorRef,
    private _matDialog: MatDialog,
    public themeService: ThemeService,

  ) {}

  ngOnInit() {
    this.loadCoffeeData();
  }

  ngOnDestroy() {
    this.getUserCoffeListService.unsubscribe();
  }


  loadCoffeeData() {
    this.getUserCoffeListService = this.userService
      .getUserCoffeList()
      .pipe(take(2))
      .subscribe((data) => {
        this.coffeeList = data;
        const usersWithCoffeeArray = this.coffeeList.filter((element: any) => {
          return Array.isArray(element.coffee);
        });
        this.coffeeList = usersWithCoffeeArray;
        this.single = usersWithCoffeeArray.map((element: any) => {
          return { name: element.displayName, value: element.coffee.length };
        });

        this._changeDetector.detectChanges();

        const dayWithCoffeeArray = this.coffeeList.filter((element: any) => {
          return Array.isArray(element.coffee);
        });
        var daysOfWeek = [
          { name: "Sunday", value: 0 },
          { name: "Monday", value: 0 },
          { name: "Tuesday", value: 0 },
          { name: "Wednesday", value: 0 },
          { name: "Thursday", value: 0 },
          { name: "Friday", value: 0 },
          { name: "Saturday", value: 0 },
        ];

        dayWithCoffeeArray.map((element: any) => {
          element.coffee.forEach((element: any) => {
            const currentDate = new Date();
            const lastDayOfMonth = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            );
            const tenDaysBefore = new Date(lastDayOfMonth);
            tenDaysBefore.setDate(lastDayOfMonth.getDate() - 10);
            if (element.is_paid == false)
              if (currentDate.getDate() == lastDayOfMonth.getDate()) {
                this.coffeePayementState = "abgelaufen";
              }
            if (currentDate.getDate() == tenDaysBefore.getDate()) {
              this.coffeePayementState = "bald";
            } else {
              this.coffeePayementState = "offen";
            }
            //second Diagramm
            var date = new Date(element.date.seconds * 1000);

            daysOfWeek[date.getDay()].value++;
            this.single2 = daysOfWeek;
          });
        });

        for (let index1 = 0; index1 < this.coffeeList.length; index1++) {
          for (
            let index2 = 0;
            index2 < this.coffeeList[index1].coffee.length;
            index2++
          ) {
            if (!this.coffeeList[index1].coffee[index2].is_paid) {
              this.coffeeList[index1]["allPaid"] = false;

              break;
            } else this.coffeeList[index1]["allPaid"] = true;
          }
        }
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.coffeeList.filter = filterValue.trim().toLowerCase();
  }

  downloadPdf() {
    const divElement = document.querySelector(".charts") as HTMLElement;

    html2canvas(divElement, { scale: 2 }).then((canvas: any) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Vollständige Qualität
      const pdf = new jsPDF({
        orientation: "p", // Hochformat
        unit: "mm",
      });

      // Passen Sie die PDF-Größe an den Inhalt an
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        30,
        pdfWidth,
        pdfHeight,
        undefined,
        "SLOW"
      );

      // Fügen Sie einen Titel hinzu
      pdf.setFontSize(18); // Schriftgröße für den Titel
      pdf.text("Auswertung Kaffeeliste", 10, 10); // Titeltext und Position

      pdf.save("coffeeList.pdf");
    });
  }

  openDialog(id: string) {
    const _matDialogRef = this._matDialog.open(DialogPayComponent, {
      width: "50%",
      height: "auto",
      maxWidth: "600px",
      data: { id: id, expired: this.coffeePayementState },
    });
  }


}

import {Component} from '@angular/core';
import {InvoiceModel, InvoiceService, LoaderServiceService} from "../../../common";
import {map} from "rxjs";

declare var MainJS: any;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {

  public invoices: InvoiceModel[] = [];

  constructor(
    private invoiceRepository: InvoiceService,
    private loaderService: LoaderServiceService
  ) {
  }

  ngOnInit(): void {
    this.getInvoices();
    this.initScripts();
  }

  getInvoices() {
    this.loaderService.display(true);
    this.invoiceRepository.getAll().snapshotChanges().pipe(map(changes =>
      changes.map(c => ({
          id: c.payload.doc.id, ...c.payload.doc.data()
        })
      ))).subscribe(data => {
      this.invoices = data;
      this.loaderService.display(false);
    });
  }

  initScripts() {
    MainJS.init();
  }

}

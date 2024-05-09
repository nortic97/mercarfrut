import {Component, ViewEncapsulation} from '@angular/core';
import {InvoiceModel, LoaderServiceService, PopUpsService} from "../../../common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InvoiceService} from "../../../common/repository/invoice.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreditCardComponent {

  public paymentForm: FormGroup;
  public invoice: InvoiceModel = new InvoiceModel();

  constructor(
    private fb: FormBuilder,
    private alert: PopUpsService,
    private invoiceRepository: InvoiceService,
    private router: Router,
    private loaderService: LoaderServiceService,
  ) {
    setTimeout(() => {
      this.invoice = JSON.parse(sessionStorage.getItem('invoice')!) as InvoiceModel;
    }, 200)
    this.paymentForm = this.fb.group({
      fullName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', Validators.required]
    });

    setTimeout(() => {
      this.paymentForm.controls['fullName'].setValue(this.invoice.cliente?.fullName || '');
    }, 200)
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {

      this.loaderService.display(true);

      const randomBoolean = this.generateRandomBoolean();

      setTimeout(()=>{
        if (randomBoolean) {
          this.invoiceRepository.updateInvoice(this.invoice.uuid!, randomBoolean);
          this.loaderService.display(false);
          this.router.navigate(['/home/thanks']);
        } else {
          this.invoiceRepository.updateInvoice(this.invoice.uuid!, randomBoolean);
          this.loaderService.display(false);
          this.alert.showAlert("Error!", 'Pago rechazado!', "error")
        }
      },5000)

    } else {
      this.alert.showAlert("Error!", 'Formulario Invalido', "error")
    }
  }

  generateRandomBoolean(): boolean {
    // Genera un número aleatorio entre 0 y 1
    const randomNumber = Math.random();

    // Define un umbral (por ejemplo, 0.5) para decidir si el valor es verdadero o falso
    const threshold = 0.5;

    // Compara el número aleatorio con el umbral
    // Si es mayor o igual al umbral, devuelve true, de lo contrario, devuelve false
    return randomNumber >= threshold;
  }

}

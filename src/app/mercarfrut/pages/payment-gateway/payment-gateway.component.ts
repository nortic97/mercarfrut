import {Component} from '@angular/core';
import {
  InvoiceModel,
  LoaderServiceService,
  PaymentGatewayModel,
  PopUpsService,
  UserModel,
  UserService
} from "../../../common";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import {OrdersService} from "../../../common/repository/orders.service";

declare var MainJS: any;

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {

  public invoice: InvoiceModel = new InvoiceModel();
  public paymentModel: PaymentGatewayModel = new PaymentGatewayModel();
  public checkoutForm: FormGroup;
  public userModel: UserModel = new UserModel();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userRepository: UserService,
    private loaderService: LoaderServiceService,
    private orderRepository: OrdersService,
    private alert: PopUpsService,
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      additionalData: [''],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      createAccount: [false],
      password: ['']
    });

    setTimeout(() => {
      if (this.invoice.cliente != null) {
        this.checkoutForm.controls['fullName'].setValue(this.invoice.cliente?.fullName);
        this.checkoutForm.controls['email'].setValue(this.invoice.cliente?.email);
      }
    }, 200);
  }

  ngOnInit(): void {
    this.initScripts();
    this.invoice = JSON.parse(sessionStorage.getItem('invoice')!) as InvoiceModel;
    if (this.invoice == null) {
      this.router.navigate(['/checkout']);
    }
  }

  payButton() {

    if (this.checkoutForm.get('createAccount')?.value) {
      this.loaderService.display(true);
      this.userModel.uuid = uuidv4();
      this.userModel.fullName = this.checkoutForm.get('fullName')!.value;
      this.userModel.email = this.checkoutForm.get('email')!.value;
      this.userModel.password = this.checkoutForm.get('password')!.value;
      this.userModel.role = 'USER';
      this.userRepository.adduser(this.userModel).catch(()=>{
        this.loaderService.display(false);
        this.alert.showAlert('Error!', 'Error al registrar el usuario!', 'error');
      })
      sessionStorage.setItem('user', JSON.stringify(this.userModel))
      this.loaderService.display(false)
    }

    if (this.checkoutForm.valid) {

      if(this.invoice.cliente == null){
        this.invoice.cliente = new UserModel()
        this.invoice.cliente.fullName = this.checkoutForm.get('fullName')!.value;
        this.invoice.cliente.email = this.checkoutForm.get('email')!.value;
        sessionStorage.setItem('invoice', JSON.stringify(this.invoice))
      }

      this.loaderService.display(true);
      let order: PaymentGatewayModel = this.checkoutForm.value as PaymentGatewayModel;
      this.orderRepository.addorder(order).then(() => {
        this.router.navigate(['/credit-card']);
        this.loaderService.display(false);
      })
    } else {
      this.alert.showAlert('Error!', 'Formulario Invalido', "error");
      this.loaderService.display(false);
    }

  }

  initScripts(): void {
    MainJS.init();
  }

}

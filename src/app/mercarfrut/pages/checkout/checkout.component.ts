import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService} from "../../../common";

declare var MainJS: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  public shopCart: Map<string, number> = new Map<string, number>();
  public shopList: ProductModel[] = [];
  public subtotal: number = 0;
  public total: number = 0;
  public cont: number = Number(sessionStorage.getItem('itemsShopingCart')) | 0;

  constructor(
    private productRepository: ProductsRepositoryService,
    private loader: LoaderServiceService,
    private alert: PopUpsService,
  ) {
  }


  ngOnInit(): void {
    this.loader.display(true);
    // Inicializar shopCart después de recuperar los datos de sessionStorage
    const shopCartData = sessionStorage.getItem('shopCart');
    this.shopCart = shopCartData ? new Map(JSON.parse(shopCartData)) : new Map<string, number>();

    this.shopCart.forEach((v, k) => {
      this.productRepository.getProduct(k).then(r => {
        if (r != null) {
          this.shopList.push(r);
          this.loader.display(false);
        }
      })
    })

    this.initScripts();
  }

  updateCartItem(product: ProductModel, quantity: number): void {
    // Verificar si la cantidad es válida (mayor que cero y no excede el límite)
    if (quantity > 0 && quantity <= product.cantidad!) {
      // Actualizar la cantidad del producto en el carrito
      this.shopCart.set(product.uuid!, quantity);
    } else if (quantity <= 0) {
      // Si la cantidad es menor o igual a cero, eliminar el producto del carrito
      this.shopCart.delete(product.uuid!);
    } else {
      // La cantidad excede el límite, mostrar un mensaje de error o tomar otra acción
      this.alert.showAlert('Error', 'La cantidad excede el límite disponible. limite: '+product.cantidad, "error")
      // Aquí podrías mostrar un mensaje de error al usuario o tomar otra acción apropiada
      return; // Detener la ejecución de la función
    }

    // Actualizar el almacenamiento de sesión con el nuevo carrito
    sessionStorage.setItem('shopCart', JSON.stringify(Array.from(this.shopCart.entries())));

    // Llamar a la función updateTotal para recalcular el subtotal y el total
    this.updateTotal();
  }


  updateTotal(): void {
    this.subtotal = 0;
    this.shopList.forEach(product => {
      const quantity = this.shopCart.get(product.uuid!) || 1; // Obtener la cantidad del producto del carrito
      const itemTotal = product.precio! * quantity; // Calcular el total del producto multiplicando el precio por la cantidad
      this.subtotal += itemTotal; // Sumar al subtotal
    });
    sessionStorage.setItem('totalPrice', JSON.stringify(this.total));
    this.total = this.subtotal; // Establecer el total igual al subtotal inicialmente
  }

  removeItem(product: ProductModel): void {
console.log(product.uuid!)
    // Elimina el producto del carrito
    if (this.shopCart.has(product.uuid!)) {
      this.shopCart.delete(product.uuid!);
      sessionStorage.setItem('shopCart', JSON.stringify(Array.from(this.shopCart.entries())));
      sessionStorage.setItem('itemsShopingCart', String(this.cont-1));
    }

    // Encuentra y elimina el producto de la lista de productos
    const index = this.shopList.findIndex(item => item.uuid === product.uuid!);
    if (index !== -1) {
      this.shopList.splice(index, 1);
    }

    this.updateTotal(); // Actualiza el total después de eliminar el producto
  }


  initScripts() {
    MainJS.init();
  }

  protected readonly Number = Number;
}

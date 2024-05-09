import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  InvoiceModel,
  LoaderServiceService,
  PopUpsService, ProductInvoiceModel,
  ProductModel,
  ProductsRepositoryService, UserModel,
  VariableEmitterService
} from "../../../common";
import {v4 as uuidv4} from "uuid";
import {InvoiceService} from "../../../common/repository/invoice.service";
import {Router} from "@angular/router";

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
    private variableEmitterServie: VariableEmitterService,
    private invoiceRepository: InvoiceService,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    // Inicializar shopCart después de recuperar los datos de sessionStorage
    const shopCartData = sessionStorage.getItem('shopCart');
    this.shopCart = shopCartData ? new Map(JSON.parse(shopCartData)) : new Map<string, number>();

    if (this.shopCart.size > 0) {
      this.loader.display(true);
      this.shopCart.forEach((v, k) => {
        this.productRepository.getProduct(k).then(r => {
          if (r != null) {
            this.shopList.push(r);
            this.updateTotal();
            this.loader.display(false);
          }
        })
      })
    }

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
      this.alert.showAlert('Error', 'La cantidad excede el límite disponible. limite: ' + product.cantidad, "error")
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
    sessionStorage.setItem('totalPrice', JSON.stringify(this.subtotal));
    this.variableEmitterServie.updatetotalPrice(this.subtotal);
    this.total = this.subtotal; // Establecer el total igual al subtotal inicialmente
  }

  removeItem(product: ProductModel): void {
    this.cont--;
    // Elimina el producto del carrito
    if (this.shopCart.has(product.uuid!)) {
      this.shopCart.delete(product.uuid!);
      sessionStorage.setItem('shopCart', JSON.stringify(Array.from(this.shopCart.entries())));
    }

    // Encuentra y elimina el producto de la lista de productos
    const index = this.shopList.findIndex(item => item.uuid === product.uuid!);
    if (index !== -1) {
      this.shopList.splice(index, 1);
    }

    this.variableEmitterServie.updateItemsShopingCart(this.cont);
    sessionStorage.setItem('itemsShopingCart', String(this.cont));

    this.updateTotal(); // Actualiza el total después de eliminar el producto
  }

  getValue(product: ProductModel): number {
    let value = 1; // Valor predeterminado

    // Iterar sobre los elementos del mapa shopCart
    this.shopCart.forEach((quantity, productId) => {
      // Verificar si el ID del producto coincide con el ID del producto proporcionado
      if (productId === product.uuid) {
        // Asignar el valor de la cantidad del producto a la variable value
        value = quantity;
      }
    });

    return value; // Devolver el valor de la cantidad del producto
  }

  createInvoice(): void {
    this.loader.display(true);
    let factura: InvoiceModel = new InvoiceModel();
    factura.uuid = uuidv4();
    factura.cliente = JSON.parse(sessionStorage.getItem('user')!) as UserModel || null;
    factura.productos = [];
    factura.subtotal = this.subtotal;
    factura.total = this.total;

    let promises: Promise<void>[] = [];

    this.shopCart.forEach((v, k) => {
      const productPromise = this.productRepository.getProduct(k).then(r => {
        if (r && r.cantidad !== 0) {
          let producto: ProductInvoiceModel = new ProductInvoiceModel();
          producto.productName = r.nombre;
          producto.precio = (r.precio! * v);
          producto.cantidad = v;

          let obj = Object.assign({},producto);

          factura.productos!.push(obj);

          // Actualizar la cantidad del producto
          promises.push(
            this.productRepository.updateProductQuantity(k, r.cantidad! - v).catch(error => {
              this.alert.showAlert('Error', 'La cantidad excede el producto.', 'error');
            })
          );
        }
      });

      promises.push(productPromise);
    });

    Promise.all(promises).then(() => {
      sessionStorage.setItem('invoice', JSON.stringify(factura));
      this.invoiceRepository.addInvoice(factura).then(() => {
        this.loader.display(false);
        this.router.navigate(['/home/payment']);
      }).catch(error => {
        this.loader.display(false);
        console.error('Error al agregar la factura:', error);
      });
    });
  }

  initScripts() {
    MainJS.init();
  }

  protected readonly Number = Number;
}

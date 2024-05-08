import {Component} from '@angular/core';
import {LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService} from '../../../common';
import {map} from 'rxjs';

declare var MainJS: any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  public productsList: ProductModel[] = [];
  public cont: number = Number(sessionStorage.getItem('itemsShopingCart')) | 0;
  public shopCart: Map<string, number> = new Map<string, number>();

  constructor(
    private productsRepository: ProductsRepositoryService,
    private alert: PopUpsService,
    private loaderService: LoaderServiceService
  ) {
  }

  ngOnInit() {

    this.loaderService.display(true);

    // Inicializar shopCart después de recuperar los datos de sessionStorage
    const shopCartData = sessionStorage.getItem('shopCart');
    this.shopCart = shopCartData ? new Map(JSON.parse(shopCartData)) : new Map<string, number>();

    this.productsRepository.getAll().snapshotChanges().pipe(map(changes =>
      changes.map(c => ({
          id: c.payload.doc.id, ...c.payload.doc.data()
        })
      ))).subscribe(data => {
      this.productsList = data;
      this.loaderService.display(false);
    });

    this.initScripts()

  }

  addCart(product: ProductModel) {

    // Verificar si el producto ya está en el carrito
    if (this.shopCart.has(product.uuid!)) {
      this.alert.showAlert('Error!', 'El producto ya está en el carrito.', 'error');
    }

    // Agregar el producto al carrito con una cantidad inicial de 1
    if (!this.shopCart.has(product.uuid!)) {
      this.shopCart.set(product.uuid!, 1);
      // Incrementar el contador general
      this.cont++;

      // Guardar el carrito actualizado en sessionStorage
      sessionStorage.setItem('itemsShopingCart', String(this.cont));
      sessionStorage.setItem('shopCart', JSON.stringify(Array.from(this.shopCart.entries())));
      this.alert.showAlert('Exito!', 'El producto fue agregado al carrito.', 'success');
    }

  }

  initScripts() {
    MainJS.init();
  }

}

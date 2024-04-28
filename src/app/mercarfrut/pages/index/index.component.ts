import { Component } from '@angular/core';
import { LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService } from '../../../common';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(
    private productsRepository: ProductsRepositoryService,
    private alert:PopUpsService,
    private loaderService:LoaderServiceService
  ) { }

  test() {
    this.loaderService.display(true);

    const product: ProductModel = new ProductModel();
    product.uuid = '12345678-90ab-cdef-1234-567890abcdef',
    product.nombre = 'Camiseta Angular',
    product.precio = 29.99,
    product.descripcion = 'Una camiseta para los fanáticos de Angular',
    product.imagen = 'https://example.com/angular-t-shirt.jpg',
    product.cantidad = 10

    this.productsRepository.addProduct(product).then(() => {
      this.loaderService.display(false);
      this.alert.showAlert('¡Éxito!', 'La operación se realizó correctamente.', 'success');
    }).catch( () => {
      this.loaderService.display(false);
      this.alert.showAlert('Error!', 'Error en la operación.', 'error');
    });

  }

}

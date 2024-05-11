import {Component} from '@angular/core';
import {LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService} from "../../../common";
import {map} from "rxjs";

declare var MainJS: any;

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {

  public inventorylist: ProductModel[] = [];

  constructor(
    private loaderService: LoaderServiceService,
    private productRepository: ProductsRepositoryService,
    private alert: PopUpsService,
  ) {
  }

  ngOnInit(): void {
    this.fillInventory();
    this.initScripts();
  }

  fillInventory(): void {
    this.loaderService.display(true)
    this.productRepository.getAll().snapshotChanges().pipe(map(changes =>
      changes.map(c => ({
          id: c.payload.doc.id, ...c.payload.doc.data()
        })
      ))).subscribe(data => {
      this.inventorylist = data;
      this.loaderService.display(false);
    });
  }

  async deleteProduct(product: ProductModel) {

    const confirmed: boolean = await this.alert.showConfirmationDialog('Confirmar acción', '¿Estás seguro de eliminar el producto?');

    if (confirmed) {
      this.loaderService.display(true);
      try {
        await this.productRepository.deleteProductByUUID(product.uuid!);
        this.loaderService.display(false);
        await this.alert.showAlert('Exito!', "Producto eliminado exitosamente", "success");
      } catch (error) {
        this.loaderService.display(false);
        await this.alert.showAlert('Error!', "Error al intentar eliminar el producto:", 'error');
      }
    }

  }

  // Método para guardar el inventario en Firestore
  async saveInventory(): Promise<void> {
    const confirmed: boolean = await this.alert.showConfirmationDialog('Confirmar acción', '¿Estás seguro de actualizar los productos?');
    if (confirmed) {
      this.loaderService.display(true);
      this.productRepository.updateInventoryInBatch(this.inventorylist)
        .then(() => {
          this.alert.showAlert('Éxito!', 'Inventario actualizado exitosamente', 'success');
          this.loaderService.display(false);
        })
        .catch(error => {
          this.alert.showAlert('Error!', 'Error al actualizar el inventario', 'error');
          this.loaderService.display(false);
        });
    }
  }

  decreaseQuantity(product: ProductModel): void {
    if (product.cantidad! > 0) {
      product.cantidad!--; // Disminuir la cantidad del producto
    }
  }

  increaseQuantity(product: ProductModel): void {
    if (product.cantidad! > 0) {
      product.cantidad!++; // Aumentar la cantidad del producto
    }
  }

  updateQuantity(newValue: string, product: ProductModel): void {
    const newQuantity = parseInt(newValue); // Convertir el valor a entero
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      product.cantidad = newQuantity; // Actualizar la cantidad del producto en la lista
    }
  }

  updatePrice(newValuePrice: string, product: ProductModel): void {
    const newQuantity = parseInt(newValuePrice); // Convertir el valor a entero
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      product.precio = newQuantity; // Actualizar el precio del producto en la lista
    }
  }

  initScripts() {
    MainJS.init();
  }

}

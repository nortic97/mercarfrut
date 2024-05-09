import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageItem, LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService } from '../../../common';
import {v4 as uuidv4} from 'uuid';

declare var MainJS: any;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  productForm: FormGroup = this.formBuilder.group({
    nombre: [null, Validators.required],
    precio: [null, [Validators.required, Validators.min(0)]],
    descripcion: [''],
    imagen: ['assets/img/product/product-1.jpg'],
    cantidad: [null, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderServiceService,
    private alerts: PopUpsService,
    private productRepository: ProductsRepositoryService
  ) { }

  images: ImageItem[] = [
    { name: 'Carne', path: 'assets/img/product/product-1.jpg' },
    { name: 'Bananas', path: 'assets/img/product/product-2.jpg' },
    { name: 'Guayaba', path: 'assets/img/product/product-3.jpg' },
    { name: 'Uvas', path: 'assets/img/product/product-4.jpg' },
    { name: 'Hamburguesa', path: 'assets/img/product/product-5.jpg' },
    { name: 'Mango', path: 'assets/img/product/product-6.jpg' },
    { name: 'Sandia', path: 'assets/img/product/product-7.jpg' },
    { name: 'Manzana', path: 'assets/img/product/product-8.jpg' },
    { name: 'Uvas Pasas', path: 'assets/img/product/product-9.jpg' },
    { name: 'Pollo Broaster', path: 'assets/img/product/product-10.jpg' },
    { name: 'Zumo de Naranja', path: 'assets/img/product/product-11.jpg' },
    { name: 'Frutas Varias', path: 'assets/img/product/product-12.jpg' },
  ];

  ngOnInit(): void {
    this.initScripts()
  }

  onSubmit() {
    this.loaderService.display(true)
    if (this.productForm.valid) {
      const formData = this.productForm.value as ProductModel;
      formData.uuid = uuidv4();
      this.productRepository.addProduct(formData)
      this.loaderService.display(false)
      this.productForm.reset();
      this.alerts.showAlert("¡Éxito!", "Se ha completado la operación con éxito.", "success")
    } else {
      this.loaderService.display(false)
      this.alerts.showAlert("Error!", "El formulario es invalido.", "error")
    }
  }

  initScripts():void{
    MainJS.init()
  }

  onImageSelected(event: any) {
    const selectedImagePath = event.target.value;
    this.productForm.get('imagen')?.setValue(selectedImagePath);
  }
}

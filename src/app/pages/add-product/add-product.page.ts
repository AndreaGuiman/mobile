import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  inputName: '';
  inputDescription: '';
  inputPrice = '';
  inputStock: '';
  category: string;

  categories: string[] = [];
  viewSearchbar = false;

  product: Product;

  croppedImagepath = '';
  isLoading = false;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(private camera: Camera, public actionSheetController: ActionSheetController, private toastController: ToastController,
    private productService: ProductService, private location: Location, private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  goBack(): void{
    this.location.back();
  }

  searchCategories($event): void {
    this.viewSearchbar = true;
    const searchValue = $event.target.value;
    if(searchValue !== ''){
      this.getCategoriesByName(searchValue);
      return;
    }
    this.categories = [];
    this.viewSearchbar = false;
  }

  getCategoriesByName(searchValue: string): void {
    this.categoryService.getAllNamesBySearch(searchValue)
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  selectCategory(category: string){
    this.category = category;
    this.viewSearchbar = false;
  }

  async selectImage(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selectați imaginea',
      buttons: [{
        text: 'Încarcă poza din galerie',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Folosește Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  addProduct(): void {
    if(
      // this.checkField(this.croppedImagepath) ||
      this.checkField(this.inputName) || this.checkField(this.inputDescription) ||
      this.checkField(this.inputPrice) || this.checkField(this.inputStock) ||
      this.checkField(this.category) || this.category === undefined){
      this.showToast(
        1000,
        'Completati toate campurile',
        'toastUnsuccessful'
      );
      return;
    }

    if(!(this.onlyNumbersAndPoints(this.inputPrice))){
      this.showToast(
        1000,
        'Pretul trebuie să conțină doar cifre',
        'toastUnsuccessful'
      );
      return;
    }

    if(!(this.onlyNumbers(this.inputStock))){
      this.showToast(
        1000,
        'Stocul trebuie să conțină doar cifre',
        'toastUnsuccessful'
      );
      return;
    }
    setTimeout(() => {
      this.product = {
        productImage: this.croppedImagepath,
        name: this.inputName,
        description: this.inputDescription,
        price: parseInt((this.inputPrice), 10),
        stock: parseInt((this.inputStock), 10),
        categoryName: this.category
      };
      this.productService.save(this.product)
        .subscribe(product => {
          if(product){
            this.showToast(
            2500,
              `Noul produs ${product.name} a fost salvat cu succes`,
              'toastSuccessful'
            );
          }
          setTimeout(() => {
            this.location.back();
          }, 250);
        });
    }, 100);
  }

  private checkField(input: string): boolean {
    return input === '';
  }

  private pickImage(sourceType): void {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options)
      .then((imageData) => {
      this.croppedImagepath = 'data:image/jpeg;base64,' + imageData;
      });
  }

  private async showToast(duration: number, message: string, cssClass: string): Promise<void> {
    const toast = await this.toastController.create({
      duration,
      message,
      cssClass,
      animated: true,
      position: 'top',
    });
    await toast.present();
  }

  private onlyNumbers(input: string): boolean {
    return /^[0-9]+$/.test(input);
  }

  private onlyNumbersAndPoints(input: string): boolean {
    return /^[0-9.,]+$/.test(input);
  }
}

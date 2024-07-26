import { CommonModule, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MainServicesService } from '../../../services/main-services.service';
import { Extension } from '../../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-related-carousel',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './related-carousel.component.html',
  styleUrl: './related-carousel.component.scss'
})
export class RelatedCarouselComponent {
  showAll:boolean = false;
  @Input() productList:any = []
  images = [
    'assets/images/map.png',
    'assets/images/email-img.png',
    'assets/images/map.png',
    'assets/images/email-img.png',
    'assets/images/map.png',
    'assets/images/email-img.png'
  ];
  
  addWishLst(item:any){
    this.loading = true;
    let input = {
      user_id:this.currentUserId,
      product_id:item.id
    }
    this.mainServices.addWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      this.loading = false;
    })
  } 
  removeWishLst(item:any){
    this.loading = true;
    let input = {
      id:item.id
    }
    this.mainServices.removeWishList(input).subscribe((res:any) =>{
      this.showSuccessMessage(res.message)
      res
      this.showSuccessMessage(res.message)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      this.loading = false;
    },(err:any) =>{
      this.showSuccessMessage(err)
      this.loading = false;
    })
  }
  showSuccessMessage(message:string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
  ngOnInit(){
    if (this.currentUserId>0) {
      this.items = this.productList
      console.log('reladed ads', this.items)
      this.getFeatcherdProduct();
      this.getAuctionProduct();
      // this.firstRowItems = this.firstRowItems
    }
  }
  getAuctionProduct(){
    this.loading = true;
    
    this.mainServices.getAuctionProduct().subscribe(res =>{
      
      this.auctionProduct = res.data
      console.log(this.auctionProduct)
      this.loading = false;
    })
  }
  getFeatcherdProduct() {
    this.loading = true;
    this.mainServices.getFeatureProduct().subscribe(res =>{
      this.featuredProducts = res.data
      console.log(this.featuredProducts)
      this.loading = false;
    },
    (error) => {
      if (error.status === 401) {
        this.loading = false;
        // console.error('Unauthorized access. Redirecting to login...');
      } else {
        this.loading = false;
        // console.error('Error fetching feature product:', error);
      }
    })
  }
  loading = false;
  currentUserId : number = 0;
  constructor(
    private mainServices: MainServicesService,
    private extension: Extension,
    private snackBar: MatSnackBar
  ) {
    this.currentUserId = this.extension.getUserId()
   }
  isVehicle(item: any): boolean {
    
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.category_id === 'Vehicles';
    }
    return attributesObject.category_name === 'Vehicles';
  }
  isProperty(item: any): boolean {
    
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.category_id === 'Property for Sale';
    }
    return attributesObject.category_name === 'Property for Sale';
  }
  Km(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.mileage;
    }
    return attributesObject.mileage ;
  }
  petrol(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.fuelType;
    }
    return attributesObject.fuelType ;
  }
  bed(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.bedrooms;
    }
    return attributesObject.bedrooms ;
  }
  bath(item:any){
    const attributesObject = JSON.parse(item.attributes);
    if ('attributes' in attributesObject) {
      const parsedAttributes = JSON.parse(attributesObject.attributes);
      return parsedAttributes.bedrooms;
    }
    return attributesObject.bedrooms ;
  }
  currentIndex = 0;
  visibleImages: string[] = [];
  featuredProducts: any[] = [
    // { id: 1, price: "$2,94,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 2, price: "$3,00,000", title: "Tourch Light", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 3, price: "$4,000", title: "Test Cards etc", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 4, price: "$2,94,000", title: "Best Products", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 5, price: "$9,000", title: "Working ON It", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 6, price: "$84,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 7, price: "$24,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 8, price: "$29,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 9, price: "$20,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 10, price: "$2,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 11, price: "$8,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 12, price: "$10,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
  ];
  auctionProduct: any[] = [
    // { id: 1, price: "$2,94,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 2, price: "$3,00,000", title: "Tourch Light", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 3, price: "$4,000", title: "Test Cards etc", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 4, price: "$2,94,000", title: "Best Products", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 5, price: "$9,000", title: "Working ON It", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 6, price: "$84,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 7, price: "$24,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 8, price: "$29,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 9, price: "$20,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 10, price: "$2,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
    // { id: 11, price: "$8,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "car-img.png" },
    // { id: 12, price: "$10,000", title: "HYUNDAI GRAND | 10 1.3 CRDI", year: "2024", km: "2452Km", petrol: "Petrol", location: "2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName: "house-img.png" },
  ]
  getDisplayedItems() {
    return this.showAll ? this.auctionProduct : this.auctionProduct.slice(0, 8);
  }
  getVisibleItems() {
    let endIndex = this.currentIndex + 4;
    if (endIndex > this.items.length) {
      endIndex = this.items.length;
    }
    return this.items.slice(this.currentIndex, endIndex);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.items.length - 4;
    }
  }

  nextImage() {
    if (this.currentIndex < this.items.length - 4) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  items:any
  // = [
  //   // {id:1, price:"$2,94,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:2, price:"$3,00,000", title:"Tourch Light", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  //   // {id:3, price:"$4,000", title:"Test Cards etc", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:4, price:"$2,94,000", title:"Best Products", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  //   // {id:5, price:"$9,000", title:"Working ON It", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:6, price:"$84,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  //   // {id:7, price:"$24,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:8, price:"$29,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  //   // {id:9, price:"$20,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:10, price:"$2,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  //   // {id:11, price:"$8,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"car-img.png"},
  //   // {id:12, price:"$10,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. Santa Ana, Illinois 85486", imageName:"house-img.png"},
  // ]

}

import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../services/main-services.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Extension } from '../../helper/common/extension/extension';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-views',
  standalone: true,
  templateUrl: './product-views.component.html',
  styleUrl: './product-views.component.scss',
  imports: [HeaderComponent, NgIf, NgFor, CommonModule, FormsModule]
})

export class ProductViewsComponent {
  @Input() progress: number = 30;
  loading = false
  subCatContent:any = [];
  min_price:string = ""
  max_price:string = ""
  categorieId:string = ""

  trackById(index: number, item: any): number {
    return item.id;
  }
  sellerType:any = [
    {id:'Verified Seller'},
    {id:'Urgents'}
  ]
  conditions:any = [
    {id:'Any'},
    {id:'New'},
    {id:'Used'}
  ]
  locationRadius = [
    { title: 'LOCATION RADIUS', subTitle: '32 miles' },
  ];
  prices = [
    { title: 'PRICES'},
  ];

  activeLocationIndex: number | null = 0;
  activeRadiusIndex: number | null = 0;
  activePriceIndex: number | null = 0;

  toggleRadiusAccordion(index: number): void {
    this.activeRadiusIndex = this.activeRadiusIndex === index ? null : index;
  }

  togglePriceAccordion(index: number): void {
    this.activeRadiusIndex = this.activeRadiusIndex === index ? null : index;
  }

  isLocationActive(index: number): boolean {
    return this.activeLocationIndex === index;
  }

  isRadiusActive(index: number): boolean {
    return this.activeRadiusIndex === index;
  }
  show: boolean = false
  activeButton: number = 1;

  openfilter(){
    this.show = !this.show
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
  getProductCondition(condition:any){
    
    // this.is_urgert = condition
    if(condition == "Any"){
      this.sort_by =""
    }
    else if(condition == "New"){
      this.sort_by = "newest on top"
    }
    else if(condition == "Used"){
      this.sort_by = "newest on bottom"
    }
    this.getAllProducts()
  }
  search:string = ""
  sub_category_id:any
  limit:string = ""
  locationId:string = ""
  sort_by:string = ""
  is_urgert:string = ""
  auction: any []= []
  feature: any []= []
  currentUserId : number = 0;
  showSuccessMessage(message:string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
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
  getAllProducts() {
    
    this.loading = true
    
    let formData = new FormData();
    let input = {
      search: this.search,
      category_id: this.categorieId,
      sub_category_id: this.sub_category_id,
      limit: this.limit,
      location: this.locationId,
      sort_by: this.sort_by,
      is_urgert: this.is_urgert,
      min_price: this.min_price,
      max_price: this.max_price
    }
    this.mainServices.getAllProducts(input).subscribe((res: any) => {
      
      this.categories = res.data
      console.log('Categories', this.categories)
      if (this.categories.length > 0) {
        this.featuredProducts = []
        this.auctionProduct = []
        this.categories.forEach(category => {
          

          if (category.fix_price !== null) {
            this.featuredProducts.push(category);
          }
          else if (category.auction_price !== null) {
            this.auctionProduct.push(category);
          }
          else {
            this.featuredProducts = []
            this.auctionProduct = []
          }
          this.loading = false
        });
      }
      else {
        this.loading = false
        this.featuredProducts = []
        this.auctionProduct = []
      }
    })
  }
  categories: any[] = [
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

  featuredProducts:any[] = [
    // {id:1, price:"$2,94,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertySale.png"},
    // {id:2, price:"$3,00,000", title:"Tourch Light", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertySale.png"},
    // {id:3, price:"$4,000", title:"Test Cards etc", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"vahicel.png"},
    // {id:4, price:"$2,94,000", title:"Best Products", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"bike.png"},
    // {id:5, price:"$9,000", title:"Working ON It", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertyRent.png"},
    // {id:6, price:"$84,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"electronics.png"},
    // {id:7, price:"$24,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"service.png"},
    // {id:8, price:"$29,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"jobs.png"},
    // {id:9, price:"$20,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"animals.png"},
    // {id:10, price:"$2,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"furniture.png"},
    // {id:11, price:"$8,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"fashion.png"},
    // {id:12, price:"$10,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"kids.png"},
  ];
  auctionProduct:any[] = [
    // {id:1, price:"$2,94,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertySale.png"},
    // {id:2, price:"$3,00,000", title:"Tourch Light", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertySale.png"},
    // {id:3, price:"$4,000", title:"Test Cards etc", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"vahicel.png"},
    // {id:4, price:"$2,94,000", title:"Best Products", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"bike.png"},
    // {id:5, price:"$9,000", title:"Working ON It", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"propertyRent.png"},
    // {id:6, price:"$84,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"electronics.png"},
    // {id:7, price:"$24,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"service.png"},
    // {id:8, price:"$29,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"jobs.png"},
    // {id:9, price:"$20,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"animals.png"},
    // {id:10, price:"$2,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"furniture.png"},
    // {id:11, price:"$8,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"fashion.png"},
    // {id:12, price:"$10,000", title:"HYUNDAI GRAND | 10 1.3 CRDI", year:"2024", km:"2452Km", petrol:"Petrol", location:"2972 Westheimer Rd. San", imageName:"kids.png"},
  ]
  productType:string="";
constructor(
  private route: ActivatedRoute,
  private mainService: MainServicesService ,
  private mainServices: MainServicesService,
  private extension: Extension,
    private snackBar: MatSnackBar

){}
  ngOnInit(){
    
    this.productType = this.route.snapshot.paramMap.get('id')!;
    if (this.productType =="a") {
      
      this.getAllProducts() 
    }
    else{
      this.getAllProducts()
    }
    // console.log(this.productType)
  }
  getFeatcherdProduct() {
    this.loading = true;
    this.mainService.getFeatureProduct().subscribe(res =>{
      this.featuredProducts = res.data
      console.log(this.featuredProducts)
      this.loading = false;
    },
    (error:any) => {
      if (error.status === 401) {
        this.loading = false;
        // console.error('Unauthorized access. Redirecting to login...');
      } else {
        this.loading = false;
        // console.error('Error fetching feature product:', error);
      }
    })
  }
  getAuctionProduct(){
    this.loading = true;
    
    this.mainService.getAuctionProduct().subscribe(res =>{
      
      this.auctionProduct = res.data
      this.auctionProduct = this.auctionProduct.map((item) => {
        let remainingDays = null;
        if (item.starting_date && item.ending_date) {
          const startDate = new Date(item.starting_date);
          const endDate = new Date(item.ending_date);
          const timeDiff = endDate.getDate() - startDate.getDate();
          // remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
          remainingDays = timeDiff
        }
        return {
          ...item,
          remainingDays: remainingDays
        };
      });
      console.log(this.auctionProduct)
      this.loading = false;
    })
  }
}

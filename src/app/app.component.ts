import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './services/app.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { NgFor } from '@angular/common';
import { map } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductCardComponent, FilterComponent, NgFor, InfiniteScrollDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'product-catalog';
  productList: Array<any> = [] ;
  filteredProductList: Array<any> = [];
  displayProductList: Array<any> = [];
  scrollCount:number = 1;
  maxPrice:number = 0;
  isFilterActive = false;
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.getProductList().pipe(
      map((products)=> products.map((product:any) =>{
        product.rating = product.rating / 2;
        return product
      }))
    ).subscribe((res)=>{
      this.productList = res;
      this.displayProductList = res.slice(0, 20);
      this.maxPrice = this.appService.getMaxPrice(res);
    })
  }

  onScroll() {
    const startIndex = this.scrollCount * 20;
    const endIndex = startIndex + 20;
    if(!this.isFilterActive){
      this.displayProductList = [...this.displayProductList, ...this.productList.slice(startIndex, endIndex)];
    } else if(this.isFilterActive) {
      this.displayProductList = [...this.displayProductList, ...this.filteredProductList.slice(startIndex, endIndex)];
    }
    
    this.scrollCount++;
  }

  onClearFilter() {
    this.isFilterActive = false;
    this.displayProductList = JSON.parse(JSON.stringify(this.productList.slice(0, 20)));
  }

  onfilterChange(event:any) {
    this.isFilterActive = true;
    console.log("filter change", event);
      this.filteredProductList = this.productList.filter((product)=>{
        // filter by product name
        if(event.productName !== '') {
          return product.productName.toLowerCase().indexOf(event.productName.toLowerCase()) !== -1;
        } else {
          return product;
        }
      }).filter((product)=>{
        // filter by price
        if(Number(event.price) !== 0) {
          return Number(product.price) <= Number(event.price); 
        }else{
          return product
        }
      }).filter((product)=>{
        // filter by rating
        if(event.rating !== 0) {
          return Number(product.rating) >= event.rating; 
        }else{
          return product
        }
      });;
      
      console.log("filtered list", this.filteredProductList);
      this.displayProductList = this.filteredProductList.slice(0,20);
    
  }
}

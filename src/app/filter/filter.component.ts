import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { RatingModule } from 'ngx-bootstrap/rating';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgxBootstrapSliderModule, RatingModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit, AfterViewInit {
  @Input() maxPrice = 0;
  @Output() filterChange = new EventEmitter();
  @Output() onClear = new EventEmitter();

  price: any = 0;
  priceChanged = new Subject<string>();
  rating:number = 0;
  productName:string = '';
  productNameChanged = new Subject<any>();

  ngOnInit(): void {

    // debounce for price change
    this.priceChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value:any)=>{
      this.emitFilterChange();
    })

    // debounce for product name change
    this.productNameChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value:any)=>{
      this.emitFilterChange();
    });

  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.price = this.maxPrice;
    }, 500);
  }

  emitFilterChange() {
    this.filterChange.emit({
      price: this.price,
      productName: this.productName,
      rating: this.rating
    })
  }

  toggleSidebar() {
    const sidebar = document.getElementsByClassName('product-filter')[0];
    sidebar?.classList.toggle('collapsed');
  }

  ratingChange() {
    console.log("changed rating");
    this.emitFilterChange();
  }

  onClearClick() {
    // re-initializing veriables
    this.price = this.maxPrice;
    this.productName = '';
    this.rating = 0;
    // emit onclear
    this.onClear.emit();
  }
}

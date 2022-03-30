import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {HomeService} from "./service/home-service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  priceInput?: number;

  success = false;

  subscription: Subscription[] = [];

  form = this.fb.group({
    name: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required)
  });

  constructor(private fb: FormBuilder, private service: HomeService) { }

  ngOnInit(): void {
  }

  successReceiver(event: boolean) {
    this.success = event;
  }

  buscarProduto(): void {
    this.success = true;
    if(this.form.get('name')?.value != null && this.form.get('price')?.value != null){
      const priceString = this.form.get('price')?.value;
      if(priceString.includes(',')) {
        let price = priceString.replace(',', '.');
        this.subscription.push(
          this.service.buscarProduto(this.form.get('name')?.value, price).subscribe(() => {
            this.success = false;
          }));
        this.form.reset();
       } else {
        this.subscription.push(
          this.service.buscarProduto(this.form.get('name')?.value, this.form.get('price')?.value).subscribe(() => {
            this.success = false;
          }));
        this.form.reset();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

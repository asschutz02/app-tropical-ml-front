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

  loading = false;
  success = false;
  error = false;

  subscription: Subscription[] = [];

  form = this.fb.group({
    name: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required)
  });

  constructor(private fb: FormBuilder, private service: HomeService) { }

  ngOnInit(): void {
  }

  loadingReceiver(event: boolean) {
    this.loading = event;
  }

  successReceiver(event: boolean) {
    this.success = event;
  }

  errorReceiver(event: boolean){
    this.error = event;
  }

  buscarProduto(): void {
    this.loading = true;
    if(this.form.get('name')?.value != null && this.form.get('price')?.value != null){
      const priceString = this.form.get('price')?.value;
      if(priceString.includes(',')) {
        let price = priceString.replace(',', '.');
        this.subscription.push(
          this.service.buscarProduto(this.form.get('name')?.value, price).subscribe(() => {
            this.success = true;
            this.loading = false;
          },
            error => {
                console.log(error);
                this.loading = false;
                this.error = true;
          }));
        this.form.reset();
       } else {
        this.subscription.push(
          this.service.buscarProduto(this.form.get('name')?.value, this.form.get('price')?.value).subscribe(() => {
            this.success = true;
            this.loading = false;
          },
            error => {
              console.log(error);
              this.loading = false;
              this.error = true;
          }));
        this.form.reset();
      }
    }
  }

  closeSuccess(): void {
    this.success = false;
  }

  closeError(): void {
    this.error = false;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }
}

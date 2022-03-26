import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form = this.fb.group({
    search: new FormControl({value: null, disabled: false}, Validators.required)
  });

  click(){
    console.log('fui clicado');
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  buscarProduto(): void {

  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public form: FormGroup;

  public totalCommission = '';
  public totalEarnings = '';

  public results = [];

  public showResult = false;


  constructor(private formBuilder: FormBuilder, 
    private loadingController: LoadingController) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      capital: ['', [
        Validators.required, 
        Validators.pattern('^[0-9,.]*$')]],
      percentage: ['', [
        Validators.required, 
        Validators.max(100),
        Validators.pattern('^[0-9.%]*$')]],
      noOfDays: ['', Validators.required]
    });
  }

  submit() {
    if(this.form.valid) {
      this.showResult = false;
      this.presentLoading();

      setTimeout(() => {
        this.showResult = true;
        let capital = Number(this.form.get('capital').value.replace(',', ''));
        const percentage = Number(this.form.get('percentage').value.replace('%', '')) / 100;
        const noOfDays = Number(this.form.get('noOfDays').value);
    
        let totalCommission = 0;
        this.results = [];
        for(let i = 0; i < noOfDays; i++){
          let interest = capital * percentage;
          totalCommission += interest;
          capital += interest;
    
          this.results.push({
            commissionPerDay: this.formatNumber(totalCommission.toFixed(2)),
            earningsPerDay: this.formatNumber(capital.toFixed(2))
          });
        }
    
        this.totalCommission =this.formatNumber(totalCommission.toFixed(2));
        this.totalEarnings = this.formatNumber(capital.toFixed(2));
      }, 1100);
      
    } else {
      this.validateAllFormFields(this.form);
    }
    
  }

  capitalOnChange(){
    const formCapital = this.form.get('capital');
    if(formCapital.valid) {
      const capital = formCapital.value;
      this.form.get('capital').setValue(this.formatNumber(capital));
    }
  }

  percentageOnChange() {
    const formPercent = this.form.get('percentage');
    if(formPercent.valid){
      const percentage = formPercent.value;
      this.form.get('percentage').setValue(percentage + '%');
    }
   
  }

  formatNumber(value){
    return new Intl.NumberFormat().format(value);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-loading-class',
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onClick(field){
    this.form.get(field).reset();
  }

  clear(){
    this.presentLoading();

    setTimeout(() => {
      this.form.reset();
      this.results = [];
      this.totalCommission = '';
      this.totalEarnings = '';
      this.showResult = false;
    }, 1100);
    
  }

}

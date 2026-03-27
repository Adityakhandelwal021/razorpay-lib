import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RazorpayService } from './razorpay.service';
import { RazorpayConfig } from './razorpay.model';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: []
})
export class RazorpayLibModule {
  static forRoot(config: RazorpayConfig): ModuleWithProviders<RazorpayLibModule> {
    return {
      ngModule: RazorpayLibModule,
      providers: [
        RazorpayService,
        {
          provide: 'RAZORPAY_CONFIG',
          useValue: config
        }
      ]
    };
  }
}

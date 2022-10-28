import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emp-payment',
  templateUrl: './emp-payment.component.html',
  styleUrls: ['./emp-payment.component.css']
})
export class EmpPaymentComponent implements OnInit {

  paymentHandler:any = null;

  constructor() { }

  ngOnInit() {
    this.invokeStripe();
  }
  
  makePayment(amount) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51IpqHKCZukn0bVL0uItqYTpMQy7n5nNcvvO6IA0crKVBvw6o6R832B2UcBjAvXat6sgCwgnLbrq3O8SVamnIAYzL00ugYbjf5v',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });
  
    paymentHandler.open({
      name: 'Monetic Application',
      description: 'Confirm Payment',
      amount: amount * 100
    });
  }
  
  invokeStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51H7bbSE2RcKvfXD4DZhu',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken)
            alert('Payment has been successfull!');
          }
        });
      }
        
      window.document.body.appendChild(script);
    }
  }
  
}

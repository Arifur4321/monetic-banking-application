import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'; 

declare var $: any;
@Component({
  selector: 'app-cpy-submenu',
  templateUrl: './cpy-submenu.component.html',
  styleUrls: ['./cpy-submenu.component.css']
})
export class CpySubmenuComponent implements OnInit {

  fontconto=  'font-family: Helvetica,sans-serif;' ;
  fontmovimenti = 'font-family: Helvetica,sans-serif;'  ;
  fontcarte = 'font-family: Helvetica,sans-serif;'  ;
  fontbonifici = 'font-family: Helvetica,sans-serif;' ;
  fontrichieste = 'font-family: Helvetica,sans-serif;'  ;
  fontaltro = 'font-family: Helvetica,sans-serif;'  ;

  /* for conto */
  toggle = true;
  status = "Conto";

  /* for movimenti */
  togglem = true;
  statusm = "Movimenti";

  /* for carte */
  togglec = true;
  statusc = "Carte";

    /* for bonifici */
    toggleb = true;
    statusb = "Bonifici";

    /* for Richieste */ 
    toggler = true;
    statusr = "Richieste";

    /* for altro */

 toggleal = true;
    statusal = "Altro";

 
    isNotModified: boolean = false;


  constructor(public router:Router) { }

  ngOnInit(): void {
  
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });

  }

  activeState = 'Draft';

  setStateAsActive(state) {
    this.activeState = state;
  }

    

  enableDisableRuleconto() {    

 
    document.getElementById("contobutton").style.fontWeight = '' ; 
    document.getElementById("contobutton").style.color = "#000000" ;
   setTimeout(() => {
   this.disablewithoutconto();
   }, 1000);
   
  }

  disablewithoutconto(){
    document.getElementById("movimentimenu").style.color = "gray" ;
    document.getElementById("cartebutton").style.color = "gray" ;
    document.getElementById("bonificibutton").style.color = "gray" ;
  }

  enableDisableRulemovimenti() {    
    document.getElementById("movimentimenu").style.fontFamily = "GraphikRegular" ;
    document.getElementById("movimentimenu").style.color = "black" ;
    setTimeout(() => {
      this.disablewithoutmovimenti();
      
     }, 1000);

  }

  disablewithoutmovimenti(){
    document.getElementById("contobutton").style.color = "gray" ;
    document.getElementById("cartebutton").style.color = "gray" ;
    document.getElementById("bonificibutton").style.color = "gray" ;
  }

  enableDisableRulecarte() {    
    document.getElementById("cartebutton").style.fontFamily = "GraphikRegular" ;
    document.getElementById("cartebutton").style.color = "black" ;
    
    setTimeout(() => {
      this.disablewithoutcarte();
      
     }, 1000);
  }

  disablewithoutcarte(){
    document.getElementById("contobutton").style.color = "gray" ;
    document.getElementById("movimentimenu").style.color = "gray" ;
    document.getElementById("bonificibutton").style.color = "gray" ;

  }
  enableDisableRulebonifici() {    
    document.getElementById("bonificibutton").style.fontFamily = "GraphikRegular" ;
    document.getElementById("bonificibutton").style.color = "black" ;
    setTimeout(() => {
      this.disablewithoutbonifici();
      
     }, 1000);

  }

  disablewithoutbonifici(){
    document.getElementById("contobutton").style.color = "gray" ;
    document.getElementById("movimentimenu").style.color = "gray" ;
    document.getElementById("cartebutton").style.color = "gray" ;
  }


  /*  for movimenti */
  enableDisableRulem() {
    this.togglem= !this.togglem;
    this.statusm = this.togglem ? "Movimenti" : "Movimenti";
  }

  enableDisableRulec() {
    this.togglec = !this.togglec;
    this.statusc = this.togglec ? "Carte" : "Carte";
  }

  enableDisableRuleb() {
    this.toggleb = !this.toggleb;
    this.statusb = this.toggleb ? "Bonifici" : "Bonifici";
  }

  enableDisableRuler() {
    this.toggler = !this.toggler;
    this.statusr = this.toggler ? "Richieste" : "Richieste";
  }

  enableDisableRuleal() {
    this.toggleal = !this.toggleal;
    this.statusal = this.toggleal ? "Altro" : "Altro";
  }
  
  

   toogleconto(){

    this.fontconto = this.fontconto ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontcarte =  'Helvetica,sans-serif'  ;
    this.fontbonifici = 'Helvetica,sans-serif'  ;
    this.fontmovimenti = 'Helvetica,sans-serif'  ;
    this.fontaltro ='Helvetica,sans-serif'  ;
    this.fontrichieste = 'Helvetica,sans-serif'  ;
  }
  
  tooglemovimenti(){
    
    this.fontmovimenti = this.fontmovimenti ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontcarte =  'Helvetica,sans-serif'  ;
    this.fontbonifici = 'Helvetica,sans-serif'  ;
    this.fontrichieste = 'Helvetica,sans-serif'  ;
    this.fontaltro ='Helvetica,sans-serif'  ;
    this.fontconto = 'Helvetica,sans-serif'  ;
  }

   tooglecarte(){
    this.fontcarte = this.fontcarte ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontconto =  'Helvetica,sans-serif'  ;
    this.fontbonifici = 'Helvetica,sans-serif'  ;
    this.fontmovimenti = 'Helvetica,sans-serif'  ;
    this.fontaltro ='Helvetica,sans-serif'  ;
    this.fontrichieste= 'Helvetica,sans-serif'  ;
   }
   tooglebonifici(){
    this.fontbonifici = this.fontbonifici ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontcarte =  'Helvetica,sans-serif'  ;
    this.fontconto = 'Helvetica,sans-serif'  ;
    this.fontmovimenti = 'Helvetica,sans-serif'  ;
    this.fontaltro ='Helvetica,sans-serif'  ;
    this.fontrichieste ='Helvetica,sans-serif'  ;
  }
  tooglerichieste(){
    this.fontrichieste = this.fontrichieste ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontcarte =  'Helvetica,sans-serif'  ;
    this.fontbonifici = 'Helvetica,sans-serif'  ;
    this.fontmovimenti = 'Helvetica,sans-serif'  ;
    this.fontaltro ='Helvetica,sans-serif'  ;
    this.fontconto = 'Helvetica,sans-serif'  ;
 
  }
  tooglealtro(){

    this.fontaltro = this.fontaltro ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif';
    this.fontcarte =  'Helvetica,sans-serif'  ;
    this.fontbonifici = 'Helvetica,sans-serif'  ;
    this.fontmovimenti = 'Helvetica,sans-serif'  ;
    this.fontrichieste ='Helvetica,sans-serif'  ;
    this.fontconto = 'Helvetica,sans-serif'  ;
  }



   
 


}

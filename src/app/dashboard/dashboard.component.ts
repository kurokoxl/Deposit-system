import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IncomeComponent } from '../income/income.component';
import { SharedService } from '../shared.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription, of, switchMap, tap } from 'rxjs';
import {  GoalsComponent } from '../goals/goals.component';
import { NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

export interface Goal {
  name: string;
  description: string;
  targetAmount: number;
}
interface IncomeItem {
  amount: number;
  category: string;
  name: string;
}
interface ExpenseItem {
  name: string;
  category: string;
  price: number; // Make sure price is defined with the correct type
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]


})
export class DashboardComponent implements OnInit {
  userId: string | null = null;
  userIdSubscription: Subscription | undefined;
  goals: Goal[] = [];

  showDialog: boolean = false;
  ahly_user: boolean = true;

  expenseChartData: any;
  currentBalance: any;
  constructor(private http: HttpClient,private sharedservice:SharedService,private afAuth: AngularFireAuth,private messageService: MessageService) { }
  balance: number | undefined;

  ngOnInit(): void {
    
    this.userIdSubscription = this.afAuth.authState.subscribe(user => {
      if (user) {
       this. getBalance()

      }
    });
  }
  getBalance() {
    const url = 'https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/Balance.json';

    this.http.get<number>(url).subscribe(
      (data: number) => {
        this.balance = data;
        console.log('Balance:', this.balance);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  AddBalance(form:NgForm){
    if(form.invalid){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Form' });

      return

    }
    else if(form.value.balanceChange==="incremental")
      this.balance= this.balance+form.value.balance;
    else if(form.value.balanceChange==="decremental"){
     if(this.balance!=null&&this.balance>form.value.balance)
      this.balance-=form.value.balance
    else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Insuffisant Balance' });
    }
  }
  this.http.put("https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/Balance.json",this.balance).subscribe(res=>{
  })

this.showDialog=false;
form.reset()
  }
  showDialogForm() {
    this.afAuth.authState.subscribe(user => {
      if (user && (user.email?.toLowerCase() === 'admin@gmail.com'.toLowerCase() || user.email?.toLowerCase() === 'bank@gmail.com'.toLowerCase())) {
        this.showDialog = true;
      } else {
        console.log('error')
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please contact your admin or bank' });

      }
    }, error => {
      {
    }
    });
  }
  

  
}


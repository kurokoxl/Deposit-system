import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService, Transaction } from './transaction.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {


  productDialog: boolean = false;
  transactions: Transaction[] = [];
  submitted: boolean = false;
  statuses!: any[];
  selectedTransactions: Transaction[] = [];
  condition: boolean = true; // Set it to true or false based on your condition

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private transactionService: TransactionService
    ,private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && (user.email?.toLowerCase() === 'admin@gmail.com'.toLowerCase() || user.email?.toLowerCase() === 'bank@gmail.com'.toLowerCase())) {
        this.condition = false;
        console.log('adminn')
      }
    
    this.loadTransactionsFromFirebase();
  });
 }


  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  newTransaction(form: NgForm) {
    if (form.valid) {
      const newTransaction = {
        bankName: form.value.bankName,
        amount: form.value.amount,
        category: form.value.type,
        date: new Date(),
        status: 'Pending'
      };
     
      this.transactionService.saveTransaction(newTransaction).subscribe(response => {
        console.log('Transaction saved:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transaction saved successfully!' });

        // Assuming the response contains the new transaction ID, add the transaction to the array
        const savedTransaction: Transaction = {
          id: response.name, // Firebase returns the name as the key of the new object
          ...newTransaction,
          date: new Date(newTransaction.date) // Convert string date to Date object
        };

        this.transactions.push(savedTransaction);
        form.reset();
        this.productDialog = false;
      }, error => {
        console.error('Error saving transaction:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while saving the transaction.' });
      });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fill all the fields' });

    }
  }

  async loadTransactionsFromFirebase() {
    this.transactionService.getTransactions().subscribe(data => {
      if (data) {
        this.transactions = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
          date: new Date(data[key].date) // Convert string date to Date object
        }));
      }
    });
  }

  openNewTransaction() {
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    // Assuming each transaction object has an 'id' property
    const selectedIds = this.selectedTransactions.map(transaction => transaction.id);
    selectedIds.forEach(id => {
      // Remove from database
      this.http.delete(`https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/transactions/${id}.json`)
        .subscribe(() => {
          // Remove from array
          this.transactions = this.transactions.filter(transaction => transaction.id !== id);
        });
    });
    // Clear selection
    this.selectedTransactions = [];
  }
  setSuccess(transaction: Transaction) {
    this.updateTransactionStatus(transaction, 'Success');
  }

  setRejected(transaction: Transaction) {
    this.updateTransactionStatus(transaction, 'Rejected');
  }

  private updateTransactionStatus(transaction: Transaction, status: string) {
    const updatedTransaction = { ...transaction, status };

    // Update in the database
    this.transactionService.updateTransaction(transaction.id!, updatedTransaction).subscribe(() => {
      // Update in the local array
      const index = this.transactions.findIndex(t => t.id === transaction.id);
      if (index !== -1) {
        // Ensure the object reference is updated for Angular change detection
        this.transactions[index] = updatedTransaction;
        this.transactions = [...this.transactions];
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transaction status updated successfully!' });
    }, error => {
      console.error('Error updating transaction status:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating the transaction status.' });
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { TransactionService,Transaction } from '../transactions/transaction.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  successfulTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  totalSuccessAmount: number = 0;
  startDate!: Date;
  endDate!: Date;
  totalDeposits: number = 0;

  totalWithdrawals: number = 0;
  transactionDialog: boolean = false;
  selectedTransaction: Transaction | null = null;

  chartData: any;
  chartOptions: any;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadSuccessfulTransactions();
    this.initializeChartOptions();
  }

  private loadSuccessfulTransactions(): void {
    this.transactionService.getTransactions().subscribe(data => {
      if (data) {
        this.successfulTransactions = Object.keys(data)
          .map(key => ({
            ...data[key],
            id: key,
            date: new Date(data[key].date)
          }))
          .filter(transaction => transaction.status === 'Success');
        this.filteredTransactions = this.successfulTransactions;
        this.calculateTotals();
        this.prepareChartData();
      }
    });
  }

  private calculateTotals(): void {
    this.totalSuccessAmount = this.filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    this.totalWithdrawals = this.filteredTransactions
      .filter(transaction => transaction.category === 'Withdrawal')
      .reduce((total, transaction) => total + transaction.amount, 0);
    this.totalDeposits = this.filteredTransactions
      .filter(transaction => transaction.category === 'Deposit')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  filterByDate(): void {
    if (this.startDate && this.endDate) {
      this.filteredTransactions = this.successfulTransactions.filter(transaction => 
        transaction.date >= this.startDate && transaction.date <= this.endDate
      );
    } else {
      this.filteredTransactions = this.successfulTransactions;
    }
    this.calculateTotals();
    this.prepareChartData();
  }

  exportToCSV(): void {
    const csv = Papa.unparse(this.filteredTransactions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'successful_transactions.csv');
    a.click();
  }

  showTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.transactionDialog = true;
  }

  private prepareChartData(): void {
    const categories = this.filteredTransactions.map(transaction => transaction.category);
    const uniqueCategories = [...new Set(categories)];
    const data = uniqueCategories.map(category => 
      this.filteredTransactions.filter(transaction => transaction.category === category).length
    );

    this.chartData = {
      labels: uniqueCategories,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      }
    };
  }
}

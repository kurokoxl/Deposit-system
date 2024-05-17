import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Auth/auth-guard';
import { ExpensesComponent } from './expenses/expenses.component';
import {  IncomeComponent } from './income/income.component';
import { GoalsComponent } from './goals/goals.component';
import { SuperAdminGuard } from './Auth/super-auth';
import { TransactionsComponent } from './transactions/transactions.component';
import { ReportingComponent } from './reporting/reporting.component';
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent,canActivate: [SuperAdminGuard]},
  {path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
  {path:'transactions',component:TransactionsComponent,canActivate: [AuthGuard]},
  {path:'report',component:ReportingComponent,canActivate:[AuthGuard]}
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

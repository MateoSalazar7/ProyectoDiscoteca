import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { logging } from 'protractor';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns:string[] = ['name','categoryName','description','price','edit'];
  dataSource:any;
  ressponseMessage:any

  constructor(private productService:ProductService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((response:any)=>{
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      console.log(error);
      if(error.error?.message){
        this.ressponseMessage = error.error?.message;
      }
      else{
        this.ressponseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.ressponseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      message: "Agregar Producto"
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      message: "Editar Producto",
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

  handleDeletetAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'eliminar '+values.name+' de productos'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.tableData();
      this.ressponseMessage = response?.message;
      this.snackbarService.openSnackBar(this.ressponseMessage,"success");
    },(error:any)=>{
      console.log(error);
      if(error.error?.message){
        this.ressponseMessage = error.error?.message;
      }
      else{
        this.ressponseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.ressponseMessage,GlobalConstants.error);
    })
  }

  onChange(status:any,id:any){
    var data = {
      status:status.toString(),
      id:id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ressponseMessage = response?.message;
      this.snackbarService.openSnackBar(this.ressponseMessage,"success");
    },(error:any)=>{
      console.log(error);
      if(error.error?.message){
        this.ressponseMessage = error.error?.message;
      }
      else{
        this.ressponseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.ressponseMessage,GlobalConstants.error);
    })
  }
}

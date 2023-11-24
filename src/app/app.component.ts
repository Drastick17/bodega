
import { AfterViewInit, ViewChild, Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Producto } from './interfaces/producto';
import { ProductoService } from './services/producto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogProductoComponent } from './dialogs/dialog-producto/dialog-producto.component';
import { DialogDeleteComponent } from './dialogs/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit{
  title = "Danny"
  displayColumns: string[] = ["ID", "NOMBRE", "DESCRIPCION", "PRECIO", "IVA", "FECHA DE CREACION", "ESTADOID", "ACCION"]
  dataSourceProducto = new MatTableDataSource<Producto>

  alert(msg: string, action: string) {
    this._snackBar.open(msg, action, { horizontalPosition: "end", verticalPosition: "top", duration: 3000 })
  }

  constructor(private _productoService:ProductoService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducto.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSourceProducto.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.listAll()
  }

  listAll(){
    this._productoService.List().subscribe({next: (list: Producto[]) =>{   
      console.log(list)
   //  const newList = list.map(({prO_FechaCreacion, ...producto}) => ({prO_FechaCreacion: new Date(prO_FechaCreacion).toLocaleDateString('en-US'), ...producto}))
      this.dataSourceProducto.data = list;
    }, error:(e) => console.error(e) 
   });
  }


  openDialog() {
    this.dialog.open(DialogProductoComponent, { disableClose: true, width: "50vw" }).afterClosed().subscribe(result => {
      this.listAll()
    });
  }

  openEditDialog(data: Producto) {
    this.dialog.open(DialogProductoComponent, { disableClose: true, width: "50vw", data }).afterClosed().subscribe(result => {
      this.listAll()
    });
  }

  openDeleteDialog(data: Producto) {
    this.dialog.open(DialogDeleteComponent, { disableClose: true, width: "50vw", data }).afterClosed().subscribe(result => {
      if(result === "deleted"){
        this.deleteProduct(data.prO_Id)
      }
      
    });
  }

  deleteProduct(id: number) {
    this._productoService.Delete(id).subscribe({
      next: () => {
        this.alert("Se elimino el producto", "Success")
        this.listAll()
      }, error: (e) => {
        console.error(e)
        this.alert("Error en el delete", "Error")
      }
    })
  }


}


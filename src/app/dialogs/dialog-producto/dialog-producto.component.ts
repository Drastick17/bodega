


import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/interfaces/producto';

@Component({
  selector: 'app-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.css']
})
export class DialogProductoComponent implements OnInit {
  formEst: FormGroup;
  action = "Nuevo Producto"
  buttonForm = "Guardar"

  alert(msg: string, action: string) {
    this._snackBar.open(msg, action, { horizontalPosition: "end", verticalPosition: "top", duration: 3000 })
  }

  constructor(
    private dialogRef: MatDialogRef<DialogProductoComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public dataProducto: Producto,) {
    this.formEst = this.fb.group({
      "prO_Id": [""],
      "prO_Descripcion": ["", Validators.required],
      "prO_Nombre": ["", Validators.required],
      "prO_Precio": ["", Validators.required],
      "prO_ExcentoIva": ["", Validators.required],
      "prO_FechaCreacion": [new Date(), Validators.required],
      "prO_Estado": ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if (!this.dataProducto) return;
    this.action = "Actualizar Producto"
    this.buttonForm = "Actualizar"
    this.formEst.patchValue({
      prO_Id: this.dataProducto.prO_Id,
      prO_Descripcion: this.dataProducto.prO_Descripcion,
      prO_Nombre: this.dataProducto.prO_Nombre,
      prO_Precio: this.dataProducto.prO_Precio,
      prO_ExcentoIva: this.dataProducto.prO_ExcentoIva,
      prO_FechaCreacion:this.dataProducto.prO_FechaCreacion,
      prO_Estado:this.dataProducto.prO_Estado
    })
  }

  handleProduct() {
    const producto: Producto = {
      prO_Id: this.formEst.value.prO_Id  == "" ? 0 : this.formEst.value.prO_Id,
      prO_Descripcion: this.formEst.value.prO_Descripcion,
      prO_Nombre: this.formEst.value.prO_Nombre,
      prO_Precio: this.formEst.value.prO_Precio,
      prO_ExcentoIva: this.formEst.value.prO_ExcentoIva,
      prO_FechaCreacion:this.formEst.value.prO_FechaCreacion,
      prO_Estado:this.formEst.value.prO_Estado
    }
    this.dataProducto
      ? this.editProducto(producto)
      : this.addProducto(producto)
  }

  addProducto(producto: Producto) {
    this._productoService.Create(producto).subscribe({
      next: (data) => {
        this.alert("Se creo el nuevo producto", "Success")
        this.dialogRef.close();
      }, error: (e) => {
        console.error(e)
        this.alert("Error en el insert", "Error")
      }
    })
  }

  editProducto(producto: Producto) {
    this._productoService.Update(producto.prO_Id, producto).subscribe({
      next: (data) => {
        this.alert("Se actualizo el producto", "Success")
        this.dialogRef.close();
      }, error: (e) => {
        console.error(e)
        this.alert("Error en el actualizar", "Error")
      }
    })
  }

}

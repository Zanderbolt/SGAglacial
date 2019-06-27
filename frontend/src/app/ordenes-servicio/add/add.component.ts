import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { Vehiculo } from 'src/app/models/vehiculo';
import { OrdenServicioService } from 'src/app/services/orden-servicio.service';
import { OrdenServicio } from 'src/app/models/orden-servicio';

import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-addOrdenServicio',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css', '../ordenes-servicio.component.css']
})
export class AddComponentOrdenServicio implements OnInit {
  Vdisabled : boolean = true
  catalogoClientes: string[] = []
  myControl = new FormControl();
  filteredClientes: Observable<string[]>;

  // MODELO DE VEHICULOS
  vehiculo: Vehiculo = {
    _id: '',
    area: '',
    responsable: '',
    usuario: '',
    marca: '',
    modelo: '',
    placas: '',
    ano: '',
    kms: '',
    color: '',
    numero_serie: '',
  };

 


  constructor(public clienteService: ClienteService,
              public vehiculoService: VehiculoService,
              public ordenServicioService: OrdenServicioService,
              public toastr: ToastrService) { }

  ngOnInit() {

    this.clienteService.getClientes().subscribe(res => {
      this.clienteService.clientes = res as Cliente[];
      for (let i = 0; i < this.clienteService.clientes.length; i++) {
        this.catalogoClientes.push(this.clienteService.clientes[i].nombre_razon_social);
      }
    })

    this.filteredClientes = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.catalogoClientes.filter(cliente => cliente.toLowerCase().includes(filterValue));
  }

  public limpiarCliente(form: NgForm) {
    form.reset();
    form.form.enable();
    this.clienteService.selectedCliente = new Cliente;
  }

  public buscarCliente(form: NgForm) {
    this.clienteService.getClienteByNombre(this.myControl.value)
      .subscribe(res => {
        this.clienteService.selectedCliente = res[0] as Cliente;
        form.form.disable();
        this.toastr.info("Cliente Encontrado!");
      });
  }

  public guardarVehiculo(form: NgForm) {
    this.vehiculoService.guardarVehiculo(form.value)
    .subscribe(res => {
      this.vehiculoService.selectedVehiculo = res as Vehiculo;           
    })
    form.form.disable();
    this.toastr.info("Vehículo Guardado!");
  }

  public limpiarVehiculo(form: NgForm) {
    form.reset();
    form.form.enable();
    this.vehiculoService.selectedVehiculo = new Vehiculo;
  }

  public disableVehiculo(form: NgForm) {
    form.form.disable();
  }

  // public test() {
  //   this.ordenServicioService.guardarOrdenServicio(this.orden_servicio)
  //   .subscribe(res => console.log(res));
  // }

}

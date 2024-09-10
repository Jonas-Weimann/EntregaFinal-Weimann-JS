let gastos = []

let categoriasGastos = []
let categoriasIngresos = []


let totalGastos = 0
let totalIngresos = 0
let totalAhorros = 0
let saldoNeto = 0

const botonRegistrarGasto = document.getElementById('boton--registrar-gasto')
const botonRegistrarIngreso = document.getElementById('boton--registrar-ingreso')
const botonRegistrarAhorro = document.getElementById('boton--registrar-ahorro')
const historialContainer = document.querySelector('.historiales')

let fechaGasto
let detalleGasto
let categoriaGasto
let medioGasto
let montoGasto

let historialGastosTabla
let historialGastosTablaBody

class Gasto{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}

function iniciarHistorialGastos(){
    historialContainer.innerHTML+="<table class=historial id=historial-gastos>"
    historialGastosTabla = document.getElementById('historial-gastos')
    historialGastosTabla.innerHTML+='<thead><tr><th>Fecha<th>Detalle<th>Categoría<th>Medio de pago<th>Monto<tbody id=historial-gastos-body>'
    historialGastosTablaBody = document.getElementById('historial-gastos-body')
}

function obtenerDatos(){
    //Obtengo los datos de los inputs del form de registro de gastos
    fechaGasto = document.getElementById('gasto--fecha').value
    detalleGasto = document.getElementById('gasto--detalle').value.toUpperCase()
    categoriaGasto = document.getElementById('gasto--categoria').value.toUpperCase()
    medioGasto = document.getElementById('gasto--medio').value.toUpperCase()
    montoGasto = document.getElementById('gasto--monto').value
}

function agregarGastoAArray(){
    //Añado el nuevo gasto al array de gastos
    let nuevoGasto = new Gasto(fechaGasto,detalleGasto,categoriaGasto,medioGasto,montoGasto)
    gastos.push(nuevoGasto)
    console.log(gastos)
}

function agregarGastoATabla(fechaGasto,detalleGasto,categoriaGasto,medioGasto,montoGasto){
    historialGastosTablaBody.innerHTML+=`<tr><td>${fechaGasto}<td>${detalleGasto}<td>${categoriaGasto}<td>${medioGasto}<td>${montoGasto}`
}

botonRegistrarGasto.addEventListener('click',()=>{
    if (gastos.length == 0){
        iniciarHistorialGastos()
    }
    obtenerDatos()
    agregarGastoAArray()
    agregarGastoATabla(fechaGasto,detalleGasto,categoriaGasto,medioGasto,montoGasto)
})


let gastos = []
let ingresos = []
let ahorros = []

const botonRegistrarGasto = document.getElementById('boton--registrar-gasto')
const botonRegistrarIngreso = document.getElementById('boton--registrar-ingreso')
const botonRegistrarAhorro = document.getElementById('boton--registrar-ahorro')
const historialContainer = document.querySelector('.historiales')

let fecha
let detalle
let categoria
let medio
let monto

class Gasto{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}
class Ingreso{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}
class Ahorro{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}

let nosequehacerBODY =[]
let nosequehacerCATEGORIAS =[]
let nosequehacerTITULOS =[]

function iniciarHistorial(tipo){
    //Crea una tabla donde se añadirán los ingresos
    historialContainer.innerHTML+=`<table class=historial id=historial-${tipo}>`
    historial = document.getElementById(`historial-${tipo}`)
    historial.innerHTML+=`<thead><tr><th class=historial-titulo id=historial-${tipo}-titulo>Historial De ${tipo} <tr class=historial-categorias id=historial-${tipo}-categorias><th>Fecha<th>Detalle<th>Categoría<th>Medio de pago<th>Monto<tbody id=historial-${tipo}-body>`
    historialTitulo = document.getElementById(`historial-${tipo}-titulo`)
    nosequehacerTITULOS.push(historialTitulo)
    historialCategorias = document.getElementById(`historial-${tipo}-categorias`)
    nosequehacerCATEGORIAS.push(historialCategorias)
    historialBody = document.getElementById(`historial-${tipo}-body`)
    nosequehacerBODY.push(historialBody)
}

function obtenerDatos(tipo){
    //Obtiene los datos de los inputs del form de registro
    fecha = document.getElementById(`${tipo}--fecha`).value
    detalle = document.getElementById(`${tipo}--detalle`).value.toUpperCase()
    categoria = document.getElementById(`${tipo}--categoria`).value.toUpperCase()
    medio = document.getElementById(`${tipo}--medio`).value.toUpperCase()
    monto = document.getElementById(`${tipo}--monto`).value
}

function clasificarDato(tipo) {
    function crearYAgregar(Constructor, array) {
        array.push(new Constructor(fecha, detalle, categoria, medio, monto))
        console.log(array)
    }
    if (tipo == 'gastos') {
        crearYAgregar(Gasto, gastos)
    } else if (tipo == 'ingresos') {
        crearYAgregar(Ingreso, ingresos)
    } else if (tipo == 'ahorros') {
        crearYAgregar(Ahorro, ahorros)
    }
}

function agregarFilaAlHistorial(tipo){
    const nuevaFila = document.createElement('tr')
    const celdas = [fecha, detalle, categoria, medio, `$${monto}`]
    celdas.forEach(contenido => {
        const celda = document.createElement('td')
        celda.innerText = contenido
        nuevaFila.appendChild(celda)
    });
    historialBody = document.getElementById(`historial-${tipo}-body`)
    historialBody.appendChild(nuevaFila)
}

function mostrarOcultarFila(){
    nosequehacerTITULOS[0].onclick = ()=>{
        nosequehacerCATEGORIAS[0].classList.toggle('hidden')
        nosequehacerBODY[0].classList.toggle('hidden')
        console.log(nosequehacerBODY,nosequehacerCATEGORIAS,nosequehacerTITULOS)

    }
    nosequehacerTITULOS[1].onclick = ()=>{
        nosequehacerCATEGORIAS[1].classList.toggle('hidden')
        nosequehacerBODY[1].classList.toggle('hidden')
    }
    nosequehacerTITULOS[2].onclick = ()=>{
        nosequehacerCATEGORIAS[2].classList.toggle('hidden')
        nosequehacerBODY[2].classList.toggle('hidden')
    }
}

function agregarDato(tipo,array){
    if (array.length == 0){
        iniciarHistorial(tipo, array)
    }
    obtenerDatos(tipo)
    clasificarDato(tipo)
    agregarFilaAlHistorial(tipo)
    mostrarOcultarFila()
}


botonRegistrarGasto.addEventListener('click',()=>{
    agregarDato('gastos', gastos)
})
botonRegistrarIngreso.addEventListener('click',()=>{
    agregarDato('ingresos', ingresos)
})
botonRegistrarAhorro.addEventListener('click',()=>{
    agregarDato('ahorros', ahorros)
})

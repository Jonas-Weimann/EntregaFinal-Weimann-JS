let gastos = ['gastos']
let ingresos = ['ingresos']
let ahorros = ['ahorros']
let objetivos = ['objetivos']
let presupuestos = ['presupuestos']

const listaDeArrays = [gastos, ingresos, ahorros, objetivos, presupuestos]

const botonRegistrarGasto = document.getElementById('boton--registrar-gasto')
const botonRegistrarIngreso = document.getElementById('boton--registrar-ingreso')
const botonRegistrarAhorro = document.getElementById('boton--registrar-ahorro')
const botonRegistrarObjetivo = document.getElementById('boton--registrar-objetivo')
const botonRegistrarPresupuesto = document.getElementById('boton--registrar-presupuesto')
const botonGuardarCambios = document.getElementById('boton--guardar-cambios')

const misObjetivos = document.getElementById('mis-objetivos')
const misPresupuestos = document.getElementById('mis-presupuestos')
const total = document.getElementById('total-neto')


let fecha
let detalle
let categoria
let medio
let monto

class Transaccion{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}

class Objetivo {
    constructor(titulo, sumaInicial, sumaObjetivo, porcentaje){
        this.titulo = titulo
        this.sumaInicial = sumaInicial
        this.sumaObjetivo = sumaObjetivo
        this.porcentaje = porcentaje
    }
}

class Presupuesto {
    constructor(tipoDePresupuesto, fechaDePresupuesto, montoDePresupuesto, montoGastado, porcentaje){
        this.tipoDePresupuesto = tipoDePresupuesto
        this.fechaDePresupuesto = fechaDePresupuesto
        this.montoDePresupuesto = montoDePresupuesto
        this.montoGastado = montoGastado
        this.porcentaje = porcentaje
    }
}

function iniciarHistorial(tipo){
    //Crea una tabla donde se añadirán los datos
    const historialContainer = document.getElementById('historiales--container')
    historialContainer.innerHTML+=`<table class=historial id=historial-${tipo}>`
    historial = document.getElementById(`historial-${tipo}`)
    historial.innerHTML+=`<thead><tr><th class=historial-titulo id=historial-${tipo}-titulo>Historial de ${tipo} <tr class=historial-categorias id=historial-${tipo}-categorias><th>Fecha<th>Detalle<th>Categoría<th>Medio de pago<th>Monto<tbody id=historial-${tipo}-body>`
}

function obtenerDatos(tipo){
    //Obtiene los datos de los inputs de los forms de registro
    fecha = document.getElementById(`${tipo}--fecha`).value
    detalle = document.getElementById(`${tipo}--detalle`).value.toUpperCase()
    categoria = document.getElementById(`${tipo}--categoria`).value.toUpperCase()
    medio = document.getElementById(`${tipo}--medio`).value.toUpperCase()
    monto = document.getElementById(`${tipo}--monto`).value
}

function clasificarDato(tipo) {
    //Actúa de diferente manera segun el tipo de dato del que se trate
    //Añade los objetos a sus respectivos arrays según su tipo
    function crearYAgregar(array) {
        array.push(new Transaccion(fecha, detalle, categoria, medio, monto))
    }
    if (tipo == 'gastos') {
        crearYAgregar(gastos)
        restarPresupuestos()
        actualizarSaldoDisponible('restar')
    } else if (tipo == 'ingresos') {
        crearYAgregar(ingresos)
        actualizarSaldoDisponible('sumar')
    } else if (tipo == 'ahorros') {
        crearYAgregar(ahorros)
        vincularObjetivo()
        actualizarSaldoDisponible('restar')
    }
}

function agregarFilaAlHistorial(tipo){
    //Agrega una fila por cada nuevo elemento creado
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

function agregarDato(tipo,array){
    obtenerDatos(tipo)
    if (fecha != '' && !isNaN(monto) && monto != ''){
        if (array.length == 1){
            iniciarHistorial(tipo)
        }
        clasificarDato(tipo)
        agregarFilaAlHistorial(tipo)
    }
}

function vincularObjetivo(){
    objetivoAVincular = objetivos.find((objetivo) => objetivo.titulo == categoria)
    objetivoAsociadoH6 = document.getElementById(objetivoAVincular.titulo)
    if (objetivoAVincular.porcentaje <100){
        objetivoAVincular.sumaInicial += parseInt(monto)
        objetivoAVincular.porcentaje = parseInt(objetivoAVincular.sumaInicial*100/objetivoAVincular.sumaObjetivo)
        objetivoAsociadoH6.innerText = `${objetivoAVincular.titulo}: ${objetivoAVincular.porcentaje}% completado`
    } else {
        objetivoAsociadoH6.innerText = `${objetivoAVincular.titulo}: 100% completado. ¡Felicitaciones!`
    }
}

function restarPresupuestos(){
    presupuestosARestar = presupuestos.filter((presupuesto)=>{
        const fechaDePresupuesto = new Date(presupuesto.fechaDePresupuesto)
        const fechaGasto = new Date(fecha)
        const fechaFin = new Date(fechaDePresupuesto)
        if(presupuesto.tipoDePresupuesto == 'SEMANAL'){
            intervalo = 7
        } else {
            intervalo = 30
        }
        fechaFin.setDate(fechaDePresupuesto.getDate() + intervalo)
        console.log(fechaDePresupuesto.toLocaleDateString())
        console.log(fechaFin.toLocaleDateString())
        console.log(fechaGasto.toLocaleDateString())
        return (fechaDePresupuesto <= fechaGasto && fechaGasto <= fechaFin)
    })
    presupuestosARestar.forEach((presupuestoARestar)=>{
        presupuestoAsociadoH6 = document.getElementById(presupuestoARestar.tipoDePresupuesto+presupuestoARestar.fechaDePresupuesto)
    if(presupuestoARestar.porcentaje<100){
        presupuestoARestar.montoGastado += parseInt(monto)
        presupuestoARestar.porcentaje = parseInt(presupuestoARestar.montoGastado*100/presupuestoARestar.montoDePresupuesto)
        presupuestoAsociadoH6.innerText = `${presupuestoARestar.tipoDePresupuesto} (${presupuestoARestar.fechaDePresupuesto}): ${presupuestoARestar.porcentaje}% usado`
    } else {
        presupuestoAsociadoH6.innerText = `${presupuestoARestar.tipoDePresupuesto} (${presupuestoARestar.fechaDePresupuesto}): 100% usado`
    }
    })
    
}


botonGuardarCambios.addEventListener('click',()=>{
    guardarCambios()

})

botonRegistrarObjetivo.addEventListener('click',()=>{
    tituloObjetivo = document.getElementById(`objetivo--titulo`).value.toUpperCase()
    sumaObjetivo = parseInt(document.getElementById(`objetivo--monto-inicio`).value)
    opciones = document.getElementById(`ahorros--categoria`)
    if (!(isNaN(sumaObjetivo)) && tituloObjetivo != ''){
        nuevoObjetivo = document.createElement('h6')
        nuevoObjetivo.id = tituloObjetivo
        nuevoElemento = new Objetivo(tituloObjetivo, 0, sumaObjetivo, 0)
        objetivos.push(nuevoElemento)
        nuevoObjetivo.innerText = `${tituloObjetivo}: 0% completado`
        misObjetivos.append(nuevoObjetivo)
        opcion = document.createElement('option')
        opcion.innerText = nuevoElemento.titulo
        opciones.appendChild(opcion)
    }
})

botonRegistrarPresupuesto.addEventListener('click',()=>{
    tipoDePresupuesto = document.getElementById(`presupuesto--periodo`).value.toUpperCase()
    fechaDePresupuesto = document.getElementById('presupuesto--fecha-inicio').value
    montoDePresupuesto = parseInt(document.getElementById(`presupuesto--monto`).value)
    if (!(isNaN(montoDePresupuesto)) && fechaDePresupuesto != ''){
        nuevoPresupuesto = document.createElement('h6')
        nuevoPresupuesto.id = tipoDePresupuesto + fechaDePresupuesto
        presupuestos.push(new Presupuesto(tipoDePresupuesto, fechaDePresupuesto, montoDePresupuesto, 0, 0))
        nuevoPresupuesto.innerText = `${tipoDePresupuesto} (${fechaDePresupuesto}): 0% usado`
        misPresupuestos.append(nuevoPresupuesto)
    }
})
botonRegistrarGasto.addEventListener('click',()=>{
    agregarDato('gastos', gastos)
})
botonRegistrarIngreso.addEventListener('click',()=>{
    agregarDato('ingresos', ingresos)
})
botonRegistrarAhorro.addEventListener('click',()=>{
    agregarDato('ahorros', ahorros)
})

function actualizarSaldoDisponible(operacion){
    totalValor = parseInt(total.innerText)
    console.log(operacion)
    if (operacion == 'sumar'){
        totalValor += parseInt(monto)
    } else if (operacion == 'restar'){
        totalValor -= parseInt(monto)
    }
    total.innerText = totalValor
    console.log(total, totalValor)
}

function guardarCambios(){
    for (array of listaDeArrays){
        localStorage.setItem(`${array[0]}`, JSON.stringify(array));
        console.log(array)
        console.log(array[0])
    }
    localStorage.setItem('objetivos', JSON.stringify(objetivos));
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
    localStorage.setItem('totalNeto', total.innerText);
}

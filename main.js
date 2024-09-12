//VARIABLES

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
const botonCargarCambios = document.getElementById('boton--cargar-cambios')
const botonDescartarCambios = document.getElementById('boton--descartar-cambios')

const misObjetivos = document.getElementById('mis-objetivos')
const misPresupuestos = document.getElementById('mis-presupuestos')

const total = document.getElementById('total-neto')


let fecha
let detalle
let categoria
let medio
let monto

//CLASES 
class Transaccion{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha
        this.detalle = detalle
        this.categoria = categoria
        this.medioDePago = medio
        this.monto = monto
    }
}

class Objetivo{
    constructor(titulo, sumaInicial, sumaObjetivo, porcentaje){
        this.titulo = titulo
        this.sumaInicial = sumaInicial
        this.sumaObjetivo = sumaObjetivo
        this.porcentaje = porcentaje
    }
}

class Presupuesto{
    constructor(tipoDePresupuesto, fechaDePresupuesto, montoDePresupuesto, montoGastado, porcentaje){
        this.tipoDePresupuesto = tipoDePresupuesto
        this.fechaDePresupuesto = fechaDePresupuesto
        this.montoDePresupuesto = montoDePresupuesto
        this.montoGastado = montoGastado
        this.porcentaje = porcentaje
    }
}

//FUNCIONES 

function obtenerDatos(tipo){
    //Obtiene los datos de los inputs de los forms de registro
    fecha = document.getElementById(`${tipo}--fecha`).value
    detalle = document.getElementById(`${tipo}--detalle`).value.toUpperCase()
    categoria = document.getElementById(`${tipo}--categoria`).value.toUpperCase()
    medio = document.getElementById(`${tipo}--medio`).value.toUpperCase()
    monto = document.getElementById(`${tipo}--monto`).value
}

function iniciarHistorial(tipo){
    //Crea una tabla donde se añadirán los datos
    const historialContainer = document.getElementById('historiales--container')
    historialContainer.innerHTML+=`<table class=historial id=historial-${tipo}>`
    const historial = document.getElementById(`historial-${tipo}`)
    historial.innerHTML+=`<thead><tr><th class=historial-titulo id=historial-${tipo}-titulo>Historial de ${tipo} <tr class=historial-categorias id=historial-${tipo}-categorias><th>Fecha<th>Detalle<th>Categoría<th>Medio de pago<th>Monto<tbody id=historial-${tipo}-body>`
}

function vincularObjetivo(){
    //Busca el objetivo asociado al ahorro registrado
    const objetivoAVincular = objetivos.find((objetivo) => objetivo.titulo == categoria)
    const objetivoAsociadoH6 = document.getElementById(objetivoAVincular.titulo)

    if((objetivoAVincular.porcentaje + parseInt(monto)) >= objetivoAVincular.sumaObjetivo || objetivoAVincular.porcentaje >=100){
        objetivoAsociadoH6.innerText = `${objetivoAVincular.titulo}: 100% completado. ¡Felicitaciones!`
        //Elimina la opcion de la registración de ahorros ya que el objetivo fue cumplido
        const opcionAsociada = document.getElementById('opcion ' + objetivoAVincular.titulo)
        opcionAsociada.remove()
    } else{
        //Actualiza el progreso del objetivo asociado al ahorro registrado
        objetivoAVincular.sumaInicial += parseInt(monto)
        objetivoAVincular.porcentaje = parseInt(objetivoAVincular.sumaInicial*100/objetivoAVincular.sumaObjetivo)
        objetivoAsociadoH6.innerText = `${objetivoAVincular.titulo}: ${objetivoAVincular.porcentaje}% completado`
    }
}

function restarPresupuestos(){
    //Filtra todos los presupuestos existentes y retorna aquellos que incluyen la fecha del gasto
    presupuestosARestar = presupuestos.filter((presupuesto)=>{
        const fechaDePresupuesto = new Date(presupuesto.fechaDePresupuesto)
        const fechaGasto = new Date(fecha)
        const fechaFin = new Date(fechaDePresupuesto)
        let intervalo 

        if(presupuesto.tipoDePresupuesto == 'SEMANAL'){
            intervalo = 7
        } else {
            intervalo = 30
        }

        fechaFin.setDate(fechaDePresupuesto.getDate() + intervalo)
        return (fechaDePresupuesto <= fechaGasto && fechaGasto <= fechaFin)
    })
    //Actualiza el progreso de cada presupuesto compatible
    presupuestosARestar.forEach((presupuestoARestar)=>{
        const presupuestoAsociadoH6 = document.getElementById(presupuestoARestar.tipoDePresupuesto+presupuestoARestar.fechaDePresupuesto)
        
        if((presupuestoARestar.montoGastado + parseInt(monto)) >= presupuestoARestar.montoDePresupuesto){
            presupuestoAsociadoH6.innerText = `${presupuestoARestar.tipoDePresupuesto} (${presupuestoARestar.fechaDePresupuesto}): 100% usado`
        } else {
            presupuestoARestar.montoGastado += parseInt(monto)
            presupuestoARestar.porcentaje = parseInt(presupuestoARestar.montoGastado*100/presupuestoARestar.montoDePresupuesto)
            presupuestoAsociadoH6.innerText = `${presupuestoARestar.tipoDePresupuesto} (${presupuestoARestar.fechaDePresupuesto}): ${presupuestoARestar.porcentaje}% usado`
        }
    })
    
}

function actualizarSaldoDisponible(operacion){
    // Refleja el impacto de las transacciones en el saldo disponible para usar
    totalValor = parseInt(total.innerText)
    if (operacion == 'sumar'){
        totalValor += parseInt(monto)
    } else if (operacion == 'restar'){
        totalValor -= parseInt(monto)
    }
    total.innerText = totalValor
}

function clasificarDato(tipo){
    //Actúa de diferente manera segun el tipo de dato del que se trate
    //Añade los objetos a sus respectivos arrays según su tipo
    const crearYAgregar = (array)=> {
        array.push(new Transaccion(fecha, detalle, categoria, medio, monto))
    }

    switch (tipo){
        case 'gastos':
            crearYAgregar(gastos)
            restarPresupuestos()
            actualizarSaldoDisponible('restar')
            break
        case 'ingresos':
            crearYAgregar(ingresos)
            actualizarSaldoDisponible('sumar')
            break
        case 'ahorros':
                crearYAgregar(ahorros)
                vincularObjetivo()
                actualizarSaldoDisponible('restar')
                break
            
    }
}

function agregarFilaAlHistorial(tipo){
    //Agrega una fila a su respectiva tabla por cada nuevo elemento creado 
    const nuevaFila = document.createElement('tr')
    const celdas = [fecha, detalle, categoria, medio, `$${monto}`]
    celdas.forEach(contenido => {
        const celda = document.createElement('td')
        celda.innerText = contenido
        nuevaFila.appendChild(celda)
    });
    const historialBody = document.getElementById(`historial-${tipo}-body`)
    historialBody.appendChild(nuevaFila)
}

function registrarTransaccion(tipo,array){
    obtenerDatos(tipo)
    if (fecha != '' && !isNaN(monto) && monto != ''){
        if (array.length == 1){
            iniciarHistorial(tipo)
        }
        clasificarDato(tipo)
        agregarFilaAlHistorial(tipo)
    }
}

function guardarCambios(){
    for (array of listaDeArrays){
        localStorage.setItem(`${array[0]}`, JSON.stringify(array))
    }
    localStorage.setItem('objetivos', JSON.stringify(objetivos))
    localStorage.setItem('presupuestos', JSON.stringify(presupuestos))
    localStorage.setItem('totalNeto', total.innerText)
}

function guardarHTML(){
        const historialHTML = document.getElementById('historiales--container').innerHTML
        localStorage.setItem('historialHTML', historialHTML)
    
        const objetivosHTML = document.getElementById('mis-objetivos').innerHTML
        localStorage.setItem('objetivosHTML', objetivosHTML)
    
        const presupuestosHTML = document.getElementById('mis-presupuestos').innerHTML
        localStorage.setItem('presupuestosHTML', presupuestosHTML)

        const opcionesHTML = document.getElementById('ahorros--categoria').innerHTML
        localStorage.setItem('opcionesHTML', opcionesHTML)

        localStorage.setItem('totalNeto', total.innerText)
        console.log(historialHTML, objetivosHTML, presupuestosHTML, total.innerText)
}

function cargarCambios(){
    for (array of listaDeArrays){
        const arrayGuardado = JSON.parse(localStorage.getItem(array[0]))
        array.push(...arrayGuardado.slice(1))
        console.log(array)

    }

    const totalGuardado = JSON.parse(localStorage.getItem('totalNeto'))
    total.innerText = totalGuardado
}

function cargarHTML(){
        const historialGuardado = localStorage.getItem('historialHTML')
        document.getElementById('historiales--container').innerHTML = historialGuardado
    
        const objetivosGuardados = localStorage.getItem('objetivosHTML')
        document.getElementById('mis-objetivos').innerHTML = objetivosGuardados
        
        const presupuestosGuardados = localStorage.getItem('presupuestosHTML')
        document.getElementById('mis-presupuestos').innerHTML = presupuestosGuardados
        
        const opcionesGuardadas = localStorage.getItem('opcionesHTML')
        document.getElementById('ahorros--categoria').innerHTML = opcionesGuardadas

        const saldoGuardado = localStorage.getItem('totalNeto')
        total.innerText = saldoGuardado        
}

function borrarHTML(){
    document.getElementById('historiales--container').innerHTML = ''
    document.getElementById('mis-objetivos').innerHTML = ''
    document.getElementById('mis-presupuestos').innerHTML = ''
    document.getElementById('ahorros--categoria').innerHTML = ''
    total.innerText = 0

}

function borrarDatos(){
    gastos = ['gastos']
    ingresos = ['ingresos']
    ahorros = ['ahorros']
    objetivos = ['objetivos']
    presupuestos = ['presupuestos']
}

//EVENTOS

botonRegistrarObjetivo.addEventListener('click',()=>{
    const tituloObjetivo = document.getElementById(`objetivo--titulo`).value.toUpperCase()
    const sumaObjetivo = parseInt(document.getElementById(`objetivo--monto-inicio`).value)
    const opciones = document.getElementById(`ahorros--categoria`)
    const existeObjetivo = objetivos.some(objetivo => objetivo.titulo == tituloObjetivo)

    if (!(isNaN(sumaObjetivo)) && tituloObjetivo !== '' && !existeObjetivo){
        const nuevoObjetivoHTML = document.createElement('h6')
        nuevoObjetivoHTML.id = tituloObjetivo
        const nuevoElemento = new Objetivo(tituloObjetivo, 0, sumaObjetivo, 0)
        objetivos.push(nuevoElemento)
        nuevoObjetivoHTML.innerText = `${tituloObjetivo}: 0% completado`
        misObjetivos.append(nuevoObjetivoHTML)
        //Crea una opción para poder ser vinculada cuando se registre un ahorro 
        const opcionHTML = document.createElement('option')
        opcionHTML.id = 'opcion ' + nuevoElemento.titulo
        opcionHTML.innerText = nuevoElemento.titulo
        opciones.appendChild(opcionHTML)
    }
})
botonRegistrarPresupuesto.addEventListener('click',()=>{
    const tipoDePresupuesto = document.getElementById(`presupuesto--periodo`).value.toUpperCase()
    const fechaDePresupuesto = document.getElementById('presupuesto--fecha-inicio').value
    const montoDePresupuesto = parseInt(document.getElementById(`presupuesto--monto`).value)
    const existePresupuesto = presupuestos.some(presupuesto => (presupuesto.tipoDePresupuesto+presupuesto.fechaDePresupuesto) == (tipoDePresupuesto+fechaDePresupuesto))

    if (!(isNaN(montoDePresupuesto)) && fechaDePresupuesto !== '' && !existePresupuesto){
        const nuevoPresupuestoHTML = document.createElement('h6')
        nuevoPresupuestoHTML.id = tipoDePresupuesto + fechaDePresupuesto
        presupuestos.push(new Presupuesto(tipoDePresupuesto, fechaDePresupuesto, montoDePresupuesto, 0, 0))
        nuevoPresupuestoHTML.innerText = `${tipoDePresupuesto} (${fechaDePresupuesto}): 0% usado`
        misPresupuestos.append(nuevoPresupuestoHTML)
    }
})

botonRegistrarGasto.addEventListener('click',()=>{
    registrarTransaccion('gastos', gastos)
})
botonRegistrarIngreso.addEventListener('click',()=>{
    registrarTransaccion('ingresos', ingresos)
})
botonRegistrarAhorro.addEventListener('click',()=>{
    registrarTransaccion('ahorros', ahorros)
})

botonGuardarCambios.addEventListener('click',()=>{
    guardarCambios()
    guardarHTML()
})
botonCargarCambios.addEventListener('click',()=>{
    cargarCambios()
    cargarHTML()
})
botonDescartarCambios.addEventListener('click',()=>{
    localStorage.clear()
    borrarDatos()
    borrarHTML()
    guardarHTML()
})


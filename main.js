// VARIABLES
let gastos = ['gastos']
let ingresos = ['ingresos']
let ahorros = ['ahorros']
let objetivos = ['objetivos']
let presupuestos = ['presupuestos']
let categorias = ['categorias']

let animacionEnCurso = false
let hayDatosSinGuardar = false

let DateTime = luxon.DateTime

const listaDeArrays = [gastos, ingresos, ahorros, objetivos, presupuestos]

const botonRegistrarGasto = document.getElementById('boton--registrar-gasto')
const botonRegistrarIngreso = document.getElementById('boton--registrar-ingreso')
const botonRegistrarAhorro = document.getElementById('boton--registrar-ahorro')
const botonRegistrarObjetivo = document.getElementById('boton--registrar-objetivo')
const botonRegistrarPresupuesto = document.getElementById('boton--registrar-presupuesto')
const botonGuardarCambios = document.getElementById('boton--guardar-cambios')
const botonCargarCambios = document.getElementById('boton--cargar-cambios')
const botonDescartarCambios = document.getElementById('boton--descartar-cambios')

const misObjetivos = document.getElementById('mis-objetivos--body')
const misPresupuestos = document.getElementById('mis-presupuestos--body')
const misCategorias = document.getElementById('mis-categorias--body')

const opcionesIngresos = document.getElementById(`ingresos--categoria`)
const opcionesGastos = document.getElementById(`gastos--categoria`)


const total = document.getElementById('total-neto')

fetch('./db/data.json')
.then(response => response.json())
.then(data =>{
    data.forEach(categoria=>{
        const card = document.createElement('div')
        card.className=`categoria--card ${categoria.tipo}`
        card.innerHTML= `<h2>${categoria.nombre}</h2><img class='card--icon' src='${categoria.icon}'></img>
                    <p class='card--valor numero' id='cat-${categoria.nombre}--monto'>0</p>`
        misCategorias.appendChild(card)
        //Añadir opciones a los forms de ingresos y gastos
        const opcionHTML = document.createElement('option')
        opcionHTML.id = `opcion-${categoria.id}`
        opcionHTML.innerText = categoria.nombre
        if (categoria.tipo == 'gasto'){
            opcionesGastos.appendChild(opcionHTML)
        } else if (categoria.tipo == 'ingreso'){
            opcionesIngresos.appendChild(opcionHTML)
        }
    })
})

let fecha
let detalle
let categoria
let medio
let monto

//CLASES 
class Transaccion{
    constructor(fecha,detalle,categoria,medio,monto){
        this.fecha = fecha.toLocaleString('es-AR')
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

function borrarFormato(){
    //Borra el formato a los numeros
    document.querySelectorAll('.numero').forEach((elemento)=>{
        let numero = elemento.innerText
        numeroSinFormato = parseInt(numero.replace(/\./g,''))
        elemento.innerText = numeroSinFormato
    })
    //Cambia el formato de las fechas a MM/DD/AAAA
    document.querySelectorAll('.fecha').forEach((elemento)=>{
        let fechaACambiar = elemento.innerText
        fechaACambiar = DateTime.fromISO(fechaACambiar).toLocaleString('en-US')
        console.log(fechaACambiar)
    })
}

function formatearNumeros(){
    setTimeout(()=>{
        document.querySelectorAll('.numero').forEach((elemento)=>{
            let numero = parseInt(elemento.innerText)
            numeroFormateado = numero.toLocaleString('es-AR')
            elemento.innerText = numeroFormateado
            })
    },10)

}

function iniciarHistorial(tipo){
    //Crea una tabla donde se añadirán los datos
    const historialContainer = document.getElementById('historiales--container')
    nuevoHistorial = document.createElement('table')
    nuevoHistorial.id =`historial-${tipo}`
    nuevoHistorial.classList.add('historial', 'animate__animated', 'animate__slideInDown')
    historialContainer.appendChild(nuevoHistorial)
    const historial = document.getElementById(`historial-${tipo}`)
    historial.innerHTML+=`<thead><tr><th class=historial-titulo id=historial-${tipo}-titulo>Historial de ${tipo} <tr class=historial-categorias id=historial-${tipo}-categorias><th>Fecha<th>Detalle<th>Categoría<th>Medio de pago<th>Monto<tbody id=historial-${tipo}-body>`
    //Espera a la animación para borrar la clase
    setTimeout(()=>{
        nuevoHistorial.classList.remove('animate__animated', 'animate__slideInDown')
    },500)
}

function vincularObjetivo(){
    //Busca el objetivo asociado al ahorro registrado
    const objetivoAVincular = objetivos.find((objetivo) => objetivo.titulo == categoria)
    const objetivoAsociadoH6 = document.getElementById(objetivoAVincular.titulo)

    if((objetivoAVincular.sumaInicial + parseInt(monto)) >= objetivoAVincular.sumaObjetivo || objetivoAVincular.porcentaje >=100){
        objetivoAsociadoH6.innerHTML = `${objetivoAVincular.titulo}<br>100% completado<br>¡Felicitaciones!`
        objetivoAsociadoH6.classList.add('objetivo-completado')
        objetivoAVincular.sumaInicial = objetivoAVincular.sumaObjetivo
        //Elimina la opcion de la registración de ahorros ya que el objetivo fue cumplido
        const opcionAsociada = document.getElementById('opcion ' + objetivoAVincular.titulo)
        opcionAsociada.remove()
    } else{
        //Actualiza el progreso del objetivo asociado al ahorro registrado
        objetivoAVincular.sumaInicial += parseInt(monto)
        objetivoAVincular.porcentaje = parseInt(objetivoAVincular.sumaInicial*100/objetivoAVincular.sumaObjetivo)
        objetivoAsociadoH6.innerHTML = `${objetivoAVincular.titulo}<br> ${objetivoAVincular.porcentaje}% completado`
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
            presupuestoAsociadoH6.innerHTML = `${presupuestoARestar.tipoDePresupuesto}<br>${presupuestoARestar.fechaDePresupuesto}<br>100% usado`
            presupuestoAsociadoH6.classList.add('presupuesto-completado')
        } else {
            presupuestoARestar.montoGastado += parseInt(monto)
            presupuestoARestar.porcentaje = parseInt(presupuestoARestar.montoGastado*100/presupuestoARestar.montoDePresupuesto)
            presupuestoAsociadoH6.innerHTML = `${presupuestoARestar.tipoDePresupuesto}<br>${presupuestoARestar.fechaDePresupuesto}<br>${presupuestoARestar.porcentaje}% usado`
        }
    })
    
}

function actualizarSaldoDisponible(operacion){
    // Refleja el impacto de las transacciones en el saldo disponible para usar
    totalValor = parseInt(total.innerText)
    if (operacion == 'sumar'){
        nuevoTotal = totalValor + parseInt(monto)
    } else if (operacion == 'restar'){
        nuevoTotal = totalValor - parseInt(monto)
    }
    animarContador(totalValor, nuevoTotal, total)      

}

function actualizarCategoria(tipo){
    const seleccion = document.getElementById(`${tipo}--categoria`)
    const categoriaAsociada = seleccion.value
    const cardAsociada = document.getElementById(`cat-${categoriaAsociada}--monto`)
    let totalCategoria = parseInt(cardAsociada.innerText)
    let nuevoTotal = totalCategoria + parseInt(monto)
    animarContador(totalCategoria, nuevoTotal, cardAsociada)
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
            actualizarCategoria(tipo)
            break
        case 'ingresos':
            crearYAgregar(ingresos)
            actualizarSaldoDisponible('sumar')
            actualizarCategoria(tipo)
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
    monto = parseInt(monto)
    const celdas = [fecha, detalle, categoria, medio, monto]
    celdas.forEach(contenido => {
        const celda = document.createElement('td')
        celda.innerText = contenido
        nuevaFila.appendChild(celda)
    })
    nuevaFila.firstChild.classList.add('fecha')
    nuevaFila.lastChild.classList.add('numero', 'monto-historiales')
    const historialBody = document.getElementById(`historial-${tipo}-body`)
    nuevaFila.classList.add('animate__animated','animate__slideInUp')
    historialBody.appendChild(nuevaFila)
}

function registrarTransaccion(tipo,array){
    //Obtiene y valida los datos de los inputs de los forms de registro
    borrarFormato()
    hayDatosSinGuardar = true
    fecha = document.getElementById(`${tipo}--fecha`).value
    detalle = document.getElementById(`${tipo}--detalle`).value.toUpperCase()
    categoria = document.getElementById(`${tipo}--categoria`).value.toUpperCase()
    medio = document.getElementById(`${tipo}--medio`).value.toUpperCase()
    monto = document.getElementById(`${tipo}--monto`).value
    totalValor = parseInt(total.innerText)

    try {
        if(animacionEnCurso){
            formatearNumeros()
            throw new Error('Actualizando datos. Espere y vuelva a intentar.')
        }
        if (fecha===''){
            formatearNumeros()
            throw new Error('Ingrese una fecha')
        }

        if (detalle===''){
            formatearNumeros()
            throw new Error('Ingrese un detalle')
        }

        if(categoria ===''){
            formatearNumeros()
            throw new Error('No hay ningún objetivo asociado. Ingréselo arriba')
        }

        if(medio === ''){
            formatearNumeros()
            throw new Error('Ingrese un medio de pago')
        }

        if(monto == 0 || monto === ''){
            formatearNumeros()
            throw new Error('El monto no puede ser 0')
        }

        if(monto > totalValor && tipo == 'gastos'){
            formatearNumeros()
            throw new Error('El monto del gasto no puede ser mayor al total disponible. Registre un ingreso primero')
        }
        
        if(monto > totalValor && tipo == 'ahorros'){
            formatearNumeros()
            throw new Error('El monto del ahorro no puede ser mayor al total disponible. Registre un ingreso primero')
        }


        if (array.length == 1){
            iniciarHistorial(tipo)
        }

        clasificarDato(tipo)
        fecha = DateTime.fromISO(fecha).toLocaleString('es-AR')
        agregarFilaAlHistorial(tipo)
        formatearNumeros()
        Toastify({
            text: `${tipo.slice(0,-1).toUpperCase()} REGISTRADO CON ÉXITO  `,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
          }).showToast()

    } catch(error) {
        Swal.fire({
            title: 'Error',
            text: `${error.message}`,
            icon: 'error',
            confirmButtonText: 'Continuar'
        })
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

        const categoriasHTML = document.getElementById('categorias-container').innerHTML
        localStorage.setItem('categoriasHTML', categoriasHTML)

        localStorage.setItem('totalNeto', total.innerText)
}

function animarContador(valorInicial, valorFinal, caja){
    animacionEnCurso = true
    let tasaDeCambio = valorFinal - valorInicial
    let paso = Math.abs(tasaDeCambio) / 1000 * 10

    if (tasaDeCambio<0){
        paso = -paso
    }

    let contador = setInterval(()=>{
        valorInicial += paso
        if ((paso > 0 && valorInicial >= valorFinal) || (paso < 0 && valorInicial <= valorFinal)) {
            valorInicial = valorFinal
            animacionEnCurso = false
            clearInterval(contador)
        }

        caja.innerText = Math.floor(valorInicial).toLocaleString('es-AR')
    }, 5)
}

function cargarCambios(){
    for (array of listaDeArrays){
        const arrayGuardado = JSON.parse(localStorage.getItem(array[0]))
        array.push(...arrayGuardado.slice(1))
        array.forEach((elemento) =>{
            let categoriaABuscar = elemento.categoria
            const categoriaABuscarHTML = document.getElementById(`cat-${categoriaABuscar}--monto`)
            const valorElemento = parseInt(elemento.monto)
            if (categoriaABuscarHTML !== null){
                const valorOriginal = parseInt(categoriaABuscarHTML.innerText)
                montoPorCategoria = valorElemento + valorOriginal
                animarContador(valorOriginal, montoPorCategoria, categoriaABuscarHTML)      
            }
        })
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

        const categoriasGuardadas = localStorage.getItem('categoriasHTML')
        document.getElementById('categorias-container').innerHTML = categoriasGuardadas

        const saldoGuardado = localStorage.getItem('totalNeto')
        total.innerText = saldoGuardado        
}

function borrarHTML(){
    document.getElementById('historiales--container').innerHTML = ''
    document.getElementById('mis-objetivos--body').innerHTML = ''
    document.getElementById('mis-presupuestos--body').innerHTML = ''
    document.getElementById('ahorros--categoria').innerHTML = ''
    total.innerText = 0

}

function borrarDatos(){
    gastos = ['gastos']
    ingresos = ['ingresos']
    ahorros = ['ahorros']
    objetivos = ['objetivos']
    presupuestos = ['presupuestos']
    const cards = document.querySelectorAll('.card--valor')
    cards.forEach((card)=>{
        card.innerText = 0
    })
}

function procesarDatosSinGuardar(){
    Swal.fire({
        title: 'Atención',
        text: 'Hay cambios sin guardar.',
        icon: 'warning',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Guardar cambios',
        denyButtonText: 'Descartar cambios',
    }).then((respuesta)=>{
        if(respuesta.isConfirmed){
            borrarFormato()
            guardarCambios()
            guardarHTML()
            Swal.fire('Éxito','Los datos se han guardado correctamente','success')
        } else if (respuesta.isDenied){
            borrarDatos()
            borrarHTML()
            cargarCambios()
            cargarHTML()
            Swal.fire('Éxito','Los datos se han cargado correctamente','success')
        }
        formatearNumeros()
        hayDatosSinGuardar = false
    })
}
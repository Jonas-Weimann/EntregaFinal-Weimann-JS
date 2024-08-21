let gastos = []
let ingresos = []
let ahorros = []

let categoriasGastos = []
let categoriasIngresos = []

let tipoDeDato

let totalGastos = 0
let totalIngresos = 0
let totalAhorros = 0
let saldoNeto = 0

const inicializar = ()=>{
    //El usuario decide la cantidad de datos a ingresar
    opcionElegida = parseInt(prompt('¿Desea registrar otro dato?: \n 1. Sí \n 2. No'))
    if (isNaN(opcionElegida)){
        alert('Por favor escriba un número del 1 al 2!')
        inicializar()
    } else if (opcionElegida == 1) {
        elegirDatoAIngresar()
    } else {
        calcularTotales()
        finalizar()
    }
}

const elegirDatoAIngresar = ()=>{
    //El usuario escribe un número para registrar un gasto, ingreso o ahorro
    tipoDeDato = parseInt(prompt('Seleccione tipo de dato a ingresar: \n 1. Gasto \n 2. Ingreso \n 3. Ahorro'))
    if (isNaN(tipoDeDato)){
        alert('Por favor escriba un número del 1 al 3!')
        elegirDatoAIngresar()
    } else {
        calificarDatoIngresado(tipoDeDato)
    }
}

const calificarDatoIngresado = (tipoDeDato)=>{
    //El usuario escribe una categoría para el dato a registrar e ingresa su monto
    let nuevaCategoria
    let nuevoGasto
    let nuevoIngreso
    let nuevoAhorro

    switch(tipoDeDato) {
        case 1:
            nuevaCategoria = prompt('Escriba la categoría de su gasto')
            nuevoGasto = parseInt(prompt('Escriba el monto de su gasto'))
            categoriasGastos.push(nuevaCategoria)
            gastos.push(nuevoGasto)
            inicializar()
            break
        case 2:
            nuevaCategoria = prompt('Escriba la categoría de su ingreso')
            nuevoIngreso = parseInt(prompt('Escriba el monto de su ingreso'))
            categoriasIngresos.push(nuevaCategoria)
            ingresos.push(nuevoIngreso)
            inicializar()
            break
        case 3:
            nuevoAhorro = parseInt(prompt('Escriba el monto destinado a ahorro'))
            ahorros.push(nuevoAhorro)
            inicializar()
            break
    }
}

const calcularTotales = ()=>{
    // Se calculan los totales sumando cada uno de los arrays
    for (let i = 0; i< gastos.length; i++) {
        totalGastos += gastos[i]        
    }
    for (let i = 0; i< ingresos.length; i++) {
        totalIngresos += ingresos[i]   
    }
    for (let i = 0; i< ahorros.length; i++) {
        totalAhorros += ahorros[i]   
    }
    saldoNeto = totalIngresos - totalGastos - totalAhorros
} 

const finalizar = ()=>{
    //Se muestra un resumen de los datos ingresados
    alert('Usted ha ganado $' + totalIngresos + ' en ' + categoriasIngresos + '\n Usted ha gastado $' + totalGastos + ' en ' + categoriasGastos + '\n Usted ha destinado $' + totalAhorros + ' de su dinero a ahorros')
    alert('Su saldo neto disponible para usar es de ' + saldoNeto)
}

elegirDatoAIngresar()
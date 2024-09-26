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
    guardarCambios()
    guardarHTML()
})


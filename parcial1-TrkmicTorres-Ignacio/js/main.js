/*  
    Instrucciones del Parcial

    - Responde los puntos en orden.
    - Se valorará:
        * Código limpio
        * Comentarios claros
        * Separación en bloques funcionales
        * Buen uso de funciones/modularización

    IMPORTANTE:
    - El trabajo debe desarrollarse utilizando buenas prácticas de programación en JavaScript.
*/

/*  
    Punto 1 _________________________

    Este parcial consiste en crear el frontend de una tienda de frutas.
    Para ello ya se dispone del HTML y deberás programar el JavaScript necesario.

    1. Almacena tus datos personales (nombre, apellido, DNI) en un objeto y:
        - Imprime tu nombre y apellido en la etiqueta del <nav> (donde corresponda).
        - Imprímelo también en la consola.
*/

/*  
    Punto 2 _________________________

    Simula la carga de datos desde un archivo `db.json`. Este debe tener objetos con esta estructura:
    {
        "id": 1,
        "nombre": "arandano",
        "precio": 5000,
        "img": "img/arandano.jpg"
    }
*/

/*  
    Punto 3 _________________________

    Imprime los productos en pantalla al cargar la página.
    Agrega esta funcionalidad dentro de la función `init()`.

    El HTML que debes agregar por cada producto es el siguiente:

        <div class="product-card">
            <img src="ruta" alt="nombre">
            <h3>Nombre del producto</h3>
            <p>$Precio</p>
            <button class="add-to-cart">Agregar a carrito</button>
        </div>
*/

/*  
    Punto 4 _________________________

    Crea la función `filtro()` para filtrar los productos por nombre.
    - Asocia esta función al evento `keyup` de un campo `<input>`.
    - Cada vez que se escriba una letra, deben mostrarse solo los productos que coincidan con el texto ingresado.
*/

/*  
    Punto 5 _________________________

    Agrega la funcionalidad de carrito:
    - Crea un array `carrito` que almacene los productos seleccionados.
    - Al presionar “Agregar a carrito”, el producto debe aparecer en el listado con id `cart-items`.

    El HTML del carrito debe tener el siguiente formato:

        <li class="item-block">
            <p class="item-name">nombreproducto - $precioproducto</p>
            <button class="delete-button">Eliminar</button>
        </li>
*/

/*  
    Punto 6 _________________________

    Guarda los productos del carrito en `localStorage`.
    - Asegúrate de que al recargar la página el carrito se recupere automáticamente desde `localStorage`.
*/

/* Punto 7 _________________________

    Gestión de Cantidades en el Carrito:

    Hasta ahora, cada vez que un usuario agrega un producto al carrito, este aparece como un nuevo elemento, incluso si ya está en la lista. Para optimizar la gestión del carrito, se requiere una mejora fundamental:

    * **Si un producto ya se encuentra en el carrito**, su **cantidad debe incrementarse** en lugar de duplicarlo.
    * La **visualización de los productos en el carrito** debe reflejar esta cantidad (por ejemplo, "Nombre Producto - $Precio x Cantidad").
    * La funcionalidad para **eliminar productos del carrito** debe adaptarse para gestionar estas cantidades: si la cantidad es mayor a uno, debe decrementarse; solo debe eliminarse completamente si su cantidad es uno.
    * **Considerá si es necesario modificar la estructura de tus datos (por ejemplo, en el `db.json`) para facilitar esta funcionalidad.**
*/

/* Punto 8 _________________________

    Cálculo y Visualización del Total del Carrito:

    Para proporcionar una visión clara del costo total de la compra, se necesita implementar un **cálculo dinámico del total del carrito**.

    * Este total debe **actualizarse en tiempo real** cada vez que se agreguen, eliminen o modifiquen cantidades de productos en el carrito.
    * El valor total debe **mostrar el total calculado** en el elemento HTML destinado para ello (por ejemplo, el `div` que ya poseen).
*/

/* Punto 9 _________________________

    Funcionalidad "Vaciar Carrito":

    Ofrece al usuario la comodidad de poder **vaciar todo el carrito** con una sola acción.

    * Implementa un **botón** que, al ser presionado, elimine todos los productos del carrito y reinicie el total.
*/

/* Punto 10 _________________________

    Persistencia Avanzada del Carrito:

    Es crucial que el estado completo del carrito se mantenga incluso después de que el usuario recargue la página.

    * Asegurate de que la **cantidad de cada producto y el total del carrito** se **guarden y recuperen correctamente** desde `localStorage` al cargar la página. La información debe ser persistente en su totalidad.
*/

/* Punto 11 _________________________

    Botón "Finalizar Compra":

    Agrega un botón en la interfaz del carrito que permita al usuario finalizar su compra.

    * Al hacer clic en este botón, debe mostrarse una **alerta** con el mensaje "Tu pedido está siendo procesado".
    * Inmediatamente después de mostrar la alerta, el **carrito debe vaciarse** por completo (tanto visualmente como en `localStorage`).
*/

alumno = {
    nombre: "ignacio",
    apellido: "Trkmic Torres",
    dni: 46948657
};

function datosPersonales(alumno){
    const datoPersonal = document.querySelector(".nombreAlumno");
    
    if(datoPersonal){
        datoPersonal.textContent = `Nombre: ${alumno.nombre} - Apellido: ${alumno.apellido}`;
    }
    console.log(`Nombre: ${alumno.nombre} - Apellido: ${alumno.apellido}`);
}

let productos = [];

function cargarDatos(){
    fetch("data/db.json")
    .then(response => response.json())
    .then(data =>{
        productos = data;
        renderizarProductos(productos);
    })
    .catch(() =>{
        console.error("Hubo un error al cargar los datos!");
    })
}

function renderizarProductos(lista){
    const contenedor = document.querySelector(".product-grid");
    contenedor.textContent = "";
    
    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("product-card");

        div.innerHTML =      `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio.toFixed(2)}</p>
        <button class="add-to-cart"> Agregar a carrito </button>
        `   
        div.querySelector(".add-to-cart").addEventListener("click", () => agregarAlCarrito(producto));
        contenedor.appendChild(div);
    });
}

function filtro(){
    
    document.querySelector(".search-bar").addEventListener("keyup", () => {
        const texto = document.querySelector(".search-bar").value.toLowerCase();
        const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        renderizarProductos(filtrados);
    });
}


let carrito = [];

function agregarAlCarrito(producto){
    const indice = carrito.findIndex(item => item.producto.id === producto.id);
    if(indice !== -1){
        carrito[indice].cantidad++;
    }else{
        carrito.push({producto, cantidad: 1});
    }
    renderizarCarrito();
    guardarCarrito();
}

function eliminarDelCarrito(indice){
    if (carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
    } else {
        carrito.splice(indice, 1);
    }
    renderizarCarrito();
    guardarCarrito();
}

function renderizarCarrito(){
    const contenedor = document.getElementById("cart-items");
    const cantidad = document.getElementById("cart-count");
    const precioTotal = document.getElementById("total-price");

    contenedor.textContent = "";

    if(carrito.length === 0){
        contenedor.innerHTML = "<p> No hay Elementos en el carrito. </p>"
        cantidad.textContent = "0";
        precioTotal.textContent = "$0.00";
        return;
    }

    carrito.forEach((item,indice) =>{
        const li = document.createElement("li");
        li.classList.add("item-block");

        const totalProducto = item.producto.precio * item.cantidad;

        li.innerHTML = `
            <p class="item-name">${item.producto.nombre} x${item.cantidad} - $${totalProducto}</p>
            <button class="delete-button">Eliminar</button>
        `;

        li.querySelector(".delete-button").addEventListener("click", () => eliminarDelCarrito(indice));
        contenedor.appendChild(li);
    });

    const total = carrito.reduce((sum, item) => sum + item.producto.precio * item.cantidad,0);
    cantidad.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    precioTotal.textContent = `$${total.toFixed(2)}`;
}

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function recuperarCarrito(){
    const data = localStorage.getItem("carrito");
    if(data){
        carrito = JSON.parse(data);
        renderizarCarrito();
    }
}

function vaciarCarrito(){
    carrito = [];
    localStorage.removeItem("carrito");
    renderizarCarrito();
}

// ====== Inicialización general ======
function init() {
    datosPersonales(alumno);
    cargarDatos();
    recuperarCarrito();

    const input = document.querySelector(".search-bar");
    if(input){
            input.addEventListener("keyup", filtro);
    }

    const botonVaciar = document.getElementById("delete-button");
    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
    }

    const botonFinalizar = document.querySelector(".end-button");
    if (botonFinalizar) {
        botonFinalizar.addEventListener("click", () =>{
            alert("Tu pedido está siendo procesado")
            vaciarCarrito();
        });
    }
}

init();
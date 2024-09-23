const REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const REGEXSI = /^(si|sí)$/i;

//Funcion constructora Producto
function Producto(nombre, precio) {
  let _nombre = validarNombre(nombre);
  let _precio = validarPrecio(precio);

  this.getNombre = function () {
    return _nombre;
  };

  this.getPrecio = function () {
    return _precio;
  };

  this.setNombre = function (nuevoNombre) {
    _nombre = validarNombre(nuevoNombre);
  };

  this.setPrecio = function (nuevoPrecio) {
    _precio = validarPrecio(nuevoPrecio);
  };
}

//Validaciones para nombre y precio

const validarNombre = (nombre) => {
  if (
    typeof nombre === "string" &&
    REGEX.test(nombre) &&
    nombre.trim() !== ""
  ) {
    return nombre;
  } else {
    throw new Error(
      "Nombre inválido. Debe ser una cadena de caracteres alfabéticos y no vacía."
    );
  }
};

const validarPrecio = (precio) => {
  if (typeof precio === "number" && precio > 0) {
    return precio;
  } else {
    throw new Error("Precio inválido. Debe ser un número mayor a 0.");
  }
};


//Funcion constructora Carrito
function Carrito() {
  let _productos = [];


  // agregar un producto al carrito
  this.agregarProducto = function (producto, cantidad) {
    if (producto instanceof Producto && cantidad > 0) {
      for (let i = 0; i < cantidad; i++) {
        _productos.push(producto);
      }
      alert(
        `Agregado al carrito: ${producto.getNombre()} x ${cantidad} (${formatoMonedaChilena.format(
          producto.getPrecio() * cantidad
        )})`
      );
    } else {
      alert(
        "El producto debe ser una instancia de la clase Producto y la cantidad debe ser mayor a 0."
      );
    }
  };

  // calcular total del carrito
  this.calcularTotal = function () {
    return _productos.reduce(function (acc, producto) {
      return acc + producto.getPrecio();
    }, 0);
  };


  // finalizar la compra
  this.finalizarCompra = function () {
    let total = this.calcularTotal();
    _productos = [];
    return total;
  };


  // mostrar detalles del carrito
  this.mostrarDetalles = function (productosDisponibles) {
    if (_productos.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    let detalles = "Detalles de la compra:\n";
    const conteo = {};
    _productos.forEach((producto) => {
      conteo[producto.getNombre()] = (conteo[producto.getNombre()] || 0) + 1;
    });

    Object.keys(conteo).forEach((nombre) => {
      let cantidad = conteo[nombre];
      const producto = productosDisponibles.find(
        (producto) => producto.getNombre() === nombre
      );
      detalles += `${nombre} - ${formatoMonedaChilena.format(
        producto.getPrecio()
      )} x ${cantidad}\n`;
    });

    detalles += `Total: ${formatoMonedaChilena.format(this.calcularTotal())}`;
    alert(detalles);
  };
}

// Lista de productos disponibles
let productosDisponibles = [
  new Producto("Leche", 1000),
  new Producto("Pan de Molde", 2000),
  new Producto("Queso", 1200),
  new Producto("Mermelada", 890),
  new Producto("Azúcar", 1300),
];

//Formateador para la moneda chilena
const formatoMonedaChilena = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});


// Función para ingresar un producto y cantidad

function ingresarProducto() {
    let seleccion = 0;
    while (true) {
      const opciones = productosDisponibles
        .map(
          (producto, index) =>
            `${index + 1}: ${producto.getNombre()} ${formatoMonedaChilena.format(
              producto.getPrecio()
            )}`
        )
        .join("\n");
      seleccion = parseInt(prompt(`Productos Disponibles:\n${opciones}`));
  
      if (
        !isNaN(seleccion) &&
        seleccion >= 1 &&
        seleccion <= productosDisponibles.length
      ) {
        break;
      } else {
        alert("Selección inválida. Inténtelo de nuevo.");
      }
    }
  
    let cantidad = 0;
    while (true) {
      cantidad = parseInt(prompt("Ingrese la cantidad del producto (máximo 10):"));
  
      if (!isNaN(cantidad) && cantidad > 0 && cantidad <= 10) {
        break;
      } else {
        alert("Cantidad inválida. Debe ser un número entre 1 y 10.");
      }
    }
  
    return { producto: productosDisponibles[seleccion - 1], cantidad };
  }
  
  function gestionarCarrito() {
    const carrito = new Carrito();
    let continuar = true;
  
    while (continuar) {
      const { producto, cantidad } = ingresarProducto();
      carrito.agregarProducto(producto, cantidad);
  
      alert(
        `Total actual de la compra: ${formatoMonedaChilena.format(
          carrito.calcularTotal()
        )}`
      );
  
      let respuesta;
      while (true) {
        respuesta = prompt("¿Desea agregar otro producto? Si/No").toLocaleLowerCase();
        if (REGEXSI.test(respuesta)) {
          continuar = true;
          break;
        } else if (respuesta === 'no') {
          continuar = false;
          break;
        } else {
          alert("Respuesta inválida. Por favor, responda 'Si' o 'No'.");
        }
      }
    }
    
    carrito.mostrarDetalles(productosDisponibles);
  
    const confirmarFinalizar = confirm("¿Desea finalizar la compra?");
    if (confirmarFinalizar) {
      const total = carrito.finalizarCompra();
      alert(
        `Compra finalizada. Total a pagar: ${formatoMonedaChilena.format(total)}`
      );
    } else {
      alert("Compra cancelada.");
    }
  }
  gestionarCarrito();
  

/*
  function gestionarCarrito() {
  const carrito = new Carrito();
  let continuar = true;

  while (continuar) {
    const { producto, cantidad } = ingresarProducto();
    carrito.agregarProducto(producto, cantidad);

    alert(
      `Total actual de la compra: ${formatoMonedaChilena.format(
        carrito.calcularTotal()
      )}`
    );

    //continuar = confirm("¿Desea agregar otro producto?");
   
    continuar = prompt("¿Desea agregar otro producto? Si/No").toLocaleLowerCase() === 'si';

  }
  carrito.mostrarDetalles(productosDisponibles);

  const confirmarFinalizar = confirm("¿Desea finalizar la compra?");
  if (confirmarFinalizar) {
    const total = carrito.finalizarCompra();
    alert(
      `Compra finalizada. Total a pagar: ${formatoMonedaChilena.format(total)}`
    );
  } else {
    alert("Compra cancelada.");
  }
}
gestionarCarrito();
*/
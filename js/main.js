//Primera parte del proyecto preguntar nombre y mostrarlo en un Alert
// function askName() {
//     let nombre = prompt("¿Cual es tu nombre?");
//     return nombre
// }

// function printName() {
//     let nombre = askName();
//     alert(`Saludos! ${nombre} un gusto tenerte a bordo!`)
// }

// printName();

// =============================================================================
// Variables globales
// =============================================================================

const $ = document.querySelector.bind(document);
const carrito = $("#carrito");
const contenedorCarrito = $("#lista-carrito tbody");
const listaCursos = $("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
  //Agrega un curso cuando apretas agregar al carrito
  listaCursos.addEventListener("click", agregarCurso);
  //Elimina un curso no deseado
  carrito.addEventListener("click", eliminarCurso);

  window.addEventListener("scroll", stickyElement);

  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carritoHTML();
  });
}

// =============================================================================
// Funciones
// =============================================================================

// function stickyElement(e) {
//   var header = document.querySelector(".container");
//   var headerHeight = getComputedStyle(header).height.split("px")[0];
//   var navbar = document.querySelector(".navigation");
//   var scrollValue = window.scrollY;

//   console.log("headerHeight", headerHeight);

//   if (scrollValue > headerHeight) {
//     navbar.classList.add("is-fixed");
//   } else if (scrollValue < headerHeight) {
//     navbar.classList.remove("is-fixed");
//   }
// }

function stickyElement(e) {
  const navbar = $("#headfix");
  const navbarHeight = getComputedStyle(navbar).height.split("px")[0];
  const scrollValue = window.scrollY;

  if (scrollValue > navbarHeight) {
    navbar.classList.add("is-fixed");
  } else if (scrollValue < navbarHeight) {
    navbar.classList.remove("is-fixed");
  }
}

function eliminarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML();
  }
}

function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

//Lee el HTML  y extrae el curso que le des click

function leerDatosCurso(curso) {
  //Crear  un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio").textContent.replace("$", ""),
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  //Revisa si un elemento ya existe en el carrito
  const siExiste = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (siExiste) {
    //actualiza la cantidad
    const cursos = articulosCarrito.forEach((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    });
  } else {
    //sino agrega el objeto al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  carritoHTML();
}

//imprime carrito en el HTML

function carritoHTML() {
  //limpia html antes de imprimir
  limpiarHTML();
  let totalCarrito = 0.0;
  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    const total = curso.precio * curso.cantidad;
    const { imagen, titulo, precio, cantidad, id } = curso;
    row.innerHTML = `
            <td><img src="${imagen}"</td>
            <td>${titulo}</td>
            <td>$${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X </a>
            </td>
            <td>
            $${total}
            </td>
            `;
    //agrega el HTML del carrito
    totalCarrito += total;
    contenedorCarrito.appendChild(row);
  });
  $("#totalCarrito").textContent = `$ ${totalCarrito.toFixed(2)}`;
  //agregar local storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Itera sobre el padre y va borrando los hijos 1 a 1 para luego imprimir
function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

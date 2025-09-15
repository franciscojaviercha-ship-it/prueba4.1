// ------ Carrusel promociones ------
const promoImgs = [
  "promociones/promo1.jpg",
  "promociones/promo2.jpg",
  "promociones/promo3.jpg",
  "promociones/promo4.jpg",
  "promociones/promo5.jpg",
  "promociones/promo6.jpg"
];
let carruselIndex = 0;
function mostrarCarrusel() {
  const img = document.getElementById("carrusel-img");
  img.style.opacity = 0.1;
  setTimeout(() => {
    img.src = promoImgs[carruselIndex];
    img.style.opacity = 1;
  }, 600);
}
setInterval(() => {
  carruselIndex = (carruselIndex + 1) % promoImgs.length;
  mostrarCarrusel();
}, 5000);
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrusel();
  renderizarRecetas();
});

// ------ Tabs ------
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ------ Productos CRUD ------
function obtenerProductos() {
  return JSON.parse(localStorage.getItem('productosKetzal') || '[]');
}
function guardarProductos(productos) {
  localStorage.setItem('productosKetzal', JSON.stringify(productos));
}
function renderizarProductos(filtro = "") {
  const productos = obtenerProductos();
  const categorias = {};
  productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase())).forEach(p => {
    if (!categorias[p.categoria]) categorias[p.categoria] = [];
    categorias[p.categoria].push(p);
  });
  const contenedor = document.getElementById('productos-categorias');
  contenedor.innerHTML = '';
  Object.entries(categorias).forEach(([cat, items]) => {
    const div = document.createElement('div');
    div.className = 'categoria';
    div.innerHTML = `<h3>${cat}</h3>`;
    const ul = document.createElement('ul');
    items.forEach(producto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>
          ${producto.nombre} - $${Number(producto.precio).toFixed(2)}
        </span>
        <span class="acciones">
          <button onclick="editarProducto('${producto.id}')">Editar</button>
          <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
          <button onclick="agregarAlCarrito('${producto.id}')">🛒</button>
        </span>
      `;
      ul.appendChild(li);
    });
    div.appendChild(ul);
    contenedor.appendChild(div);
  });
}
function editarProducto(id) {
  const productos = obtenerProductos();
  const prod = productos.find(p => p.id === id);
  if (!prod) return;
  document.getElementById('categoria').value = prod.categoria;
  document.getElementById('nombre').value = prod.nombre;
  document.getElementById('precio').value = prod.precio;
  document.getElementById('producto-id').value = prod.id;
}
function eliminarProducto(id) {
  let productos = obtenerProductos();
  productos = productos.filter(p => p.id !== id);
  guardarProductos(productos);
  renderizarProductos();
}
document.getElementById('form-producto').addEventListener('submit', function(e) {
  e.preventDefault();
  const categoria = document.getElementById('categoria').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const precio = document.getElementById('precio').value;
  const id = document.getElementById('producto-id').value;
  let productos = obtenerProductos();
  if (id) {
    productos = productos.map(p => 
      p.id === id ? { ...p, categoria, nombre, precio } : p
    );
  } else {
    productos.push({
      id: Math.random().toString(36).substr(2, 9),
      categoria,
      nombre,
      precio
    });
  }
  guardarProductos(productos);
  renderizarProductos();
  this.reset();
  document.getElementById('producto-id').value = '';
});
renderizarProductos();

// ------ Busqueda ------
document.getElementById('busqueda-btn').addEventListener('click', function() {
  const filtro = document.getElementById('busqueda-input').value;
  renderizarProductos(filtro);
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-productos').classList.add('active');
  document.querySelector('button[data-tab="productos"]').classList.add('active');
});

// ------ Carrito de compras ------
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carritoKetzal') || '[]');
}
function guardarCarrito(carrito) {
  localStorage.setItem('carritoKetzal', JSON.stringify(carrito));
  document.getElementById('carrito-contador').textContent = carrito.length;
}
function agregarAlCarrito(id) {
  const productos = obtenerProductos();
  const prod = productos.find(p => p.id === id);
  if (!prod) return;
  let carrito = obtenerCarrito();
  carrito.push(prod);
  guardarCarrito(carrito);
}
guardarCarrito(obtenerCarrito());

document.getElementById('carrito-btn').addEventListener('click', function() {
  const modal = document.getElementById('modal-carrito');
  const lista = document.getElementById('carrito-lista');
  const total = document.getElementById('carrito-total');
  let carrito = obtenerCarrito();
  lista.innerHTML = '';
  let suma = 0;
  carrito.forEach((prod, idx) => {
    suma += Number(prod.precio);
    const li = document.createElement('li');
    li.innerHTML = `${prod.nombre} - $${Number(prod.precio).toFixed(2)} <button onclick="eliminarDelCarrito(${idx})">Quitar</button>`;
    lista.appendChild(li);
  });
  total.textContent = "Total: $" + suma.toFixed(2);
  document.getElementById('pagar-btn').style.display = carrito.length > 0 ? "inline-block" : "none";
  modal.style.display = "flex";
});
document.getElementById('cerrar-carrito').onclick = function() {
  document.getElementById('modal-carrito').style.display = "none";
};
function eliminarDelCarrito(idx) {
  let carrito = obtenerCarrito();
  carrito.splice(idx, 1);
  guardarCarrito(carrito);
  document.getElementById('modal-carrito').style.display = "none";
}

// ------ Simulación de pago ------
document.getElementById('pagar-btn').onclick = function() {
  let carrito = obtenerCarrito();
  if (carrito.length === 0) return;
  alert("¡Pago realizado con éxito!\nGracias por tu compra.");
  guardarCarrito([]);
  document.getElementById('modal-carrito').style.display = "none";
  guardarCarrito([]);
  document.getElementById('carrito-contador').textContent = "0";
};

// ------ Recetas ------
const recetas = [
  {
    nombre: "Agua Fresca de Limón",
    imagen: "recetas/agua-limon.jpg",
    ingredientes: [
      "4 limones",
      "1 litro de agua",
      "Azúcar al gusto",
      "Hielo"
    ],
    pasos: [
      "Exprimir los limones.",
      "Mezclar el jugo con agua y azúcar.",
      "Agregar hielo y servir frío."
    ]
  },
  {
    nombre: "Sándwich de Jamón y Queso",
    imagen: "recetas/sandwich.jpg",
    ingredientes: [
      "2 rebanadas de pan",
      "1 rebanada de jamón",
      "1 rebanada de queso",
      "Mayonesa"
    ],
    pasos: [
      "Untar mayonesa en el pan.",
      "Agregar jamón y queso.",
      "Cerrar y servir."
    ]
  },
  {
    nombre: "Ensalada de Atún",
    imagen: "recetas/ensalada-atun.jpg",
    ingredientes: [
      "1 lata de atún",
      "Lechuga",
      "Tomate",
      "Mayonesa"
    ],
    pasos: [
      "Mezclar el atún con mayonesa.",
      "Agregar lechuga y tomate picados.",
      "Servir frío."
    ]
  },
  {
    nombre: "Huevos a la Mexicana",
    imagen: "recetas/huevos-mexicana.jpg",
    ingredientes: [
      "2 huevos",
      "1 jitomate",
      "1/4 cebolla",
      "1 chile verde",
      "Aceite"
    ],
    pasos: [
      "Picar jitomate, cebolla y chile.",
      "Freír las verduras en aceite.",
      "Agregar los huevos y cocinar."
    ]
  },
  {
    nombre: "Quesadillas",
    imagen: "recetas/quesadillas.jpg",
    ingredientes: [
      "2 tortillas",
      "Queso Oaxaca",
      "Aceite"
    ],
    pasos: [
      "Rellenar las tortillas con queso.",
      "Cocinar en sartén con poco aceite.",
      "Servir calientes."
    ]
  }
];

function renderizarRecetas() {
  const cont = document.getElementById('recetas-lista');
  if (!cont) return;
  cont.innerHTML = '';
  recetas.forEach(r => {
    const div = document.createElement('div');
    div.className = 'receta-card';
    div.innerHTML = `
      <h3>${r.nombre}</h3>
      <img src="${r.imagen}" alt="${r.nombre}" class="img-receta" />
      <strong>Ingredientes:</strong>
      <ul>${r.ingredientes.map(i => `<li>${i}</li>`).join('')}</ul>
      <strong>Preparación:</strong>
      <ol>${r.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
    `;
    cont.appendChild(div);
  });
}
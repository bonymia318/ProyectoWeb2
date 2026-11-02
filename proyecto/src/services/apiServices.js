const URL_BASE = "https://dummyjson.com";

// Convierte un producto de la API (en inglés) al formato de nuestra app
function adaptarProducto(producto) {
    return {
        id: producto.id,
        nombre: producto.title,
        descripcion: producto.description,
        categoria: producto.category,
        marca: producto.brand,
        precio: producto.price,
        descuento: producto.discountPercentage,
        calificacion: producto.rating,
        stock: producto.stock,
        imagen: producto.thumbnail,
        imagenes: producto.images,
        resenas: producto.reviews
    };
}

// Hace la petición y lanza un error si la respuesta no es exitosa
async function obtenerDatos(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al consultar la API`);
    }

    return respuesta.json();
}

// Lista de categorías con el formato { slug, nombre }
export async function obtenerCategorias() {
    const categorias = await obtenerDatos(`${URL_BASE}/products/categories`);

    return categorias.map(function (categoria) {
        return {
            slug: categoria.slug,
            nombre: categoria.name
        };
    });
}

// Sin búsqueda la API pagina, filtra por categoría y ordena.
// Con búsqueda se piden todos los resultados y se filtran, ordenan
// y paginan aquí, porque /products/search no combina estas opciones.
export async function obtenerProductos({
    busqueda = "",
    categoria = "",
    limite = 12,
    saltar = 0,
    ordenarPor = "title",
    orden = "asc"
} = {}) {
    const textoBusqueda = busqueda.trim();
    const hayBusqueda = textoBusqueda !== "";

    // limit=0 en la API significa "sin límite"
    let limiteApi = limite;
    let saltarApi = saltar;
    if (hayBusqueda) {
        limiteApi = 0;
        saltarApi = 0;
    }

    const parametros = new URLSearchParams({
        limit: String(limiteApi),
        skip: String(saltarApi),
        sortBy: ordenarPor,
        order: orden
    });

    // Se elige la ruta según lo que pidió el usuario
    let ruta = "/products";
    if (hayBusqueda) {
        parametros.set("q", textoBusqueda);
        ruta = "/products/search";
    } else if (categoria) {
        ruta = `/products/category/${encodeURIComponent(categoria)}`;
    }

    const datos = await obtenerDatos(`${URL_BASE}${ruta}?${parametros.toString()}`);
    let productos = datos.products.map(adaptarProducto);

    if (hayBusqueda) {
        if (categoria) {
            productos = productos.filter(function (producto) {
                return producto.categoria === categoria;
            });
        }

        productos.sort(function (a, b) {
            // En el adaptador el título se llama "nombre" y el precio "precio"
            let campo = "nombre";
            if (ordenarPor === "price") {
                campo = "precio";
            }

            const valorA = a[campo];
            const valorB = b[campo];

            let comparacion = 0;
            if (typeof valorA === "string") {
                comparacion = valorA.localeCompare(valorB, "es", { sensitivity: "base" });
            } else {
                comparacion = valorA - valorB;
            }

            if (orden === "desc") {
                return -comparacion;
            }
            return comparacion;
        });

        return {
            productos: productos.slice(saltar, saltar + limite),
            total: productos.length
        };
    }

    return {
        productos,
        total: datos.total
    };
}

// Un solo producto por su id (para la página de detalle)
export async function obtenerProductoPorId(id) {
    const producto = await obtenerDatos(
        `${URL_BASE}/products/${encodeURIComponent(id)}`
    );

    return adaptarProducto(producto);
}
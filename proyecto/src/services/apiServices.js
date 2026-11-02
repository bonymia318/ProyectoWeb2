const URL_BASE = "https://dummyjson.com";

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

async function obtenerDatos(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al consultar la API`);
    }

    return respuesta.json();
}

export async function obtenerCategorias() {
    const categorias = await obtenerDatos(`${URL_BASE}/products/categories`);

    return categorias.map(function (categoria) {
        return {
            slug: categoria.slug,
            nombre: categoria.name
        };
    });
}

export async function obtenerProductos({
    busqueda = "",
    categoria = "",
    limite = 12,
    saltar = 0,
    ordenarPor = "title",
    orden = "asc"
} = {}) {
    const parametros = new URLSearchParams({
        limit: String(busqueda.trim() ? 0 : limite),
        skip: String(busqueda.trim() ? 0 : saltar),
        sortBy: ordenarPor,
        order: orden
    });

    let ruta;
    if (busqueda.trim()) {
        parametros.set("q", busqueda.trim());
        ruta = "/products/search";
    } else {
        ruta = categoria
            ? `/products/category/${encodeURIComponent(categoria)}`
            : "/products";
    }

    const datos = await obtenerDatos(`${URL_BASE}${ruta}?${parametros.toString()}`);
    let productos = datos.products.map(adaptarProducto);

    if (busqueda.trim()) {
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

export async function obtenerProductoPorId(id) {
    const producto = await obtenerDatos(
        `${URL_BASE}/products/${encodeURIComponent(id)}`
    );

    return adaptarProducto(producto);
}
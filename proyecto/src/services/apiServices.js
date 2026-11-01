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
    categoria = "",
    limite = 12,
    saltar = 0,
    ordenarPor = "title",
    orden = "asc"
} = {}) {
    const ruta = categoria
        ? `/products/category/${encodeURIComponent(categoria)}`
        : "/products";

    const parametros = new URLSearchParams({
        limit: String(limite),
        skip: String(saltar),
        sortBy: ordenarPor,
        order: orden
    });

    const datos = await obtenerDatos(
        `${URL_BASE}${ruta}?${parametros.toString()}`
    );

    return {
        productos: datos.products.map(adaptarProducto),
        total: datos.total
    };
}

export async function obtenerProductoPorId(id) {
    const producto = await obtenerDatos(
        `${URL_BASE}/products/${encodeURIComponent(id)}`
    );

    return adaptarProducto(producto);
}
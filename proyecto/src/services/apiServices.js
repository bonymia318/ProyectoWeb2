const URL_BASE = "https://dummyjson.com";

function adaptarProducto(p) {
    return {
        id: p.id,
        nombre: p.title,
        descripcion: p.description,
        categoria: p.category,
        marca: p.brand,
        precio: p.price,
        descuento: p.discountPercentage,
        calificacion: p.rating,
        stock: p.stock,
        imagen: p.thumbnail,
        imagenes: p.images,
        resenas: p.reviews
    };
}

export async function obtenerProductos(limite, saltar) {
    const url = URL_BASE + "/products?limit=" + limite + "&skip=" + saltar;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status + " al obtener los productos");
    }

    const datos = await respuesta.json();
    return datos.products.map(adaptarProducto);
}
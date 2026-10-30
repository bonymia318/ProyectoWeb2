const URL_API = "https://dummyjson.com/products";

function getProducts(p) {
    return {
        id: p.id,
        nombre: p.title,
        descripcion: p.description,
        categoria: p.category,
        precio: p.price,
        porcentaje: p.discountPercentage,
        raiting: p.rating,
        stock: p.stock,
        imagen: p.images[0]
    }
}

export async function obtenerProducto(){
    const respuesta = await fetch(URL_API);

    if(!respuesta.ok){
        throw new Error(`Error ${respuesta.status} al obtener los Productos`);
    }

    const datos = await respuesta.json();

    return datos.products.map(getProducts);
}
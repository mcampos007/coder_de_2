// Entrega nª2  Curso Backend - CoderHouse 
// Comisión : CH-55610
// Alumno: Mario Campos
// email: mcampos@infocam.com.ar
// Fecha Límite de entrega : 08/11/2023

// Clase para la Gestión de Productos
const fs = require("fs");

class ProductManager{
    constructor(path){
        this.path = path;   //Ruta y nombre del archivo
        if (fs.existsSync(this.path)){
            try{
                let products = fs.readFileSync(this.path, "utf-8");
                this.products = JSON.parse(products);
            }
            catch(error){
                console.log(`${error} Error al leer el archivo JSON`);
                this.products = [];
            }
        }else{
            console.log(`No existe el archivo de datos`);
            this.products = [];
        }        
    }

    // Método para recuperar los productos
    getProducts(){
        if (fs.existsSync(this.path)){
            try{
                let products = fs.readFileSync(this.path,"utf-8");
                this.products = JSON.parse(products);
            }
            catch(error){
                console.log(`${error} Error al recuperar los productos`);
                this.products = [];
            }
        }else{
            console.log(`No existe el archivo de datos`);
            this.products = [];
        }

        return this.products;
    }

    //Recuperar un producto a partir de su id
    getProductById(idProducto){
        this.products = productos.getProducts();
        //const producto = this.products.find((producto =>producto.id===idProducto));
        const producto = this.products.find((producto =>producto.id===idProducto));
        if (!producto){
           // console.log("Not found");
            return false;
        }else{
            return producto;
        }
    }

    //Método para agregar un producto al arreglo y posterior persistencia en archivo
    async addProduct(producto){
        const lcMsg = "";
        const existeCode = this.validarCode(producto.code); 
        const productoValido = this.validarProducto(
            producto.title, 
            producto.description,
            producto.price,
            producto.thumbnail,
            producto.code,
            producto.stock
            );    
       if (existeCode === false){
            if (productoValido){
                producto.id= this.generaId();
                this.products.push(producto);
                const respuesta = await this.fileSave(this.products);
                if (respuesta){
                    console.log("El Producto se ha registrado correctamente.");
                }else{
                    console.log("Hubo un error al agregar el producto");
                }

            }else {
                console.log("Algunos datos no son correctos . No se puede registrar el producto!.");
              } 
       }else{
        console.log(`No se agregó el producto solicitado porque ya existe un producto con code ${producto.code}`);
       }
    }

    async fileSave(data){
        console.log("Datos a Grbar");
       console.log(data);
        try{
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(data,null,"\t"));
                return true;
        }
        catch(error){
            console.log(error);
            return false;

        }
    }

    async updateProduct(product){
        console.log("*****    Actualizar Producto     *****");
        console.log(product);
        console.log(this.products);
        const respuesta = await this.fileSave(this.products);
        if (respuesta){
            console.log("Se actualizó el archivo de productos.");
        }else{
            console.log("Hubo un error al actualizar el producto");
        }
        
    }

    async deleteProduct(id){
       // console.log( this.products);
        this.products = this.products.filter((objeto) => objeto.id !== id);
       // console.log( this.products);
        const respuesta = await this.fileSave(this.products);
        if (respuesta){
           // console.log("El Producto ha registrado eliminado.");
            return true;
        }else{
            return false;
            //console.log("Hubo un error al eliminar el producto");
        }

    }

    // Validar existencia de códe, devuelve true si ya existe o false si no existe
    validarCode(idCode){
        const producto = this.products.find((producto) => producto.code === idCode);  
       // console.log(producto);
        if (!producto){
            return false;
        }
    }

    validarProducto(lcTitle, lcDescription, lnPrice, lctumbnail, lcCode, lnStock) {
        if (typeof lcTitle === 'string' && lcTitle.length > 0 &&
            typeof lcDescription === 'string' && lcDescription.length > 0 &&
            typeof lnPrice === 'number' && lnPrice > 0 &&
            typeof lctumbnail === 'string' && lctumbnail.length > 0 &&
            typeof lcCode === 'string' && lcCode.length > 0 &&
            typeof lnStock === 'number' && lnStock >= 0) {
          return true;
        } else {
          return false;
        }
      }

    // Generar ID único
    generaId(){
        this.products = productos.getProducts();
        if (this.products.length ===0){
            return 1;
        }else{
            return this.products[this.products.length-1].id + 1;
        }
    }
}

class Producto {
    constructor(
        title,          //(nombre del producto)
        description,    // (descripción del producto)
        price,          // (precio)
        thumbnail,      // (ruta de imagen)
        code,           // (código identificador)
        stock          // (número de piezas disponibles)
    ){
        this.title = title;          
        this.description = description;    
        this.price = price;          
        this.thumbnail = thumbnail;      
        this.code = code;           
        this.stock = stock;         
    }
}

// Testing
console.log("Instanciando la Clase ProductoManager");
console.log("*************************************");
const productos = new ProductManager("./productos.json");
//console.log(productos);
console.log("Agregar un Producto ");
console.log("*******************");
productos.addProduct(new Producto("Nafta Super", "Producto de 95 Octanos", 488.50,"img001", "01-01",15000));
//console.log(productos);
console.log("Agregar un Segundo Producto ");
console.log("*******************");
productos.addProduct(new Producto("Nafta Quantium", "Producto de 98 Octanos", 504.50,"img002", "01-02",20000));
//console.log(productos);
console.log("Agregar un Tercer Producto, debería dar error por dupicidad de la propiedad code ");
console.log("********************************************************************************");
productos.addProduct(new Producto("Nafta Quantium", "Producto de 98 Octanos", 504.50,"img002", "01-02",20000));
//console.log(productos);
console.log("Agregar un Tercer Producto, Se corrige el error del test anterior ");
console.log("********************************************************************************");
productos.addProduct(new Producto("Nafta Quantium", "Producto de 98 Octanos", 504.50,"img002", "01-03",20000));
/*console.log(productos);

console.log("Mostrar el producto con Id 3");
console.log("****************************");
const productoamodificar = productos.getProductById(3);
if (productoamodificar){
    console.log(productoamodificar);

    productoamodificar.title = "Quantium Diesel";
    productoamodificar.description = "Producto de 98 Octanos";
    productoamodificar.thumbnail = "img005";
    productoamodificar.price = 499;
    //productoamodificar.code = "01-03"; No se debe cambiar
    productoamodificar.stock = 15000;
    //productoamodificar.id = 3; No se debe cambiar
    const prodmodificado = productos.updateProduct(productoamodificar);    
}
else{
    console.log("No existe el producto a modificar");
}

// eliminar un producto
const productoeliminado = productos.deleteProduct(3);
if (productoeliminado === true){
    console.log("El producto ha sido eliminado");
}
else{
    console.log("No existe el producto a eliminar");
}*/
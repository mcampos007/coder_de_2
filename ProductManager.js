const fs = require("fs");

class ProductManager{
    constructor(path){
        this.path = path;
        if (fs.existsSync(this.path)) {
            try {
              let products = fs.readFileSync(this.path, "utf-8");
              this.products = JSON.parse(products);
            } catch (error) {
              this.products = [];
            }
          } else {
            this.products = [];
          }
    }

    async saveFile(data) {
        try {
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(data, null, "\t")
          );
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }

    //Agrgar un producto
    async addProduct(product) {
        if (this.validarCode(product.code)){
            console.log(`No se puede agregar el producto, ya existe un producto con el código ${product.code}`);
            return; // 
        }
        product.id= this.generaId();
        this.products.push(product);
        const respuesta = await this.saveFile(this.products);
        if (respuesta) {
            console.log("Producto creado");
            } else {
            console.log("Hubo un error al crear un Product");
            }
        }

    // Método para actualizar un producto existente
    async updateProduct(id, updatedProduct) {
        //const productToUpdate = this.products.find((product) => product.id === id);
        const index = this.products.findIndex((product) => product.id === id);
        if (index === -1){
            console.log("Producto no encontrado.");
             return;
        }
        this.products[index] = { ...this.products[index], ...updatedProduct };
        const respuesta = await this.saveFile(this.products);

        if (respuesta) {
            console.log("Producto actualizado correctamente.");
        } else {
            console.log("Hubo un error al actualizar el producto.");
        }
      }

      async deleteProduct(id){
        const producto = this.products.find((p) => p.id == id);
        if (producto){
            const productosSinEliminar = this.products.filter((p) => p.id != id);

            const respuesta = await this.saveFile(productosSinEliminar);

            if (respuesta) {
                console.log("Producto eliminado correctamente.");
            } else {
                console.log("Hubo un error al eliminar el producto.");
            }
        }else{
            console.log("No existe el producto a eliminar");
            return false;
        }
      }
    
      // REcuperar los productos
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
       this.products = this.getProducts();
        //const producto = this.products.find((producto =>producto.id===idProducto));
        const producto = this.products.find((producto =>producto.id===idProducto));
        if (!producto){
           console.log("Not found");
            return false;
        }else{
            //console.log(producto);
            return producto;
        }
    }

      // Generar ID único
    generaId(){
        this.products = this.getProducts();
        if (this.products.length ===0){
            return 1;
        }else{
            return this.products[this.products.length-1].id + 1;
        }
    }

    // Validar existencia de códe, devuelve true si ya existe o false si no existe
    validarCode(idCode){
        const product = this.products.find((product) => product.code === idCode);  
       // console.log(producto);
        if (!product){
            return false;
        }else{
            return true;
        }
    }
}

class Producto{
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
 async function Testing(){
    const productos = new ProductManager("./productos.json");     
    
    //Alta de Productos
    await productos.addProduct(new Producto("Nafta Super", "Producto de 95 Octanos", 488.50,"img001", "01-01",15000));
    await productos.addProduct(new Producto("Nafta Quantium", "Producto de 98 Octanos", 588.50,"img002", "01-02",25000));
    await productos.addProduct(new Producto("Quantium Diesel", "Producto de 100 Octanos", 750.50,"img003", "01-03",10000));
    await productos.addProduct(new Producto("To deleted", "Producto a eliminar", 750.50,"img003", "01-04",1));

    //Consulta de todos los productos
    const misproductos = productos.getProducts();
    console.log("Productos: ->");
    console.log(productos);
    console.log("***************");

    //consulta de productos por Id
    const producto1 = productos.getProductById(1);
    console.log(producto1);

    const producto5 = productos.getProductById(5);
    console.log(producto5);

    //Modificacion de un producto
    const updatedData = {
        title: "Nuevo producto",
        price: 599.99,
        stock: 20000,
      };
    
    await productos.updateProduct(2,updatedData);

    const producto2 = productos.getProductById(2);
    console.log(producto2);

      //Eliminación de un producto

    await productos.deleteProduct(4);
 }

 Testing();

//Testing data 4
/*
const productos = new ProductManager("./productos.json");
const misproductos = productos.getProducts();
console.log("Productos: ->");
console.log(productos);
console.log("***************");
const producto1 = productos.getProductById(1);
const producto2 = productos.getProductById(2);
const producto3 = productos.getProductById(3);
console.log("Productos por ID: ->1");
console.log(producto1);
console.log("Productos por ID: ->2");
console.log(producto2);
console.log("Productos por ID: ->3");
console.log(producto3);
*/
//* Testing data 5
/*const productos = new ProductManager("./productos.json");
const updatedData = {
    title: "Nuevo producto",
    price: 599.99,
    stock: 20000,
  };
const producto = productos.getProductById(2);
console.log("Producto antes de actualizar");
console.log(producto);

const actualizado = productos.updateProduct(2,updatedData);
*/
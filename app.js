/*
API con NODEJS conectada a una BD MYSQL

primero por terminal:

***creacion proyecto con gestor de paquetes "npm"

npm init -y

***instalacion de modulos

npm install express --save

npm install mysql


***a lo ultimo instalacion de modulo

npm install cors

*/
var express= require('express');
var mysql= require('mysql');
var cors= require('cors');

var app = express();
app.use(express.json());
app.use(cors());

//ESTABLECE PARAMETROS DE CONEXION
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
});

//PRUEBA DE LA CONEXION
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

//RUTA DE PRUEBA
app.get('/', function(req,res){
    res.send('Ruta INICIO');
})

//MOSTRAR TODOS LOS ARTICULSO
app.get('/api/articulos', (req,res)=>{
    conexion.query('SELECT * FROM articulos', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//MOSTRAR UN SOLO ARTICULO
app.get('/api/articulos/:id', (req,res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
            //res.send(fila[0].descripcion);
        }
    })
});

//COMO CREAR UN ARTICULO
app.post('/api/articulos/', (req,res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//EDITAR ARTICULOS
app.put('/api/articulos/:id', (req,res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

//ELIMINAR ARTICULO
app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query("DELETE FROM articulos WHERE id = ?", [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto);
});
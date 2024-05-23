import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import {DB_HOST,DB_DATABASE,DB_PORT,URL} from './config.js'
import rutasMedicamentos from './Routes/Medicamentos.routes.js'
import rutasAuth from './Routes/Auth.routes.js'
//const conexion = 'mongodb://'+DB_HOST+':'+DB_PORT+'/'+DB_DATABASE
mongoose.connect(URL).then()

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(rutasMedicamentos)
app.use(rutasAuth)

app.use((req, res) => {
    res.status(404).json({status:false,errors:'Not found'})
} )
//app.get('/', (req,res) => { res.send('Hola mundo')})
export default app
import {Router} from 'express'
import { getMedicamentos,saveMedicamento,updateMedicamento,deleteMedicamento } from '../Controllers/MedicamentosController.js'
import { subirImagen } from '../Middleware/Storage.js'
import { verificar } from '../Middleware/Auth.js'
const rutas = Router()

rutas.get('/api/medicamentos',verificar,getMedicamentos)
rutas.get('/api/medicamentos/:id', getMedicamentos)
rutas.post('/api/medicamentos', subirImagen.single('imagen'), saveMedicamento)
rutas.put('/api/medicamentos/:id', subirImagen.single('imagen'), updateMedicamento)
rutas.delete('/api/medicamentos/:id', deleteMedicamento)
export default rutas


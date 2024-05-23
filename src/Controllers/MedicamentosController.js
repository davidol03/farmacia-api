import mongoose from "mongoose"
import * as fs from 'fs'

const esquema = new mongoose.Schema({
    nombre: String, descripcion: String, precio: Number, laboratorio: String, imagen: String,fecha_caducidad: Date
},{versionKey:false})
const MedicamentoModel = new mongoose.model('medicamentos',esquema)

export const getMedicamentos = async(req,res) =>{
    try{
        const {id} = req.params
        const rows =
        (id === undefined) ? await MedicamentoModel.find() : await MedicamentoModel.findById(id)
        return res.status(200).json({status:true,data:rows})
    }
    catch(error) {
        return res.status(500).json({status:false,errors:[error]})
    }
}

export const saveMedicamento = async(req, res) =>{
    try{
        const {nombre,descripcion,precio,laboratorio,fecha_caducidad} = req.body
        const validacion = validar(nombre,descripcion,precio,laboratorio,fecha_caducidad,req.file,'Y')
        if(validacion == ''){
            const nuevoMedicamento = new MedicamentoModel({
                nombre:nombre,descripcion:descripcion,precio:precio,laboratorio:laboratorio,fecha_caducidad:fecha_caducidad,
                imagen:'/uploads/'+req.file.filename
            })
            return await nuevoMedicamento.save().then(
                () => { res.status(200).json({status:true,message:'Medicamento guardado'}) }
            )
        }
        else{
            return res.status(400).json({status:false,errors:validacion})
        }
    }
    catch(error) {
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

export const updateMedicamento = async(req, res) =>{
    try{
        const{id} = req.params
        const {nombre,descripcion,precio,laboratorio,fecha_caducidad} = req.body
        let imagen = ''
        let valores = { nombre:nombre,descripcion:descripcion,precio:precio,laboratorio:laboratorio,fecha_caducidad:fecha_caducidad}
        if(req.file != null){
            imagen = '/uploads/'+req.file.filename
            valores = { nombre:nombre,descripcion:descripcion,precio:precio,laboratorio:laboratorio,fecha_caducidad:fecha_caducidad,imagen:imagen}
            await eliminarImagen(id)
        }
        const validacion = validar(nombre,descripcion,precio,laboratorio,fecha_caducidad)
        if(validacion == ''){
            await MedicamentoModel.updateOne({_id:id},{$set: valores})
            return res.status(200).json({status:true,message:'Medicamento actualizado'})
        }
        else{
            return res.status(400).json({status:false,errors:validacion})
        }
    }
    catch(error) {
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

export const deleteMedicamento = async(req,res) =>{
    try{
        const {id} = req.params
        await eliminarImagen(id)
        await MedicamentoModel.deleteOne({_id:id})
        return res.status(200).json({status: true, message: 'Medicamento eliminado'})
    }
    catch(error){
        return res.status(500).json({status:false,errors:[error.message]})
    }
}

const eliminarImagen = async(id) =>{
    const medicamento = await MedicamentoModel.findById(id)
    const img = medicamento.imagen
    fs.unlinkSync('./public/'+img)
}

const validar = (nombre,descripcion,precio,laboratorio,fecha_caducidad,img,sevalida) => {
    var errors = [ ]
    if(nombre === undefined || nombre.trim() === ''){
        errors.push('El nombre NO debe de estar vacío')
    }
    if(descripcion === undefined || descripcion.trim() === ''){
        errors.push('La descripcion NO debe de estar vacío')
    }
    if(precio === undefined || precio.trim() === '' || isNaN(precio)) {
        errors.push('El precio NO debe de estar vacío y debe ser numérico')
    }
    if(laboratorio === undefined || laboratorio.trim() === ''){
        errors.push('El laboratorio NO debe de estar vacío')
    }
    if(fecha_caducidad === undefined || fecha_caducidad.trim() === '' || isNaN(Date.parse(fecha_caducidad))) {
        errors.push('La fecha NO debe de estar vacía y debe ser fecha valida')
    }
    if(sevalida === 'Y' && img === undefined) {
        errors.push('Selecciona una imagen en formato jpg o png')
    }
    else{
        if(errors != ''){
            fs.unlinkSync('./public/uploads/'+img.filename)
        }
    }
    return errors
}

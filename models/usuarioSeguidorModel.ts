import mongoose, { Schema } from "mongoose";

const seguidorSchema = new Schema({
    usuarioId : {type : String, required : true}, //<== ID do usuário que quer seguir
    usuarioSeguidoId : {type : String, required : true}, //<== ID do usuário que será seguido
});

export const SeguidorModel = (mongoose.models.seguidores || mongoose.model('seguidores', seguidorSchema));
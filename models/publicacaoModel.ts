import mongoose, { Schema } from "mongoose";

const publicacoesSchema = new Schema({
    idUsuario : { type : String, required : true },
    descricao : { type : String, required : true },
    file : { type : String, required : true },
    data : { type : Date, required : true },
    comentarios : { type : Array, required : true, default : [] },
    curtidas : { type : Array, required : true, default : [] }
});

export const publicacaoModel = (mongoose.models.publicacoes || mongoose.model('publicacoes', publicacoesSchema));
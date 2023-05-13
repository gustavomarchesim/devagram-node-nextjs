import moongose, { Schema } from 'mongoose';

/**
 * Definição do esquema do documento para a coleção "usuarios" no MongoDB.
 */

const usuarioSchema = new Schema({
    nome : {type : String, required : true},
    email : {type : String, required : true},
    senha : {type : String, required : true},
    avatar : {type : String, required : false},
    seguidores : {type : Number, default : 0},
    seguindo : {type : Number, default : 0},
    publicacoes : {type : Number, default : 0}
    
});

/**
 * Propriedades do Moongose para manipulação de informações no banco.
 * 
 * @property {Function} find - Método do modelo para buscar usuários.
 * @property {Function} create - Método do modelo para criar um novo usuário.
 * @property {Function} update - Método do modelo para atualizar um usuário existente.
 * @property {Function} delete - Método do modelo para excluir um usuário.
 */

export const usuarioModel = (moongose.models.usuario || moongose.model('usuario', usuarioSchema));
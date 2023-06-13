import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { respostasPadroes } from "@/types/respostasPadroes";
import { publicacaoModel } from '@/models/publicacaoModel';
import { usuarioModel } from '@/models/usuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const curtidaEndpoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {
    try {
        if(req.method === 'PUT'){ //<== Verifica se o método da requisição é "PUT"

            const { id } = req?.query; //<== Extrai o parâmetro de consulta "id" da requisição
            
            const publicacao = await publicacaoModel.findById(id); //<== Verifica a existência da publicação no banco de dados
            if(!publicacao){ //<== Faz uma tratativa no caso da publicação não ser encontrada.
                return res.status(400).json({ BadRequest : 'Publicação não encontrada!' }); // <== Retorna uma resposta de erro com código 400 (BadRequest) informando que a publicação não foi encontrada
            }

            const { userId } = req?.query; //<== Extrai o parâmetro de consulta "userId" da requisição

            const usuario = await usuarioModel.findById(userId);//<== Verifica a existência de uma correspondencia e busca no banco de dados
            if(!usuario){ //<== Faz uma tratativa em caso o usuário não seja encontrado no banco de dados
                return res.status(400).json({ BadRequest : 'Usuário não encontrado!' }); //<== Retorna uma resposta de erro com código 400 (BadRequest), informando que o usuário não pôde ser encontrado no banco de dados
            }

            const indexCurtidas = publicacao.curtidas.findIndex((e : any) => e.toString() === usuario._id.toString()); // <== Verifica a existencia de um usuário no Array de curtidas, e se existir retorna o valor do seu "vagão", caso não retorna -1

            if(indexCurtidas != -1){ //<== Caso o valor da const indexCurtidas for diferente de -1 (0,1,2,...), significa que o usuário esta na lista de curtidas e portanto o remove usando splice.
                publicacao.curtidas.splice(indexCurtidas, 1); //<== Splice define o número do index que deve ser removido e em seguida quantos devem ser removidos.
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao); //<== O banco de dados atualiza as informações
                return res.status(200).json({ OK : 'Publicação descurtida com sucesso!' }); //<== Retorna uma mensagem de sucesso com o código 200 (OK), informando sucesso ao remover a curtida
            } else { //<== Caso for igual a -1, significa que o usuário não está dentro do Array de curtidas.
                publicacao.curtidas.push(usuario._id); //<== Faz a inserção do usuário no array por meio do método Push
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);//<== Atualiza o banco de dados com as informações
                return res.status(200).json({ OK : 'Publicação curtida com sucesso!' }); //<== Retorna mensagem de sucesso com o código 200 (OK), informando que a publicação foi curtida/
            }
        }
        return res.status(405).json({ MethodNotAllowed : 'Método informado inválido!' }); //<== Retorna uma resposta de erro com código 405 (MethodNotAllowed) informando que o método não é válido
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ InternalServerError : 'Ocorreu um erro ao curtir a mensagem' }); //<== Retorna uma resposta de erro com código 500 (InternalServerError) informando que ocorreu um erro ao curtir a publicação
    }
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(curtidaEndpoint))) ;
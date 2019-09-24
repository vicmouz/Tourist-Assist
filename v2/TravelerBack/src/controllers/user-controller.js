const UserRepository = require('../repositories/user-repository');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');


// Metodos de crud do controller de usuários

exports.getAll = async (request, response, next) => {
    try {
        let users = await UserRepository.getAll();
        response.status(200).send(users);
    } catch (ex) {
        throwException(response, "Falha ao buscar lista de usuários", ex);
    }
}

exports.getByName = async (request, response, next) => {
    try {
        let user = await UserRepository.getByName(request.params.name);
        if (user) {
            response.status(200).send(user);
        } else {
            response.status(400).send(
                'Nenhum usuário com o nome "' + request.params.name + '" foi encontrado!'
            );
        }
    } catch (ex) {
        throwException(response, "Falha ao buscar usuário por nome", ex);
    }
}

exports.create = async (request, response, next) => {
    try {
        request.body.password = md5(request.body.password + global.ENCRYPT_KEY);
        await UserRepository.create(request.body);
        emailService.send(
            request.body.email,
            "Bem vindo ao Cine Spoiler",
            global.EMAIL_TEMPLATE.replace('#'), request.body.name
        );
        response.status(200).send("Usuário cadastrado com sucesso!");
    } catch (ex) {
        throwException(response, "Falha ao cadastrar usuário", ex);
    }
}

exports.getFavoriteStops = async (request, response, next) => {
    try {
        let favoriteStops = await UserRepository.getFavoriteStops(request.params.userId);
        response.status(200).send({
            favoriteStops
        })
    } catch (ex) {
        throwException(response, "Falha ao retornar as paradas favoritas", ex);
    }
}

exports.getFavoriteStop = async (request, response, next) => {
    try {
        let favoriteStop = await UserRepository.getFavoriteStop(request.params.userId, request.params.stopId);
        //let favoriteStop = await StopRepository.getStop(request.params.stopId);
        response.status(200).send({
            favoriteStop
        })
    } catch (ex) {
        throwException(response, "Falha recuperar parada favorita", ex);
    }
}

exports.addFavoriteStop = async (request, response, next) => {
    try {
        await UserRepository.addFavoriteStop(request.body);
        response.status(200).send({
            message: "Parada " + request.body.stopId + " favoritada com sucesso"
        })
    } catch (ex) {
        throwException(response, "Falha ao favoritar parada", ex);
    }
}

exports.removeFavoriteStop = async (request, response, next) => {
    try {
        await UserRepository.removeFavoriteStop(request.body);
        response.status(200).send({
            message: "Parada " + request.body.stopId + " removida de favoritas com sucesso"
        })
    } catch (ex) {
        throwException(response, "Falha ao remover parada favorita", ex);
    }
}

exports.update = async (request, response, next) => {
    try {
        await UserRepository.update(request.params.id, request.body);
        response.status(200).send({
            message: "Usuario atualizado com sucesso!",
        });
    } catch (ex) {
        throwException(response, "Falha ao atualizar usuário", ex);
    }
}

exports.delete = async (request, response, next) => {
    try {
        await UserRepository.delete(request.params.id);
        response.status(200).send({
            message: "Usuário deletado com sucesso!",
        });
    } catch (ex) {
        throwException(response, "Falha ao deletar usuário", ex);
    }
}

exports.authenticate = async (request, response, next) => {
    try {

        let user = await UserRepository.authenticate({
            username: request.body.username,
            password: md5(request.body.password + global.ENCRYPT_KEY)
        });

        if (!user) {
            response.status(400).send("Nome de usuário ou senha invalidos");
        } else {
            let token = await authService.generateToken({
                _id: user._id,
                email: user.email,
                username: user.username,
                age: user.age,
                name: user.name
            });

            response.status(200).send({
                token: token,
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    age: user.age,
                    name: user.name
                }
            });
        }

    } catch (ex) {
        throwException(response, "Falha na autenticação", ex);
    }
}

exports.getUser = async (request, response, next) => {
    try {
        let token = request.params.token;
        let data = await authService.decodeToken(token);

        response.status(200).send(data)

    } catch (ex) {
        throwException(response, "Falha ao buscar usuáro pelo token", ex);
    }
}

/**
 * Recebe o objeto response, uma messagem de erro e a exceção gerada e devolve uma messagem 
 * de erro completa para o usuário.
 * 
 * @response : objeto response da requisição, usado para retornar a messagem para o usuário
 * @message : messagem de erro que será enviada para o usuário
 * @exception : exceção gerada pela tentativa de uso do banco
 */

throwException = (response, message, exception) => {
    response.status(500).send({
        message: message,
        error: {
            message: exception.message,
            type: exception.name
        }
    })
}
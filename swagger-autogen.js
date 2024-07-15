const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.js', './routes/auth.js'];

const doc = {
    info: {
        title: 'To-Do List API',
        description: 'Documentação Feita para aula, abaixo terão todas as rotas utilizadas nos dias de aula.',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    definitions: {
        addTask: {
            title: 'Titulo da tarefa',
            completed: false
        },
        login: {
            name: 'Nome do usuário',
            password: 'Senha do usuário'
        },
        register: {
            name: 'Nome do usuário',
            password: 'Senha do usuário',
            image: 'foto do usuário (opcional)',
        },
    }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app'); // Inicia o servidor após gerar a documentação
    console.log('Documentação do Swagger gerada com sucesso.');
});

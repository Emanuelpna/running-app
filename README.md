# Running App

## Como usar

Rode o comando para iniciar o servidor

```sh
npx expo start
```

Leia o QR Code que aparecer na tela com o celular pelo aplicativo [Expo Go](https://expo.dev/go) ou, se tiver um emulador rodando, aperte a tecla `a` para emulador android ou `i` para emular ios no terminal com o servidor do app rodando.

## Protótipo do Figma

O Protótipo do Figma está disponível [aqui](https://www.figma.com/design/LsTnYrtrRWJpsV7Jlcze5n/Running-App?node-id=0-1&t=aHYIqhhawBwj94dU-1)

## Como funciona o Projeto

### Como contribuir

Abra o terminal na pasta desejada e realize o clone do projeto:

```sh
git clone https://github.com/Emanuelpna/running-app.git
```

Se você já tiver feito o clone, certifique-se de estar na pasta main e atualize a branch:

```sh
git checkout main
git fetch --all
git pull
```

Após isso, crie uma nova branch baseado na branch main já atualizada:

```sh
git checkout -b feature/nome-da-feature
```

Realize as alterações no código e sempre commit em partes do trabalho que forem sendo finalizadas, por menor que sejam (desde que esteja sem erros naquele momento):

```sh
git commit -m "Mensagem descritiva do está presente no commit"
```

Suba o projeto para o repositório:

```sh
git push -u origin feature/nome-da-feature
```

Lá no Github, crie um Pull Request desse branch para Main.

### Pastas do projeto

#### Pasta `src/app`

Essa pasta é usada automaticamente pelo Expo por meio da biblioteca [expo-router](https://docs.expo.dev/versions/latest/sdk/router/).

Nela somente devem estar presentes arquivos que estejam relacionados a rotas, pois a biblioteca sempre lê tudo e tenta transformar em tela.

Um componente para ser considerado uma página deve ser exportado como default obrigatoriamente. Exemplos:

```jsx
export default HomePage() {
  // ...
}
```

#### Pasta `src/components`

Essa pasta receberá a lista de componentes sendo utilizados na aplicação. Logo qualquer componente que não é uma página virá pra cá. Aqui vamos organizar em subpastas.

A primeira será a `src/components/ui`. Onde todos os componentes básicos utilizados por toda a aplicação estarão. Como, inputs, buttons, titles, mapas, etc.

Após isso teremos subpastas sendo criadas de acordo com o escopo recebendo o nome da feature. Por exemplo: `src/components/tracking` receberis todos os componentes relacionados ao trajeto, como o componente que gera a lista de polyline, o componente que encapsula a lógica do rastreio, etc

#### Pasta `src/data`

Nessa pasta estarão presentes as classes, funções e etc que manipulem os dados da aplicação. Seja porque estão buscando do banco de dados, ou porque estão fazendo cálculos em valores usados em alguma página.

A ideia é que os componentes tenham o mínimo possível de lógica de negócio e só chamem essas classes ou funções presentes nessa pasta.

#### Pasta `src/domain`

Essa pasta é responsável por armazenar todas as informações que dizem respeito ao domínio da aplicação. Ou seja, todas as classes que formatam uma entidade que vai ser salva no banco de dados, que guardam valores de constantes a serem usadas, etc.

#### Pasta `src/infra`

A pasta Infra é a responsável por criar as abstrações com bibliotecas externas. Então se foi necessário baixar uma biblioteca do expo para interagir com a Câmera, por exemplo, o código que usa essa biblioteca será criado aqui.

Essa separação por camadas desse modo acaba sendo bem limitada no contexto do javascript. Porém, não temos ferramentas para garantir que isso nunca ocorra então não terá muito problema se acontecer.

Vamos estabelecer essas regras aqui:

- Domain: Não importa nenhum arquivo que não seja de Domain
- Data: Pode importar arquivos somente de Domain ou Infra
- Infra: Dentro da aplicação somente importa de Domain, porém, também importa de bibliotecas externas
- App: Importa preferencialmente de Data mas pode importar de Infra se for um código mais simples

> Em teoria, o React e o React Native são considerados bibliotecas externas. Porém, nosso código está essencialmente tão acoplados neles que seria um esforço enorme separar ele das demais camadas. Esforço esse que não necessariamente valeria a pena o tempo despendido. Logo, vamos considerar eles como tecnologias transversais, que permeiam toda a aplicação quando necessários. A única exceção é a pasta Domain, esta deve se manter o mais limpa possível ainda sim.

## Próximos Passos

### Tela de Listagem de Trajetos

Essa tela apresenta a lista de trajetos salvos pelo usuário e um botão flutuante que redireciona até a página de criação de um novo trajeto.

Essa tela fica no arquivo `src/app/(tabs)/(tracks)/index.jsx`

#### Atividades

- [ ] Criar componente de percurso conforme protótipo visual
- [ ] Buscar do async storage a lista de percursos salvos
- [ ] Renderizar em tela essa lista usando o componente de percurso criado
- [ ] Criar componente de botão flutuante
- [ ] Adicionar ao botão flutuante o link que leva até a tela de novo trajeto

### Tela de Criação de Trajeto

Essa tela apresente um input text para ser inserido o nome do trajeto, um mapa com um marcador mostrando a localização atual do usuário e um botão para iniciar os rastreio

Essa tela fica no arquivo `src/app/(tabs)/(tracks)/new-track.jsx`

#### Atividades

- [ ] Criar componente input e label
- [ ] Adicionar input e label conforme protótipo
- [ ] Adicionar mapa com marcador de localização atual, conforme primeiro trabalho a ser entregue na disciplina
- [ ] Adicionar botão flutuante centralizado para iniciar o rastreio durante o trajeto

### Tela de Rastreio de Trajeto

Essa tela apresente um mapa com o trajeto sendo atualizado em tempo real e um botão para finalizar o rastreio

Essa tela fica no arquivo `src/app/(tabs)/(tracks)/track-watcher.jsx`

#### Atividades

- [ ] Adicionar o mapa na tela
- [ ] Iniciar o processo de tracking
- [ ] Salvar as coordenadas recebidas a cada atualização no banco e em um state
- [ ] Com as coordenadas do state, preencher a polyline no mapa
- [ ] Adicionar ao botão o comportamento de para o rastreio e voltar para a página com a lista de trajetos

### Tela de Detalhes de um Trajeto

Essa tela apresente uma lista com os trajetos

Essa tela fica no arquivo `src/app/(tabs)/(tracks)/track-details.jsx`

#### Atividades

- [ ] Adicionar o mapa na tela
- [ ] Buscar no banco de dados um trajeto
- [ ] Colocar a primeira coordenada do trajeto como centro do mapa
- [ ] Adicionar a polyline na tela

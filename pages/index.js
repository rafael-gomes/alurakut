import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import ProfileRelationsBoxWrapper from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} alt="imagem do usuario" />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @
          {propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home() {
  const usuarioAleatorio = 'rafael-gomes';
  const [comunidades, setComunidades] = React.useState([{
    id: '1239712879187390182730817203981729031',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  }]);

  const pessoasFavoritas = [
    'arthurvinx',
    'diego3g',
    'omariosouto',
    'rafaballerini',
    'peas',
    'felipefialho',
  ];

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              };
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>

              <button type="submit">
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidade (
              {comunidades.length}
              )
            </h2>
            <ul>
              {comunidades.map((itemAtual) => (
                <li key={itemAtual.id}>
                  <a href={`/users/${itemAtual.title}`}>
                    <img src={itemAtual.image} alt="imagem da comunidade" />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade (
              {pessoasFavoritas.length}
              )
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} alt="imagem da pessoa favorita" />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

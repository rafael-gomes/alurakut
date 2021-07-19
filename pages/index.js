import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import ProfileRelationsBoxWrapper from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

function ProfileSidebar(propriedades) {
  const { githubUser } = propriedades;
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} alt="imagem do usuario" />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @
          {githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  const { title, items } = propriedades;
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title}
        {' '}
        (
        {items.length}
        )
      </h2>
      <ul>
        {items.sort((a, b) => 0.5 - Math.random()).slice(0, 6).map((itemAtual) => (
          <li key={itemAtual.id}>
            <a href={itemAtual.link_url} key={itemAtual}>
              <img src={itemAtual.img_url} alt="imagem seguidor" />
              <span>{itemAtual.caption}</span>
            </a>
          </li>
        ))}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

function ProfileFollowers(props) {
  return (
    <ProfileRelationsBox
      title={props.title}
      items={props.items.map((seguidor) => ({
        id: seguidor.id,
        link_url: `https://github.com/${seguidor.login}`,
        img_url: `https://github.com/${seguidor.login}.png`,
        caption: seguidor.login,
      }))}
    />
  );
}

export default function Home(props) {
  const usuarioLogado = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

  const pessoasFavoritas = [
    'arthurvinx',
    'diego3g',
    'omariosouto',
    'rafaballerini',
    'peas',
    'thomasalmeida',
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${usuarioLogado}/followers`)
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: {
        Authorization: 'f84922b6f51786c7e2a9cac9784828',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            imageUrl
            creator_slug
          }
        }`,
      }),
    })
      .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato);
      });
  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
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
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioLogado,
              };

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade),
              })
                .then(async (response) => {
                  const dados = await response.json();
                  const comunidadeAtualizada = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidadeAtualizada];
                  setComunidades(comunidadesAtualizadas);
                });
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
          <ProfileFollowers title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidade (
              {comunidades.length}
              )
            </h2>
            <ul>
              {comunidades.map((itemAtual) => (
                <li key={itemAtual.id}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl} alt="imagem da comunidade" />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    },
  })
    .then((resposta) => resposta.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  };
}

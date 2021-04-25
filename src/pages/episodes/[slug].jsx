import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss'
import {  usePlayer } from '../../contexts/PlayerContext';

export default function Episode (props) {
  const { play } = usePlayer();
  const { episode } = props;
  return(
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image
        width={700}
        height={160}
        src={ episode.thumbnail }
        objectFit='cover'
        />
        <button type='button' onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description}
        dangerouslySetInnerHTML={{__html: episode.description}}
      />

    </div>
  )
};


export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const { data } = await api.get(`episodes/${context.params.slug}`)
const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }
  return {
    props: {
      episode,
     },
    revalidate: 60 * 60 * 24,
  }
}

/*
se o nerxt gera as paginas estáticas no momento da build 
como ele vai construir uma pagina estaica para cada eps se no momento da build
ele não sabe qual eps existe?
toda vez que estamos gerando de forma dinamica um página estática,
deve informar o metodo getstaticpaths, e esse método retorna quais eps
eu quero gerar de forma estática no momento da build,
se no paths foi array for vazio ele não gera nenhum eps no momento da build
porém se tivesse retornado um OBJETO informando o nome dos parâmetros 
paths: [
  {params: { slug: 'id' }}
]
assim gera aquela pagina específica no momento da build.
Mas se passaros paths vazios e com o fallback false, se a pessoa acessar
esse eps que não foi gerado no momento da build, ao acessar qualquer eps vai retornar
retornar com 404.
Ao por alguma coida nos paths e fallback false, só as paginas do path seriam geradas e as outras inexistente.
Ao passar o paths vazio e o fallback true, ele gera a página estatica pelo lado do cliente e
para isso deve se usar o hook useRouter

const router = useRouter();
if(router.isFallback) {
  return <p>...Carregando.</p>
}
ele carrega a pagina apenas quando o usuário for acessar elas.

Os paths vazios e o fallback blocking,  carrega as paginas apenas quando o cliente acessa
mas roda a requisição no "servidor" next.js, então a pessoa só muda de página quando os dados já estiverem carregados
cobrindo o SEO

exemplo de uso, em um ecomerce que tem 15000 categorias e produtos

ex: /categorias/camisas
ex: /categorias/meias

vc passa no paths as categorias 
fazendo uma requisição nessa função  getstaticpaths apenas dos mais acessados e o resto
gera no momento de acesso pelo lado do servernext.js, para isso colocando o fallback blocking

export const getStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 10,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params:{
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}
*/
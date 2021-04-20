import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export function Header () {
 /// const currentDate = new Date().toLocaleDateString();//data formato brasileiro
 const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR });

  return(
    <header className={ styles.headerContainer } >
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para você ouvir, sempre</p>
      <span>{ currentDate }</span>
    </header>
  )
}
//tudo que está na pasta publico é acessavel em qlqr parte da aplicação, sem ser necessario importar
//SPA
/*
useEffect(() => {
  fetch('http://localhost:3333/epsodes')
    .then(response => response.json())
    .then(data => console.log(data))
}, [])
 */
//SSR
/*
export async function getServeSideProps() {
    const response = await fetch('http://localhost:3333/epsodes')
    const data = await response.json()
    
    return {
      props: {
        episodes: data,
      }
    }
}
*/
//SSG
export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  
  return {
    props: {
      episodes: data,
    },
    revalidate: 60*60*8,
  }
}
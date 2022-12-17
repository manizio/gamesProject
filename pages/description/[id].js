import Link from "next/link";
import Head from "next/head";
export default function Game({data}){

    if(!data) return (<div class="loading">carregando</div>)
    return(
        <div>
            <Head>
                <title>{data.name}</title>
            </Head>
            <Link id="voltar" href="../">Voltar</Link>
            <div class="game">
                <div id="titleImageContainer">
                    <div>{data.name}</div>
                    <span>{data.platforms.map(p => <p>{p.platform.name}</p>)}</span>
                    <img width={600} height={300} src={data.background_image}/>
                    
                </div>
                <div class="vr"></div>
                <div class="descriptionContainer">
                    <p>Descrição:</p>
                    {data.description.replace(/<[^>]+>/g, '')}
                    <div id="wrapper">
                        <div></div>
                        <div class="attributes">
                            <div id="genre">
                                {data.genres.map(gen => <p>{gen.name}</p>)}
                            </div>
                            <div id="tags">
                                {data.tags.map(t => <p>{t.name}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


async function fetcher (url){

    const res = await fetch(url)

    const json = await res.json()
    return json

}

export async function getStaticPaths(){
    return{
        paths: [
            {
                params: {id : "53473"}
            },
            {
                params: {id: "3498"}
            },
            {
                params: {id: "9767"}
            },
            {
                params: {id: "326243"}
            },
            {
                params: {id: "427543"}
            },
            {
                params: {id: "680034"}
            }
        ],
        fallback: true,
    }
}

export async function getStaticProps({params}){
    const res = await fetch(`https://api.rawg.io/api/games/${params.id}?key=a0453dc9aa134cadb772ed6b507537eb`)
    const data = await res.json()

    return {
        props: {
            data
        }
    }
}
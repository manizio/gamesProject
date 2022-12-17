import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Table, Popover, ConfigProvider, theme } from "antd";

//https://rawg.io/api/games?key=a0453dc9aa134cadb772ed6b507537eb&search=pacman
export default function GamesApp() {

  useEffect(()=> {
    document.getElementsByTagName("body")[0].setAttribute("id", "bodyPage")
    document.getElementsByTagName("html")[0].setAttribute("id", "htmlPage")
  })

  const [state, setState] = useState({ url: "", searchString: "" });
  const { data, error } = useSWR(state, async (u) => {
    if (!u.url || !u.searchString) return { results: "" };
    if (u.url === "" || u.searchString === "") return { results: "" };

    const res = await fetch(
      `${u.url}?key=a0453dc9aa134cadb772ed6b507537eb&search=${u.searchString}`
    );
    const json = await res.json();

    return json;
  });

  const inputHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setState({
        url: "https://rawg.io/api/games",
        searchString: e.target.value,
      });
    }
  };

  return (
    <section>
      <Head>
        <title>Games!</title>
        <link type="image/x-icon" rel="icon" href="https://api.iconify.design/twemoji/joystick.svg"/>
        <script src="https://code.iconify.design/iconify-icon/1.0.2/iconify-icon.min.js"></script>
      </Head>

      
      <ConfigProvider theme={{algorithm: theme.darkAlgorithm,}}>

        <div id="mainContainer">
          <GameForm handler={inputHandler} />
          <ShowGames
            data={
              error ? { error: "erro na pesquisa" } : data ? data : { results: "" }
            }
            show={state.url !== ""}
          />
        </div>
      </ConfigProvider>

      <footer>
        <p>Desenvolvido por: Manoel Anízio e Isadora Stéfany</p>
      </footer>
    </section>
  );
}

export function ShowGames({ data, show }) {
  const [state, setState] = useState({ all: [], tooltip: true, index: '', filter:[] });

  useEffect(() => {
    setState({ all: data.results });
  }, [data]);
  if (!show) return <div></div>;
  if (state.error) return <div>falha na requisição</div>;
  if (state.all === "") return <div class="loading">carregando</div>;
  if (!state.all) return <div>Nenhum resultado encontrado</div>;
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a,b) => a.id - b.id,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a,b) => a.name.localeCompare(b.name),
      render: (text, a) => (
        <>
          <Popover placement="topLeft"
          title={text}
          content={
          <>
            <div id="platforms">
              Platforms: <div>
                {a.platforms.map(p => <p id="platformName">{p}</p>)}
              </div>
            </div>
            <Link href={`/description/${a.id}`}>Ver mais</Link>
          </>}
          trigger="click">
          <a>{text}</a>
          </Popover>
        </>
      )
    },
    {
      title:'Lançamento',
      dataIndex: 'released',
      key:'released',
      sorter: (a,b) => a.released.localeCompare(b.released)
    }
  ]

  const dataSource = 
    state.all.map((g,i)=> ({
      key: i,
      id:g.id,
      name:g.name,
      released: g.released,
      platforms: g.platforms.map(p => p.platform.name)
    }))

  return (
    <div id="container">  
      <Table dataSource={dataSource} columns={columns}/>
    </div>
  );
}

export function Tooltip({ g , s}) {

  if (!s) return <div></div>

  return (
      <div id="tooltip">
        {g.name}{" "}
        <p id="platforms">
          Platforms:
          <div>
            {g.platforms.map((p) => (
              <p id="platformName">{p.platform.name}</p>
            ))}
          </div>
        </p>
        <Link href={`/description/${g.id}`}>Ver mais</Link>
      </div>   
  );
}

export function GameForm({ handler }) {
  return (
    <div>
      <form id="gameForm">
        <label htmlFor="search">Procurar Jogo</label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Pesquisar"
          autoComplete="true"
          onKeyDown={handler}
        ></input>
      </form>
    </div>
  );
}

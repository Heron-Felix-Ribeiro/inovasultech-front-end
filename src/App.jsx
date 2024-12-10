import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login'
import ListagemFiltrada from './components/ListagemFiltrada';
import CadastroUsuario from './components/CadastroUsuario';
import CadastrarAgente from './components/CadastrarAgente';
import AtualizarAgente from './components/AtualizarAgente';
import ListarEndereco from './components/ListarEndereco';
import CadastrarEndereco from './components/CadastrarEndereco';
import AtualizarEndereco from './components/AtualizarEndereco';
import CadastrarCidade from './components/CadastrarCidade';
import CadastrarTipoAgente from './components/CadastrarTipoAgente';
import ListarCidade from './components/ListarCidade';
import ListarTipoAgente from './components/ListarTipoAgente';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/listagemFiltrada/1">Agentes</Link></li>
            <li><Link to="/listarEndereco">Enderecos</Link></li>
            <li><Link to="/listarCidade">Cidades</Link></li>
            <li><Link to="/listarTipoAgente">Tipos de Agente</Link></li>
          </ul>
        </nav>

        <h1>InovaSulTech</h1>
           
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path='/cadastrar' element={<CadastroUsuario/>}></Route>
          <Route path="/login" element={<Login/>}></Route>

          <Route path="/criarAgente" element={<CadastrarAgente/>}></Route>
          <Route path="/listagemFiltrada/:id" element={<ListagemFiltrada/>}></Route>
          <Route path="/atualizar/:id" element={<AtualizarAgente/>}></Route>

          <Route path="/listarEndereco" element={<ListarEndereco/>}></Route>
          <Route path="/criarEndereco" element={<CadastrarEndereco/>}></Route>
          <Route path="/endereco/atualizar/:id" element={<AtualizarEndereco />}></Route>

          <Route path="/criarCidade" element={<CadastrarCidade/>}></Route>
          <Route path="/listarCidade" element={<ListarCidade/>}></Route>

          <Route path="/criarTipoAgente" element={<CadastrarTipoAgente/>}></Route>
          <Route path="/listarTipoAgente" element={<ListarTipoAgente/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

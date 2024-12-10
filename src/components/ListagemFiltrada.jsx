import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from './Api';
import '../css/Home.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ListagemFiltrada = () => {
  const [agentes, setAgentes] = useState([]);
  const [error, setError] = useState(null);
  const [tipoAgente, setTipoAgente] = useState('Startup');
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const carregarAgentes = async () => {
      try {
        const response = await Api.get(`/agentes/listar/${id || 1}`);
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setAgentes(response.data);
            setError(null); 
          } else {
            setError('Resposta inválida do servidor.');
          }
        } else {
          setError('Erro ao carregar agentes. Status: ' + response.status);
        }
      } catch (err) {
        setError('Verifique se existem agentes registrados.');
      }
    };

    carregarAgentes();
  }, [id]);

  const handleFiltrar = (e) => {
    const tipo = e.target.value;
    setTipoAgente(tipo);
    const newId = tipo === 'Startup' ? 1 : 2;
    navigate(`/listagemFiltrada/${newId}`);
  };

  const handleCreate  = () => {
    navigate('/criarAgente')
  }

  const handleEdit = (id) => {
    navigate(`/atualizar/${id}`)
  }

  const handleDelete = async (id) => { 
    Swal.fire({ title: 'Tem certeza?', 
      text: "Você não poderá reverter isso!", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33', 
      confirmButtonText: 'Sim, deletar!', 
      cancelButtonText: 'Cancelar', 
      reverseButtons: true
    })
      .then((result) => { 
        if (result.isConfirmed) { 
          Api.delete(`/agentes/deletar/${id}`) 
          .then(() => { 
            setAgentes(agentes.filter(agente => agente.id !== id)); 
            Swal.fire( 'Deletado!', 
              'O agente foi deletado.', 
              'success' ); }) .catch((err) => { 
                setError('Erro ao deletar agente'); 
                Swal.fire( 'Erro!', 
                  'Ocorreu um erro ao tentar deletar o agente.', 
                  'error' ); 
                }); 
              } 
            }); 
          };

  return (
    <main className="ListagemGeral">
      <div className="button-container">
        <button className="styled-button" onClick={() => handleCreate()}>Criar Agente</button>
      </div>
      <div className="filtros">
        <select value={tipoAgente} onChange={handleFiltrar} className="styled-select">
          <option value="Startup">Startups</option>
          <option value="Empresa de Tecnologia">Empresas</option>
        </select>
      </div>
      <table id="tabelaTodosAgentes" className="table-container">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Descrição</th>
            <th>Tipo Agente</th>
            <th>Enderecos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan="5">{error}</td>
            </tr>
          ) : agentes.length === 0 ? (
            <tr>
              <td colSpan="5">Carregando dados...</td>
            </tr>
          ) : (
            agentes.map((agente) => (
              <tr key={agente.id}>
                <td>{agente.nomeAgente}</td>
                <td>{agente.cnpj}</td>
                <td>{agente.descricao}</td>
                <td>{agente.tipoAgente}</td>
                <td>
                  {agente.enderecos.map((endereco, index) => (
                    <div key={index}>
                      {endereco.rua}, {endereco.bairro} - {endereco.cidade} ({endereco.cep})
                    </div>
                  ))}
                </td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(agente.id)}><FaEdit/></button>
                  <button onClick={() => handleDelete(agente.id)}><FaTrash/></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ListagemFiltrada;

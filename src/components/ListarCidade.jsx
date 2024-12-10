import React, { useEffect, useState } from 'react';
import Api from './Api';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListarCidade = () => {
  const [cidades, setCidades] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarCidades = async () => {
      try {
        const response = await Api.get('/cidade/listar');
        if (response.status === 200) {
          console.log('Dados recebidos da API:', response.data);
          if (Array.isArray(response.data)) {
            setCidades(response.data);
            setError(null);
          } else {
            setError('Resposta inválida do servidor');
          }
        } else {
          setError('Erro ao carregar cidades. Status: ' + response.status);
        }
      } catch (err) {
        console.error('Erro ao carregar cidades:', err);
        setError('Verifique se existem cidades registradas');
      }
    };

    carregarCidades();
  }, []);

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
    }).then((result) => { 
      if (result.isConfirmed) { 
        Api.delete(`/cidade/deletar/${id}`) .then(() => { 
          setCidades(cidades.filter(cidade => cidade.id !== id)); 
          Swal.fire( 'Deletado!', 'A cidade foi deletada.', 'success' ); 
        }) .catch((err) => { 
          console.error('Erro ao deletar cidade:', err); 
          setError('Erro ao deletar cidade'); 
          Swal.fire( 'Erro!', 'Ocorreu um erro ao tentar deletar a cidade.', 'error' ); 
        }); 
      } 
    }); 
  };

  const handleCreate = () => {
    navigate("/criarCidade")
  }

  return (
    <main className="ListagemGeral">
      <div>
        <button className="styled-button" onClick={handleCreate}>Criar Cidade</button>
      </div>
      <table id="tabelaTodasCidades" className="table-container">
        <thead>
          <tr>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td colSpan="3">{error}</td>
            </tr>
          )}
          {cidades.length === 0 ? (
            <tr>
              <td colSpan="3">Carregando dados...</td>
            </tr>
          ) : (
            cidades.map((cidade) => (
              <tr key={cidade.id}>
                <td>{cidade.nomeCidade}</td>
                <td>{cidade.estado}</td>
                <td>
                  <button onClick={() => handleDelete(cidade.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ListarCidade;

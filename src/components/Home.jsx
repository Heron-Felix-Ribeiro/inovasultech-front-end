import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Home.css'

const Home = () => {
  const [agentes, setAgentes] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarAgentes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/agentes/listar');
        console.log('Dados recebidos:', response.data);
        if (response.status === 200) {
          setAgentes(response.data); 
        }
      } catch (err) {
        console.error('Erro ao carregar agentes: ', err);
        setError('Verifique se existem agentes registrados.');
      }
    };

    carregarAgentes();
  }, []);

  return (
    <main className="ListagemGeral">
      <table id="tabelaTodosAgentes" className="table-container">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Descrição</th>
            <th>Tipo Agente</th>
            <th>Enderecos</th>
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td colSpan="4">{error}</td> 
            </tr>
          )}
          {agentes.length === 0 ? (
            <tr>
              <td colSpan="4">Carregando dados...</td> 
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Home;

import React, { useEffect, useState } from 'react'
import Api from './Api'
import { FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListarTipoAgente = () => {
    const [tipoAgentes, setTipoAgentes] = useState ([]); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarTipoAgentes = async () => {
            try{
                const response = await Api.get('/tipoagente/listar');
                if(response.status === 200) {
                    if(Array.isArray(response.data)) {
                        setTipoAgentes(response.data); 
                        setError(null); 
                    } else {
                        setError('Resposta do servidor invalida')
                    }
                } else {
                    setError('Erro ao carregar tipo agente. Status: ' + response.status)
                }
            } catch (err) {
                setError('Verifique se existem tipo de agentes registrados')
            }
        }; 
        
        carregarTipoAgentes(); 
    }, []);

    const handleDelete = async (id) => { 
        Swal.fire({ 
            title: 'Tem certeza?', 
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
                Api.delete(`/tipoagente/deletar/${id}`) 
                .then(() => { 
                    setTipoAgentes(tipoAgentes.filter(
                        tipoAgente => tipoAgente.id !== id)); 
                        Swal.fire( 'Deletado!', 
                            'O tipo de agente foi deletado.',
                            'success' ); 
                        }) 
                        .catch((err) => { 
                            setError('Erro ao deletar tipo de agente'); 
                            Swal.fire( 'Erro!', 
                                'Ocorreu um erro ao tentar deletar o tipo de agente.', 
                                'error' ); 
                            }); 
                        } 
                    }); 
                };

    const handleCreate = () => {
        navigate("/criarTipoAgente")
    }

  return (
    <main className="ListagemGeral">

        <div>
            <button className="styled-button" onClick={handleCreate}>Criar Tipo de Agente</button>
        </div>
        <table id="tabelaTodosAgentes" className="table-container">
            <thead>
                <tr>
                    <th>Tipo Agente</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {error && (
                    <tr>
                        <td colSpan="4">{error}</td>
                    </tr>
                )}
                {
                    tipoAgentes.length === 0 ? (
                        <tr>
                            <td colSpan="4">Carregandos dados...</td>
                        </tr>
                    ) : (
                        tipoAgentes.map((tipoAgente) => (
                            <tr key={tipoAgente.id}>
                                <td>{tipoAgente.nmTipoAgente}</td>
                                <td>
                                <button onClick={() => handleDelete(tipoAgente.id)}><FaTrash/></button>
                                </td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </main>
  )
}

export default ListarTipoAgente;
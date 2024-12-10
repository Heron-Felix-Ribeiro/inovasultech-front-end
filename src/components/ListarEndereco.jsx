import React, { useEffect, useState } from 'react'
import Api from './Api'
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ListarEndereco = () => {
    const [enderecos, setEnderecos] = useState ([]); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 
    const { id } = useParams(); 

    useEffect(() => {
        const carregarEnderecos = async () => {
            try {
                const response = await Api.get('/endereco/listar');
                if(response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setEnderecos(response.data);
                        setError(null); 
                    } else {
                        setError('Resposta inválida do servidor')
                    }
                } else {
                    setError('Erro ao carregar enderecos. Status: ' + response.status); 
                }
            } catch (err) {
                setError('Verifique se existem endereços registrados')
            }
        }; 

        carregarEnderecos(); 
    }, []);

    const handleEdit = (id) => {
        navigate(`/endereco/atualizar/${id}`)
    }

    const handleDelete = async (id) => { 
        Swal.fire({ title: 'Tem certeza?', 
            text: "Você não poderá reverter isso!", 
            icon: 'warning', showCancelButton: true, 
            confirmButtonColor: '#3085d6', 
            cancelButtonColor: '#d33', 
            confirmButtonText: 'Sim, deletar!', 
            cancelButtonText: 'Cancelar', 
            reverseButtons: true
        }).then((result) => { 
            if (result.isConfirmed) {
                 Api.delete(`/endereco/deletar/${id}`) .then(() => { 
                    setEnderecos(enderecos.filter(endereco => endereco.id !== id)); 
                    Swal.fire( 'Deletado!', 'O endereço foi deletado.', 'success' ); }) 
                    .catch((err) => { 
                        console.error('Erro ao deletar endereço:', err); 
                        setError('Erro ao deletar endereço'); 
                        Swal.fire( 
                            'Erro!', 
                            'Ocorreu um erro ao tentar deletar o endereço.', 
                            'error' ); 
                        }); 
                    } 
                });
            };

    const handleCreate = () => {
        navigate("/criarEndereco")
    }

  return (
    <main className="ListagemGeral">
        
        <div>
            <button className="styled-button" onClick={handleCreate}>Criar Endereço</button>
        </div>

        <table id="tabelaTodosAgentes" className="table-container">
            <thead>
                <tr>
                    <th>CEP</th>
                    <th>Rua</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>Estado</th>
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
                    enderecos.length === 0 ? (
                        <tr>
                            <td colSpan="4">Carregandos dados...</td>
                        </tr>
                    ) : (
                        enderecos.map((endereco) => (
                            <tr key={endereco.id}>
                                <td>{endereco.cep}</td>
                                <td>{endereco.rua}</td>
                                <td>{endereco.bairro}</td>
                                <td>{endereco.cidade}</td>
                                <td>SC</td>
                                <td className="action-buttons">
                                    <button onClick={() => handleEdit(endereco.id)}><FaEdit/></button>
                                    <button onClick={() => handleDelete(endereco.id)}><FaTrash/></button>
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

export default ListarEndereco;
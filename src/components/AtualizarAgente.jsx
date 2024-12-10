import React, { useEffect, useState } from 'react'
import Api from './Api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal); 
const MySwalSuccess = withReactContent(Swal); 

const AtualizarAgente = () => {
    const [nomeAgente, setNomeAgente] = useState (''); 
    const [cnpj, setCnpj] = useState (''); 
    const [descricao, setDescricao] = useState (''); 
    const [tipoAgente, setTipoAgente] = useState ('')
    const [endereco, setEndereco] = useState ('')
    const [rua, setRua] = useState ('') 
    const [error, setError] = useState (null);
    const navigate = useNavigate(); 
    const { id } = useParams(); 

    useEffect (() => {
        const carregarAgente = async () => {
            try {
                const response = await Api.get(`/agentes/carregar/${id}`); 
                if(response.status === 200) {
                    const agente = response.data; 
                    setNomeAgente(agente.nomeAgente);
                    setCnpj(agente.cnpj);
                    setDescricao(agente.descricao); 
                    setTipoAgente(agente.tipoAgente); 
                    setRua(agente.endereco.rua); 
                } 
            } catch (err) {
                setError('Erro ao carregar o agente')
            }
        };

        carregarAgente(); 
    }, [id]); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError();

        const Toast = MySwal.mixin({
            toast: true, 
            position: 'top', 
            timer: 4000, 
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer); 
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    
        const ToastSuccess = MySwalSuccess.mixin({
            toast: true, 
            position: 'top', 
            timer: 2000
        }); 

        try {
            const response = await Api.put(`/agentes/atualizar/${id}`, {
                nomeAgente, 
                cnpj,
                descricao, 
                tipoAgente, 
                endereco,
            });

            if (response.status === 200) {
                ToastSuccess.fire({
                    title: 'Atualizado com sucesso',
                    icon: 'success'
                })
                if(tipoAgente === 'Startup') {
                    navigate('/listagemFiltrada/1')
                } else {
                    navigate('/listagemFiltrada/2')
                }
            }

        } catch (err) {
            const errorMessage = err.response?.data?.messages || 'Não foi possível atualizar o agente'
            Toast.fire({
                title: 'Erro',
                text: errorMessage, 
                icon: 'error', 
            });
        }
    }
  return (
    <main>
        <div>
            <h2>Atualizar Agente</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nome: 
                        <input type='text' value={nomeAgente} onChange={(e) => setNomeAgente(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        CNPJ: 
                        <input type='text' value={cnpj} onChange={(e) => setCnpj(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Descrição: 
                        <input type='text' value={descricao} onChange={(e) => setDescricao(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Tipo Agente:
                        <input type='text' value={tipoAgente} onChange={(e) => setTipoAgente(e.target.value)} required/> 
                    </label>
                </div>
                <div>
                    <button type='submit'>Cadastrar</button>
                </div>
            </form>
        </div>
    </main>
  )
}

export default AtualizarAgente
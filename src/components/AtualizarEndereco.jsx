import React, { useEffect, useState } from 'react';
import Api from './Api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal); 
const MySwalSuccess = withReactContent(Swal); 

const AtualizarEndereco = () => {
    const[rua, setRua] = useState('');
    const[bairro, setBairro] = useState('');
    const[cep, setCep] = useState('');
    const[cidade, setCidade] = useState('');
    const[error, setError] = useState(null); 
    const navigate = useNavigate(); 
    const { id } = useParams(); 

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

    useEffect (() => {
        const carregarEndereco = async () => {
            try {
                const response = await Api.get(`/endereco/listar/${id}`); 
                if(response.status === 200) {
                    const endereco = response.data; 
                    setRua(endereco.rua); 
                    setBairro(endereco.bairro); 
                    setCep(endereco.cep); 
                    setCidade(endereco.cidade); 
                } else {
                    setError('Erro com o servidor')
                }
            } catch (err) {
                setError('Erro ao carregar o endereço')
            }
        };

        carregarEndereco(); 
    }, [id]); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError();
        
        try {
            const response = await Api.put(`/endereco/atualizar/${id}`, {
                rua, 
                bairro, 
                cep, 
                cidade
            });

            if(response.status === 200) {
                ToastSuccess.fire({
                    title: 'Atualizado com sucesso',
                    icon: 'success'
                })
                navigate('/listarEndereco')
            }
        } catch (err) {
            const errorMessage = err.response?.data?.messages || 'Não foi possível atualizar o endereço'
            Toast.fire({
                title: 'Erro',
                text: errorMessage, 
                icon: 'error'
            });
        }
    }
 
  return (
    <main>
        <h2>Atualizar Endereco</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Rua: 
                    <input type='text' value={rua} onChange={(e) => setRua(e.target.value)} required/>
                </label>
            </div>
            <div>
                <label>
                    Bairro: 
                    <input type='text' value={bairro} onChange={(e) => setBairro(e.target.value)} required/>
                </label>
            </div>
            <div>
                <label>
                    CEP:
                    <input type='text' value={cep} onChange={(e) => setCep(e.target.value)} required/>
                </label>
            </div>
            <div>
                <label>
                    Cidade:
                    <input type='text' value={cidade} onChange={(e) => setCidade(e.target.value)} required/> 
                </label>
            </div>
            <div>
                <button type='submit'>Cadastrar</button>
            </div>
        </form>
    </main>
  )
}

export default AtualizarEndereco
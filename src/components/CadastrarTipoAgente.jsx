import React, {useState} from 'react'
import Api from './Api'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal); 
const MySwalSuccess = withReactContent(Swal); 

const CadastrarTipoAgente = () => {
    const [nmTipoAgente, setNmTipoAgente] = useState(''); 
    const [error, setError] = useState(null)
    const navigate = useNavigate(); 

    const Toast = MySwal.mixin({
        toast: true, 
        position: 'top',
        timer: 3000, 
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer); 
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    })

    const ToastSuccess = MySwalSuccess.mixin({
        toast: true, 
        position: 'top', 
        timer: 2000
    }); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(); 

        try {
            const response = await Api.post('/tipoagente/cadastrar', {
                nmTipoAgente
            });
            
            if (response.status === 200) {
                ToastSuccess.fire({
                    title: 'Cadastrado com sucesso',
                    icon: 'success'
                })
                navigate('listar')
            }
    } catch (err) {
        const errorMessage = err.response?.data?.messages || 'Não foi possível criar o Tipo de Agente'
            Toast.fire({
                title: 'Erro',
                text: errorMessage, 
                icon: 'error'
            })
    }
}

  return (
    <main>
        <h2>Cadastro Tipo Agente</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Tipo Agente:
                    <input type='text' value={nmTipoAgente} onChange={(e) => setNmTipoAgente(e.target.value)} required/>
                </label>
            </div>
            <div>
                <button type='submit'>Cadastrar</button>
            </div>
        </form>
    </main>
  )
}

export default CadastrarTipoAgente
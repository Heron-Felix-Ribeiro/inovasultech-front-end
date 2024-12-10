import React, { useEffect, useState } from 'react'
import Api from './Api'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal); 

const CadastroUsuario = () => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState(''); 
    const [error, setError] = useState(null);
    const [success, setSucess] = useState(null); 
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

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(null); 
        setSucess(null); 

        try {
            const response = await Api.post('/usuario/cadastrar', {
                login, 
                senha
            }); 

            if (response.status === 200) {
                 navigate("/login")
            }
        } catch (err) {
            const errorMessage = err.response?.data?.messages || 'Não foi possível criar a cidade'
            Toast.fire({
                title: 'Erro',
                text: errorMessage, 
                icon: 'error'
            })
        }
    }; 

  return (
    <main>
        <div >
            <h2>Cadastro do Usuário</h2>
            <form onSubmit={handleSubmit}> 
                <div>
                    <label>
                        Login:
                        <input type='text' value={login} onChange={(e) => setLogin(e.target.value)} required/>
                    </label>
                </div>
                <div>
                    <label>
                        Senha:
                        <input type='text' value={senha} onChange={(e) => setSenha(e.target.value)} required/>
                    </label>
                </div>
                <div className="button-container">
                    <button type='submit'>Cadastrar</button>
                </div>
            </form>
        </div>
    </main>
  )
}

export default CadastroUsuario
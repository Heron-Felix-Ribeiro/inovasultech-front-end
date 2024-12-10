import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Login = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (loginInput, senhaInput) => {
    try {
      console.log("Dados enviados para a API de login:", { login: loginInput, senha: senhaInput });
  
      const response = await axios.post('/api/usuario/login', {
        login: loginInput,
        senha: senhaInput,
      });
  
      console.log("Resposta da API de login:", response.data);
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        Swal.fire({
          title: 'Sucesso',
          text: 'Login bem-sucedido!',
          icon: 'success',
        }).then(() => {
          navigate("/listagemFiltrada/1");
        });
      } else {
        throw new Error("Resposta da API não contém token.");
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
  
      const errorMessage = error.response?.data?.messages || error.message || 'Erro desconhecido';
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao realizar login: ' + errorMessage,
        icon: 'error',
      }).then(() => {
        navigate("/");
      });
    }
  };  

  useEffect(() => {
    MySwal.fire({
      title: 'Login',
      html: `
        <div>
          <form id="login-form">
            <input 
              type="text" 
              placeholder="Login" 
              id="login-input" 
              style="margin-bottom: 10px; width: 100%;"
            />
            <input 
              type="password" 
              placeholder="Senha" 
              id="senha-input" 
              style="margin-bottom: 10px; width: 100%;"
            />
            <button 
              type="submit" 
              style="margin-bottom: 10px; width: 100%;"
            >
              Login
            </button>
          </form>
          <h4>Cadastre-se <a href="/cadastrar" onclick="Swal.close()">aqui</a></h4>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        document.getElementById('login-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const login = document.getElementById('login-input').value;
          const senha = document.getElementById('senha-input').value;
          handleLogin(login, senha); 
        });
      },
      didClose: () => {
        navigate("/"); 
      }
    });
  }, [navigate]);

  return <div>Exibindo modal de login...</div>;
};

export default Login;

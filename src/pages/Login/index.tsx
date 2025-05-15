import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Notification } from '../../components/Notification';
import { AccountService } from '../../services/accountService';
import logo from '../../assets/Logo.png';

export function Login() {
  useEffect(() => {
    document.title = "Gerenciador Mobile"
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
    {active:false, mensage:"", bgColor:""}
  );

  const handleLogin = async () => {
    try {
      if (email !== "" && password !== ""){
        await signInWithEmailAndPassword(auth, email, password);

        onAuthStateChanged(auth, async (user) => {
          if (user) {
              const uid = user.uid;
              const account = await AccountService.getAccount(uid);
              
              if (account.active) {
                navigate('/dashboard');
              } else {
                setShowNotification({
                  active: true, 
                  mensage: "Conta inativada", 
                  bgColor: "bg-orange-500"
                })
              }
          } 
      })

      } else {
        setShowNotification({
          active: true, 
          mensage: "Preencha todos os campos", 
          bgColor: "bg-orange-500"
        })
      } 
    } catch (error) {
      setShowNotification({
        active: true, 
        mensage: "E-mail ou senha invalido", 
        bgColor: "bg-orange-500"
      })
    }
  };

  const forgotpassword = async () => {
    try {
      await AccountService.redefinientPassword(sendEmail);
      setSendEmail('');
      setForgotPasswordModal(false);
    } catch (error) {

    }
  }

  return (
    <>
    {showNotification.active && (
      <Notification
      message={showNotification.mensage}
      bgColor={showNotification.bgColor}
      onClose={() => setShowNotification({active: false, mensage:"", bgColor:""})}
      />
    )}

<div className="flex h-screen w-full">
      {/* Área azul escura à esquerda */}
      <div className="bg-[#103356] w-2/3"></div>
      
      {/* Painel de login à direita */}
      <div className="bg-white w-1/3 p-8 flex flex-col h-[100%] justify-center">
        <div></div>
        {/* Logo */}
        <div className="mb-12 flex justify-center items-center">
            <img className='w-[60%]' src={logo}/>
        </div>
        
        {/* Título de login */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-600">Faça o login para ter acesso ao gerenciador web</p>
        </div>
        
        {/* Formulário */}
        <div className="space-y-6">
          {/* Campo de email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-800">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#7E7F7E" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="#7E7F7E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="pl-10 w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          
          {/* Campo de senha */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="pl-10 pr-10 w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#7E7F7E" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#7E7F7E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#103356" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#103356" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Link para recuperar senha */}
          <div className="flex items-center text-blue-500 text-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8.5C11.6022 8.5 11.2206 8.65804 10.9393 8.93934C10.658 9.22064 10.5 9.60218 10.5 10V10.107C10.5 10.2396 10.4473 10.3668 10.3536 10.4606C10.2598 10.5543 10.1326 10.607 10 10.607C9.86739 10.607 9.74021 10.5543 9.64645 10.4606C9.55268 10.3668 9.5 10.2396 9.5 10.107V10C9.5 9.33696 9.76339 8.70107 10.2322 8.23223C10.7011 7.76339 11.337 7.5 12 7.5H12.116C12.6029 7.50015 13.0781 7.64939 13.4777 7.92764C13.8772 8.20589 14.182 8.59982 14.351 9.05645C14.52 9.51308 14.5452 10.0105 14.4231 10.4819C14.301 10.9532 14.0375 11.3759 13.668 11.693L12.897 12.354C12.7727 12.4608 12.6728 12.5932 12.6043 12.7422C12.5358 12.8911 12.5002 13.0531 12.5 13.217V13.75C12.5 13.8826 12.4473 14.0098 12.3536 14.1036C12.2598 14.1973 12.1326 14.25 12 14.25C11.8674 14.25 11.7402 14.1973 11.6464 14.1036C11.5527 14.0098 11.5 13.8826 11.5 13.75V13.217C11.5 12.593 11.773 12.001 12.246 11.595L13.016 10.935C13.2307 10.751 13.384 10.5057 13.4551 10.232C13.5262 9.95831 13.5117 9.66942 13.4137 9.40419C13.3157 9.13895 13.1387 8.91011 12.9067 8.74846C12.6747 8.58681 12.3988 8.5001 12.116 8.5H12ZM12 16.5C12.1989 16.5 12.3897 16.421 12.5303 16.2803C12.671 16.1397 12.75 15.9489 12.75 15.75C12.75 15.5511 12.671 15.3603 12.5303 15.2197C12.3897 15.079 12.1989 15 12 15C11.8011 15 11.6103 15.079 11.4697 15.2197C11.329 15.3603 11.25 15.5511 11.25 15.75C11.25 15.9489 11.329 16.1397 11.4697 16.2803C11.6103 16.421 11.8011 16.5 12 16.5Z" fill="#235DFF"/>
              <path d="M3.5 12C3.5 9.74566 4.39553 7.58365 5.98959 5.98959C7.58365 4.39553 9.74566 3.5 12 3.5C14.2543 3.5 16.4163 4.39553 18.0104 5.98959C19.6045 7.58365 20.5 9.74566 20.5 12C20.5 14.2543 19.6045 16.4163 18.0104 18.0104C16.4163 19.6045 14.2543 20.5 12 20.5C9.74566 20.5 7.58365 19.6045 5.98959 18.0104C4.39553 16.4163 3.5 14.2543 3.5 12ZM12 4.5C10.0109 4.5 8.10322 5.29018 6.6967 6.6967C5.29018 8.10322 4.5 10.0109 4.5 12C4.5 13.9891 5.29018 15.8968 6.6967 17.3033C8.10322 18.7098 10.0109 19.5 12 19.5C13.9891 19.5 15.8968 18.7098 17.3033 17.3033C18.7098 15.8968 19.5 13.9891 19.5 12C19.5 10.0109 18.7098 8.10322 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z" fill="#235DFF"/>
            </svg>

            <a onClick={() => setForgotPasswordModal(true)} className="hover:underline">
              Esqueci minha senha
            </a>
          </div>
          
          {/* Botão de login */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 rounded-[44px] hover:bg-blue-600 text-white font-medium py-3 px-4 transition duration-200"
          >
            Login
          </button>
          
          {/* Link para cadastro */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Não possui conta? </span>
            <a onClick={() => setNewAccount(true) } className="text-blue-500 hover:underline">
              Cadastre-se.
            </a>
          </div>
        </div>
      </div>
    </div>

    {forgotPasswordModal && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-[8px] w-[25%]">
              <div className="flex justify-between h-[10%] mb-3">
                  <div className="font-bold h-[24px] justify-center text-[18px] pl-8 flex items-center w-[90%]">
                      ESQUECI A SENHA
                  </div>
                  <button type="button" onClick={() => {
                          setForgotPasswordModal(false);
                          setSendEmail('');
                      }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </button>
              </div>

              <div className="text-center mt-10 mb-10">
                  Digite o E-mail da sua conta e clique em “Enviar” para receber um E-mail para redefinir a senha
                  <input className='mt-6 h-[45px] w-[100%] focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2' 
                    type="email" onChange={(e) => setSendEmail(e.target.value)}
                    placeholder='E-mail'/>
              </div>


              
              <div className="h-[20%] flex justify-between items-center gap-4 *:font-bold *:py-1 *:px-10">
                  <button onClick={() => setForgotPasswordModal(false)} 
                      className="w-[300px] text-[#313231] shadow-md rounded-[8px] hover:bg-mygray-600 hover:text-white">
                      CANCELAR
                  </button>
                  <button type="button" 
                      onClick={forgotpassword} 
                      className="w-[300px] border-[2px] border-blue-500 shadow-md bg-blue-500 hover:bg-blue-600 rounded-[8px] text-white">
                      ENVIAR
                  </button>
              </div>
          </div>
      </div>
    )}

    {newAccount && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-[8px] w-[25%]">
              <div className="flex justify-between h-[10%] mb-3">
                  <div className="font-bold h-[24px] justify-center text-[18px] pl-8 flex items-center w-[90%]">
                      CRIAR CONTA
                  </div>
                  <button type="button" onClick={() => {
                          setNewAccount(false);
                      }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </button>
              </div>

              <div className="text-center mt-10 mb-5">
                <div className="flex mt-[50px] mb-4 items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_514_1034)">
                          <path d="M41.625 2H18.375L1.875 18.25V41.7501L18.375 58.0001H41.625L58.125 41.7501V18.25L41.625 2Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M29.875 46.25C31.946 46.25 33.625 44.5712 33.625 42.5C33.625 40.429 31.946 38.75 29.875 38.75C27.8038 38.75 26.125 40.429 26.125 42.5C26.125 44.5712 27.8038 46.25 29.875 46.25Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M34.875 17.5C34.875 20.25 29.875 31.25 29.875 31.25C29.875 31.25 24.8749 20.25 24.8749 17.5C24.8749 14.75 27.125 12.5 29.875 12.5C32.625 12.5 34.875 14.75 34.875 17.5Z" stroke="#F97316" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      <defs>
                          <clipPath id="clip0_514_1034">
                              <rect width="60" height="60" fill="white"/>
                          </clipPath>
                      </defs>
                  </svg>
                </div>
                Entre em contato com o administrador do sistema para criar sua conta
              </div>
          </div>
      </div>
    )}
    </>
  )
}

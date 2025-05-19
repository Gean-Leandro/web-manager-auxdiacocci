import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { UserCog } from "lucide-react";

export function NewAccount() {
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [accountItem, setAccountItem] = useState<IAccount>({uid: '', name: '', email:'', level:'', active: true, historic: []});
    const [level, setLevel] = useState<string>('user');
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [erro, setErro] = useState<{campo: string, mensage: string}>({campo: '', mensage:''});
    const [password, setPassword] = useState<{password: string, confirmPassword: string}>({password:'', confirmPassword:''})
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [passwordAccount, setPasswordAccount] = useState<string>('');
    const [login, setLogin] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLevel(e.target.value);
    };

    useEffect(() => {
        document.title = "Criando nova conta";
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const query = await AccountService.getAccountLevel(uid);
                setLogin(query);
            } 
        })
        return () => {
            unsubscribe();
        };
    }, []);

    const validateFields = ():boolean => {
        if (accountItem.name !== '' && accountItem.email !== '' && password.password !== '' && password.confirmPassword !== "") {
            const nomeRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/.test(accountItem.name);
            const emailRegex = /^[^\s@]+@[^\s@]+\.(com|com\.br)$/.test(accountItem.email);
            
            if (!nomeRegex){
                setErro({campo: 'name', mensage: "Nome inválido"})
                return false;
            }
            
            if (!emailRegex){
                setErro({campo: 'email', mensage: "E-mail inválido"})
                return false;
            }
            
            if (password.password !== password.confirmPassword){
                setErro({campo: 'password', mensage: "Senha está diferente"})
                return false;
            } else if (password.password.length < 8) {
                setErro({campo: 'password', mensage: "Senha precisa de no mínimo 8 caracteres"})
                return false;
            }
            
            setErro({campo: '', mensage: ""})
            return true;
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            });
            return false;
        }
    }

    const navigate = useNavigate();
    
    const addNewAccount = async () => {
        setDisableButton(true);
        if (validateFields()){
            try {
                await AccountService.new(accountItem.email, password.password, accountItem.name, level, passwordAccount);
                navigate('/contas');
                setShowNotification({
                    active: true, 
                    mensage: "Nova conta cadastrada", 
                    bgColor: "bg-green-600"
                });
            } catch (error) {
                setShowNotification({
                    active: true, 
                    mensage: "Error:" + error, 
                    bgColor: "bg-orange-500"
                });
            }
        }
        setDisableButton(false);
    }

    return(
        <>
        {showNotification.active && (
            <Notification
            message={showNotification.mensage}
            bgColor={showNotification.bgColor}
            onClose={() => setShowNotification({active: false, mensage:"", bgColor:""})}
            />
        )}


        <div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={7}/>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center py-6">
                    <div className="py-2 pl-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <UserCog className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Nova conta</h1>
                        </div>
                        <p className="text-gray-500">Preencha o cadastro para criar uma nova conta</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">CRIANDO CONTA</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                        <input 
                        value={accountItem.name}
                        onChange={(e) => {
                            setAccountItem((prev) => ({...prev, name:e.target.value}));
                        }}
                        placeholder="Nome"
                        className={`${erro.campo === "name" ? 'border-red-600': 'border-gray-500'} border rounded-md px-3 py-2 w-full`}
                        />
                        <p className={`${erro.campo === "name"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-MAIL:</label>
                        <input 
                        value={accountItem.email}
                        onChange={(e) => {
                            setAccountItem((prev) => ({...prev, email:e.target.value}));
                        }}
                        placeholder="E-mail"
                        className={`${erro.campo == "email" ? 'border-red-600': 'border-gray-500'} border rounded-md px-3 py-2 w-full`}
                        />
                        <p className={`${erro.campo === "email"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIVEL:</label>
                        <div className="flex space-x-6">
                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChange}
                                    checked={level === "user"}
                                    name="level" 
                                    value={'user'}/>
                                <span className="ml-2 text-sm text-gray-700">Usuário</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChange}
                                    checked={level === "admin"}
                                    name="level" 
                                    value={'admin'}/>
                                <span className="ml-2 text-sm text-gray-700">Administrador</span>
                            </label>
                        </div>
                    </div>
                
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">SENHA:</label>
                        <input type="password"
                            value={password.password}
                            onChange={(e) => {
                                setPassword((prev) => ({...prev, password:e.target.value}));
                            }}
                            placeholder="Senha"
                            className={`${erro.campo == "password" ? 'border-red-600': 'border-gray-500'} border rounded-md px-3 py-2 w-full`} 
                        />
                        <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CONFIMAR SENHA:</label>
                        <input type="password"
                            value={password.confirmPassword}
                            onChange={(e) => {
                                setPassword((prev) => ({...prev, confirmPassword:e.target.value}));
                            }}
                            placeholder="Confirmar senha"
                            className={`${erro.campo == "password" ? 'border-red-600': 'border-gray-500'} border rounded-md px-3 py-2 w-full`} 
                            />
                        <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                    </div>
                
                    <div className="flex justify-end space-x-4 mt-8">
                        <Link to={'/contas'} className="border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </Link>

                        <button type="button"
                            onClick={() => setConfirmModal(true)}
                            disabled={disableButton} 
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            CADASTRAR
                        </button>
                    </div>
                </div>
            </div>       
        </div>

        {confirmModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px] w-[25%]">
                    <div className="flex justify-between h-[10%] mb-10">
                        <div className="font-bold h-[24px] justify-center text-[18px] pl-8 flex items-center w-[90%]">
                            CONFIRMAÇÃO
                        </div>
                        <button type="button" onClick={() => {
                                setConfirmModal(false);
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="text-center mb-5">
                        Digite a sua senha para criar a conta
                        <div className="mt-3">
                            <input className="mt-6 h-[45px] w-[100%] focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2" 
                                onChange={(e) => setPasswordAccount(e.target.value)}
                                type="password" 
                                placeholder="Senha"/>
                        </div>
                    </div>

                    <div className="h-[5%] flex justify-end items-center gap-2 *:font-bold *:py-1 *:px-10">
                        <button onClick={() => setConfirmModal(false)} 
                            className="flex justify-center items-center border border-gray-500 bg-white text-gray-800 w-[150px] px-1 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button" 
                            onClick={addNewAccount} 
                            className="flex justify-center items-center w-[150px] bg-gray-900 text-white px-10 py-2 rounded-md hover:bg-gray-800">
                            CRIAR
                        </button>
                    </div>
                </div>
            </div>
        )}  
        </>
    )
}
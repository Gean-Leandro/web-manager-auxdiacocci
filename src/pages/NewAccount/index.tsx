import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export function NewAccount() {
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [accountItem, setAccountItem] = useState<IAccount>({uid: '', name: '', email:'', level:'', active: true});
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

        <div className="grid grid-cols-[250px_1fr] h-screen">
            <Sidebar levelAccount={login}/>
            <div className="px-[15svh] overflow-y-auto">
                <div className="rounded-[8px] bg-mygray-300 flex items-center px-8 mt-5 h-[10svh] text-[25px]">
                    NOVA CONTA
                </div>

                <div className="flex items-center justify-start mt-[10%] mb-16">
                    <div className="bg-mygray-200 p-4 rounded-[8px] border-[2px] border-mygray-500">

                        {/* Campo Nome */}
                        <div className="mb-6 w-[100%]">
                            <p>Name:</p> 
                            <input className={`${erro.campo === "name" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px]  rounded-[8px] pl-2 h-[35px] w-[400px]`}
                            type="text" 
                            placeholder="Nome"
                            onChange={(e) => setAccountItem((prev) => ({...prev, name:e.target.value}))}
                            />
                            <p className={`${erro.campo === "name"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                        </div>
                        
                        {/* Campo E-mail */}
                        <div className="mb-6 w-[100%]">
                            <p>E-mail:</p> 
                            <input className={`${erro.campo == "email" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}
                            type="text" 
                            placeholder="E-mail"
                            onChange={(e) => setAccountItem((prev) => ({...prev, email:e.target.value}))}
                            />
                            <p className={`${erro.campo === "email"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                        </div>

                        {/* Campo Nivel */}
                        <div className="mb-6 w-[100%]">
                            <p>Nível:</p>
                            <div className="h-[45px] bg-mygray-200 flex items-center *:items-center rounded-[8px] px-2 gap-20">
                                <label className="flex gap-2">
                                    <input 
                                        onChange={handleChange}
                                        checked={level === "user"}
                                        type="radio" 
                                        name="category" 
                                        value={'user'}/>
                                    Usuário
                                </label>
                                <label className="flex gap-2">
                                    <input 
                                        onChange={handleChange}
                                        checked={level === "admin"}
                                        type="radio" 
                                        name="category" 
                                        value={'admin'}/>
                                    Administrador
                                </label>
                            </div>
                        </div>

                        {/* Campo senha */}
                        <div className="mb-4 w-[100%]">
                            <p>Senha:</p> 
                            <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}
                            type="password" 
                            placeholder="Senha"
                            onChange={(e) => setPassword((prev) => ({...prev, password:e.target.value}))}
                            />
                            <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                        </div>

                        {/* Campo confirmar senha */}
                        <div className="w-[100%]">
                            <p>Confirmar senha:</p> 
                            <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}
                            type="password" 
                            placeholder="Confirmar senha"
                            onChange={(e) => setPassword((prev) => ({...prev, confirmPassword:e.target.value}))}
                            />
                            <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                        </div>

                    </div>

                </div>
                
                <div className="col-span-6 mb-5 flex justify-end gap-4 *:font-bold *:py-4 *:px-10">
                    <Link to={'/contas'} className="border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                        CANCELAR
                    </Link>
                    <button type="button"
                        onClick={() => setConfirmModal(true)}
                        disabled={disableButton} 
                        className="bg-black rounded-[8px] text-white hover:bg-mygray-600">
                        CADASTRAR
                    </button>
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
                                <input className="mt-2 h-[45px] w-[100%] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2" 
                                    onChange={(e) => setPasswordAccount(e.target.value)}
                                    type="password" 
                                    placeholder="Senha"/>
                            </div>
                        </div>


                        
                        <div className="h-[5%] flex justify-between items-center gap-4 *:font-bold *:py-1 *:px-10">
                            <button onClick={() => setConfirmModal(false)} 
                                className="w-[300px] border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                                CANCELAR
                            </button>
                            <button type="button" 
                                onClick={addNewAccount} 
                                className="w-[300px] border-[2px] border-black bg-black rounded-[8px] text-white hover:bg-mygray-600">
                                CRIAR
                            </button>
                        </div>
                    </div>
                </div>
            )}    
        </div>
        </>
    )
}
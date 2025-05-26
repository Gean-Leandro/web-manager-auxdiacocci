import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { UserCog } from "lucide-react";
import { ScreamLoading } from "../../components/ScreamLoading";

export function EditAccount() {
    const location = useLocation();
    const navigate = useNavigate();
    const locateAccount = location.state

    useEffect(() => {
        document.title = "Editando conta";
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const query = await AccountService.getAccountLevel(uid);
                setLogin(query);

                if (!locateAccount) {
                    if (query === 'admin') {
                        navigate('/contas');
                    } else {
                        navigate('/dashboard')
                    }
                }
            } 
        })
        return () => {
            if (!location.state) {
                navigate('/contas');
            }
            unsubscribe();
        };
    }, [location, navigate]);

    if (!location.state) {
        return <p>Você acessou esta página de forma incorreta.</p>;
    }

    
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [accountItem, setAccountItem] = useState<IAccount>(location.state);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [erro, setErro] = useState<{campo: string, mensage: string}>({campo: '', mensage:''});
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountItem((prev) => ({...prev, level:e.target.value}));
    };
    const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == 'active'){
            setAccountItem((prev) => ({...prev, active:true}));
        } else {
            setAccountItem((prev) => ({...prev, active:false}));
        }
    };

    const validateFields = ():boolean => {
        if (accountItem.name !== '') {
            const nomeRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/.test(accountItem.name);
            if (!nomeRegex){
                setShowNotification({
                    active: true, 
                    mensage: "Nome inválido", 
                    bgColor: "bg-orange-500"
                });
                return false;
            } 
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
    
    const updateAccount = async () => {
        setLoad(true);
        setDisableButton(true);
        if (validateFields()){
            try {
                await AccountService.updateAccount(accountItem);
                setShowNotification({
                    active: true, 
                    mensage: "Conta atualizada", 
                    bgColor: "bg-green-600"
                });
                navigate('/contas');
            } catch (error) {
                setShowNotification({
                    active: true, 
                    mensage: "Error: " + error, 
                    bgColor: "bg-orange-500"
                });
            }
        }
        setConfirmModal(false);
        setDisableButton(false);
        setLoad(false);
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
        {load && <ScreamLoading/>}
        <div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={7}/>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center py-6">
                    <div className="py-2 pl-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <UserCog className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Editando conta</h1>
                        </div>
                        <p className="text-gray-500">Modifique informações da conta</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">CONTA</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                        <input 
                        value={accountItem.name}
                        onChange={(e) => {
                            setAccountItem((prev) => ({...prev, name:e.target.value}));
                        }}
                        placeholder="Nome"
                        className={`${erro.campo === "name" ? 'border-red-600': 'border-mygray-500'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                        <p className={`${erro.campo === "name"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-MAIL:</label>
                        <input 
                        value={accountItem.email}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIVEL:</label>
                        <div className="flex space-x-6">
                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChange}
                                    checked={accountItem.level === "user"}
                                    name="level" 
                                    value={'user'}/>
                                <span className="ml-2 text-sm text-gray-700">Usuário</span>
                            </label>

                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChange}
                                    checked={accountItem.level === "admin"}
                                    name="level" 
                                    value={'admin'}/>
                                <span className="ml-2 text-sm text-gray-700">Administrador</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CONTA:</label>
                        <div className="flex space-x-6">
                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChangeActive}
                                    checked={accountItem.active === true}
                                    name="Active" 
                                    value={'active'}/>
                                <span className="ml-2 text-sm text-gray-700">Ativa</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" className="h-4 w-4 text-blue-600" 
                                    onChange={handleChangeActive}
                                    checked={accountItem.active === false}
                                    name="Active" 
                                    value={'inactive'}/>
                                <span className="ml-2 text-sm text-gray-700">Desativada</span>
                            </label>
                        </div>
                    </div>
                
                
                    <div className="flex justify-end space-x-4 mt-8">
                        <Link to={'/contas'} className="border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </Link>

                        <button type="button"
                            onClick={() => {setConfirmModal(true)}}
                            disabled={disableButton} 
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            ATUALIZAR
                        </button>
                    </div>
                </div>
            </div>       
        </div>

        {confirmModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px]">
                    <div className="flex justify-between h-[10%] mb-3">
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
                        Deseja salvar as alterações?
                    </div>


                    
                    <div className="h-[5%] flex justify-between items-center gap-4 *:font-bold *:py-1 *:px-10">
                        <button onClick={() => setConfirmModal(false)} 
                            className="flex justify-center items-center border border-gray-500 bg-white text-gray-800 w-[150px] px-1 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button" 
                            onClick={updateAccount} 
                            className="flex justify-center items-center w-[150px] bg-gray-900 text-white px-10 py-2 rounded-md hover:bg-gray-800">
                            ATUALIZAR
                        </button>
                    </div>
                </div>
            </div>
        )}  
        </>
    )
}
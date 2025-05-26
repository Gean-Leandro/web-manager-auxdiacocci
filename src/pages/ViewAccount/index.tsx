import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { UserCog } from "lucide-react";

export function ViewAccount() {
    const location = useLocation();
    const navigate = useNavigate();

    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [login, setLogin] = useState<string>('');
    const [account, setAccount] = useState<IAccount>({uid: '', name:'', email: '', level: '', active: true, historic: []});

    useEffect(() => {
        document.title = "Visualizando conta";
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const query = await AccountService.getAccountLevel(uid);
                setLogin(query);
                const queryAccountView = await AccountService.getAccount(location.state);
                setAccount(queryAccountView);
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
                            <h1 className="text-2xl font-bold">Visualizando conta</h1>
                        </div>
                        <p className="text-gray-500">Visualize informações da conta</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">CONTA</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                        <input 
                        value={account.name}
                        disabled={true}
                        placeholder="Nome"
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-MAIL:</label>
                        <input 
                        value={account.email}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIVEL:</label>
                        <input 
                        value={account.level === 'admin' ? 'Administrador' : 'Usuário'}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CONTA:</label>
                        <input 
                        value={account.active ? 'Ativa' : 'Desativada'}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>
                
                
                    <div className="flex justify-end space-x-4 mt-8">
                        <Link to={'/contas'} className="border border-gray-500 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            VOLTAR
                        </Link>

                        <Link to={'/editando-conta'} 
                            state={account}
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            EDITAR
                        </Link>
                    </div>
                </div>
                
                {/* Atividades recentes */}
                <div className="my-6 bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Atividades recente</h2>
                        { account.historic.length === 0  &&
                            <p className="text-blue-600">você ainda não adicionou nenhuma entrada</p>
                        }
                    </div>
                    
                    <div className='border-t flex w-[100%] items-center py-2 border-b hover:bg-gray-50'>
                        <div className='w-[20%]'>
                            <p className='border-x flex justify-center items-center font-bold'>Tipo</p>
                        </div>
                        <div className='w-[40%]'>
                            <p className='border-x flex justify-center items-center font-bold'>Item</p>
                        </div>
                        <div className='w-[20%]'>
                            <p className='border-x flex justify-center items-center font-bold'>Entidade</p>
                        </div>
                        <div className='w-[20%]'>
                            <p className='border-x flex justify-center items-center font-bold'>Data/Hora</p>
                        </div>
                    </div>
                    {/* Área vazia com ícone */}
                    <div className="h-[220px] overflow-y-auto border-t-4">
                        { account.historic.length === 0 ?
                            <div className='w-[100%] h-[100%] flex justify-center items-center'>
                                <div className="bg-gray-100 p-6 rounded-full mb-4">
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-300" stroke="currentColor" fill="none">
                                        <circle cx="12" cy="12" r="10" strokeWidth="1" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>:

                            <>
                                { account.historic.map((item, index) => (
                                    <div key={index} 
                                        className="flex w-[100%] items-center justify-between border-b hover:bg-gray-50">
                                        
                                        <p className='border-x w-[20%] p-2 flex h-[100%] justify-center break-words items-center'>
                                            {item.action}
                                        </p>
                                        <p className='w-[40%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.name}
                                        </p>
                                        <p className='border-l w-[20%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.entity}
                                        </p>
                                        <p className='border-x w-[20%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.timestamp.toDate().toLocaleString()}
                                        </p>
                                    </div>
                                ))
                                }
                            </>
                        }
                    </div>
                </div>   
            </div>
        </div>
        </>
    )
}
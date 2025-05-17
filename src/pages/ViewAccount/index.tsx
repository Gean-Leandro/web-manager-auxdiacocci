import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { UserCog } from "lucide-react";

export function ViewAccount() {
    const location = useLocation()

    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );

    const [login, setLogin] = useState<string>('');
    const [account, setAccount] = useState<IAccount>(location.state);

    useEffect(() => {
        document.title = "Visualizando conta";
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
                            CANCELAR
                        </Link>

                        <Link to={'/editando-conta'} 
                            state={account}
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            EDITAR
                        </Link>
                    </div>
                </div>
            </div>       
        </div>
        </>
    )
}
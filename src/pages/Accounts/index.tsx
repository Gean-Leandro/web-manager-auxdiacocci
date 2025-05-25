import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { Edit2, Eye, Plus, UserCog } from "lucide-react";

export function Accounts() {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [busca, setBusca] = useState<string>('');
    const [login, setLogin] = useState<string>("");

    useEffect(() => {
        document.title = "Contas";
        const fetchAccounts = async () => {
            const query = await AccountService.getAccounts();
            if (query.status === "OK") {
                setAccounts(query.result);
            } else {
                setShowNotification({
                    active: true, 
                    mensage: query.status, 
                    bgColor: "bg-orange-500"
                })
            }
        }
        fetchAccounts();
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

    const handleBuscar = () => {
        filtradas
    };

    const filtradas = useMemo(() => {
        return accounts
          .filter(item => item.email.toLowerCase().includes(busca.toLowerCase()))
          .sort((a, b) => a.email.localeCompare(b.email));
      }, [accounts, busca]);

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

            <div className="flex-grow overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <UserCog className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Contas</h1>
                        </div>
                        <p className="text-gray-500">Gerencie as contas de usuários</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden">
                        <div className="p-4 border-b bg-white">
                        <h2 className="text-lg font-semibold">Lista de contas</h2>
                        </div>
                        
                        {/* Search and Add */}
                        <div className="p-4 bg-gray-100">
                            <div className="flex items-center">
                                <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="E-mail"
                                    className="w-full pl-4 pr-24 py-2 border border-gray-500 rounded"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                                <button type="button" 
                                    onClick={handleBuscar} 
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-blue-800 bg-blue-600 text-white rounded-r">
                                    BUSCAR
                                </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Species List - Simple Version like second image */}
                        <div className="max-h-80 overflow-y-auto">
                        {filtradas.length !== 0 ? filtradas.map((user) => (
                            <div 
                                key={user.uid} 
                                className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                                >
                                <div className="font-medium w-[33%]">{user.name}</div>
                                
                                <div className="font-medium text-gray-500 w-[33%] pl-28">{user.email}</div>

                                <div className="flex space-x-2 w-[33%] justify-end">
                                    <Link to={'/editando-conta'} state={user} className={`${login !== "admin"? "hidden" : ""} p-1 text-gray-600 hover:text-blue-600`}>
                                        <Edit2 size={18} />
                                    </Link>
                                    <Link to={'/visualizando-conta'} state={user.uid} className="p-1 text-gray-600 hover:text-blue-600">
                                        <Eye size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                        :   <div className="h-[100%] w-[100%] py-10 flex justify-center items-center text-mygray-700">
                                Nenhuma conta cadastrada
                            </div>
                        }
                        </div>
                        
                        {/* Cadastrar Button */}
                        <div className="p-4 border-t flex justify-end items-center">
                            <Link to={'/nova-conta'} className="flex items-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600">
                                <Plus size={18} className="mr-1" />
                                <span>CADASTRAR</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        </>
    )
}
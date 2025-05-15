import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { query } from "firebase/firestore";

export function Accounts() {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [filtradas, setFiltradas] = useState<IAccount[]>([]);
    const [busca, setBusca] = useState<string>('');
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>("");

    useEffect(() => {
        document.title = "Contas";
        const fetchAccounts = async () => {
            const query = await AccountService.getAccounts();
            if (query.status === "OK") {
                setAccounts(query.result);
                setFiltradas(query.result);
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
        if (busca.trim() === ''){
            setFiltradas(accounts);
        } else {    
            const resultado = accounts.filter((item) =>
                item.email.toLowerCase().includes(busca.toLowerCase())
            );
            setFiltradas(resultado);
        }
    };

    const updateAccountsList = async () => {
        const query = await AccountService.getAccounts();

        if (query.status === "OK") {
            setAccounts(query.result);
            setFiltradas(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const deleteAccount = async () => {
        try {
            // await ScientificNamesService.delete(idDelet);
            updateAccountsList();
            setShowNotification({
                active: true, 
                mensage: "Nome científico excluida", 
                bgColor: "bg-green-600"
            })
            setConfirmModal(false);
        } catch (error) {
            setShowNotification({
                active: true, 
                mensage: "Error:" + error, 
                bgColor: "bg-orange-500"
            })
            setConfirmModal(false);
        }
    }

    
    // if (login === "user"){
    //     return (
    //         useNavigate()('/cadastros-eimerias')
    //     )
    // }

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
                    CONTAS
                </div>

                <div className="flex items-center justify-start mt-[10%]">
                    <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500">

                        {/* Campo buscar */}
                        <div className="mb-2 w-[100%] flex justify-center items-center">
                            <input className="bg-white border-[2px] border-r-[0px] border-mygray-500 rounded-l-[8px] pl-2 h-[35px] w-[400px]"
                            type="text" 
                            placeholder="E-mail"
                            onChange={(e) => setBusca(e.target.value)}/>
                            <button type="button" onClick={handleBuscar}
                                className="bg-mygray-900 hover:bg-mygray-600 text-white font-bold h-[35px] w-[100px]  rounded-r-[8px]">
                                BUSCAR
                            </button>
                        </div>

                        
                        <div className="bg-white rounded-[8px] p-2 border-[2px] border-mygray-500">
                            <div className="h-[40svh]  overflow-y-auto w-[100%]">
                                {filtradas.length > 0 ? 
                                <ul>
                                    { filtradas.map((item) => (
                                        <li className="p-2 border-b flex items-center justify-between">
                                        {item.email}
                                        <div className="flex items-center gap-2 *:p-1">
                                            <Link to={'/editando-conta'} state={item}
                                                className="hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Pencil-1--Streamline-Ultimate" height="24" width="24"><desc>Pencil 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.19 1.81002c-0.3406 -0.33916 -0.7449 -0.60748 -1.1898 -0.78945 -0.4449 -0.181969 -0.9214 -0.273985 -1.402 -0.270731 -0.4806 0.003255 -0.9558 0.101715 -1.3982 0.289691 -0.4423 0.18798 -0.8431 0.46175 -1.179 0.80549L2.521 16.345 0.75 23.25l6.905 -1.771 14.5 -14.49998c0.3437 -0.33593 0.6175 -0.73665 0.8055 -1.17901 0.188 -0.44235 0.2864 -0.91756 0.2897 -1.39819 0.0032 -0.48063 -0.0888 -0.95713 -0.2707 -1.40199 -0.182 -0.44486 -0.4503 -0.84925 -0.7895 -1.18981Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m16.606 2.26001 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.512 4.354 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m2.521 16.345 5.139 5.129" stroke-width="1.5"></path></svg>
                                            </Link>

                                            <Link to={'/visualizando-conta'} state={item}
                                                className="hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Search-Circle--Streamline-Ultimate" height="24" width="24"><desc>Search Circle Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 12c0 2.9837 1.18526 5.8452 3.29505 7.955C6.15483 22.0647 9.01631 23.25 12 23.25c2.9837 0 5.8452 -1.1853 7.955 -3.295 2.1097 -2.1098 3.295 -4.9713 3.295 -7.955 0 -2.98369 -1.1853 -5.84517 -3.295 -7.95495C17.8452 1.93526 14.9837 0.75 12 0.75c-2.98369 0 -5.84517 1.18526 -7.95495 3.29505C1.93526 6.15483 0.75 9.01631 0.75 12Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75 11.125c0 1.1603 0.46094 2.2731 1.28141 3.0936 0.82047 0.8205 1.93327 1.2814 3.09359 1.2814 1.1603 0 2.2731 -0.4609 3.0936 -1.2814 0.8205 -0.8205 1.2814 -1.9333 1.2814 -3.0936 0 -1.16032 -0.4609 -2.27312 -1.2814 -3.09359C13.3981 7.21094 12.2853 6.75 11.125 6.75c-1.16032 0 -2.27312 0.46094 -3.09359 1.28141C7.21094 8.85188 6.75 9.96468 6.75 11.125Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.219 14.218 3.031 3.032" stroke-width="1.5"></path></svg>
                                            </Link>
                                        </div>
                                    </li>
                                    )) }
                                </ul>
                            :   <div className="h-[100%] w-[100%] flex justify-center items-center text-mygray-700">
                                    Nenhuma conta cadastrada
                                </div>
                            }
                            </div>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link to={'/nova-conta'}
                                className="border-[2px] flex gap-2 border-black rounded-[8px] py-2 px-4 font-bold hover:bg-white">
                                CADASTRAR 
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5 1C13.5 0.447715 13.0523 0 12.5 0C11.9477 0 11.5 0.447715 11.5 1H13.5ZM11.5 22.2789C11.5 22.8312 11.9477 23.2789 12.5 23.2789C13.0523 23.2789 13.5 22.8312 13.5 22.2789H11.5ZM1 10.6395C0.447715 10.6395 0 11.0872 0 11.6395C0 12.1917 0.447715 12.6395 1 12.6395V10.6395ZM24 12.6395C24.5523 12.6395 25 12.1917 25 11.6395C25 11.0872 24.5523 10.6395 24 10.6395V12.6395ZM11.5 1V11.6395H13.5V1H11.5ZM11.5 11.6395V22.2789H13.5V11.6395H11.5ZM12.5 10.6395H1V12.6395H12.5V10.6395ZM1 12.6395H23.2581V10.6395H1V12.6395ZM23.2581 12.6395H23.629V10.6395H23.2581V12.6395ZM23.629 12.6395H24V10.6395H23.629V12.6395Z" fill="black"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>        
        </div>
        </>
    )
}
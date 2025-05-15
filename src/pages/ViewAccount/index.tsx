import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export function ViewAccount() {
    const location = useLocation()

    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );

    const [login, setLogin] = useState<IAccount>(location.state);

    useEffect(() => {
        document.title = "Visualizando conta";
    }, []);

    const navigate = useNavigate();

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
            <Sidebar levelAccount={login.level}/>
            <div className="px-[15svh] overflow-y-auto">
                <div className="rounded-[8px] bg-mygray-300 flex items-center px-8 mt-5 h-[10svh] text-[25px]">
                    VISUALIZANDO CONTA
                </div>

                <div className="flex items-center justify-start mt-[10%] mb-16">
                    <div className="bg-mygray-200 p-4 rounded-[8px] border-[2px] border-mygray-500">

                        {/* Campo Nome */}
                        <div className="mb-6 w-[100%]">
                            <p>Name:</p> 
                            <p className={`flex items-center mt-2 border-mygray-500 bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}>
                                {login.name}
                            </p>
                        </div>
                        
                        {/* Campo E-mail */}
                        <div className="mb-6 w-[100%]">
                            <p>E-mail:</p> 
                            <p className={`flex items-center mt-2 border-mygray-500 bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}>
                                {login.email}
                            </p>
                        </div>

                        {/* Campo Nivel */}
                        <div className="mb-6 w-[100%]">
                            <p>Nível:</p>
                            <p className={`flex items-center mt-2 border-mygray-500 bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}>
                                {login.level === 'admin' ? 'Administrador' : 'Usuário'}
                            </p>
                        </div>
                        
                        {/* Campo Status */}
                        <div className="w-[100%]">
                            <p>Conta:</p>
                            <p className={`flex items-center mt-2 border-mygray-500 bg-white border-[2px] rounded-[8px] pl-2 h-[35px] w-[400px]`}>
                                {login.active ? 'Ativa' : 'Inativa'}
                            </p>
                        </div>
                    </div>

                </div>
                
                <div className="col-span-6 flex justify-end gap-4 *:font-bold *:py-4 *:px-10">
                    <Link to={'/contas'} className="border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                        VOLTAR
                    </Link>
                    <Link to={'/editando-conta'} state={login}
                        className="bg-black rounded-[8px] text-white hover:bg-mygray-600">
                        EDITAR
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}
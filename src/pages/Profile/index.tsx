import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { Edit2, User } from "lucide-react";
import { ScreamLoading } from "../../components/ScreamLoading";

export function Profile() {
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<IAccount>({uid:'', name:'', email: '', level:'', active: true, historic: []});
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<{oldPassword: string, password:string, confirmPassword:string}>({oldPassword: '', password:'', confirmPassword:''});
    const [editName, setEditName] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);
    const [erro, setErro] = useState<{campo: string, mensage: string}>({campo: '', mensage:''});
    const [load, setLoad] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Perfil";
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const query = await AccountService.getAccount(uid);
                setLogin(query);
            } 
        })
        return () => {
            unsubscribe();
        };
    }, [login]);

    const validateFields = ():boolean => {

        if (editName) {

            if (name !== '') {
                const nomeRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/.test(name);
                
                if (!nomeRegex){
                    setErro({campo: 'name', mensage: "Nome inválido"})
                    return false;
                }
                
                setErro({campo: '', mensage: ""})
                return true;
            }
        } 

        if(editPassword) {
            if (password.password !== '' && password.confirmPassword !== "") {
                
                if (password.password !== password.confirmPassword){
                    setErro({campo: 'password', mensage: "Senha está diferente"})
                    return false;
                } else if (password.password.length < 8) {
                    setErro({campo: 'password', mensage: "Senha precisa de no mínimo 8 caracteres"})
                    return false;
                }
                
                setErro({campo: '', mensage: ""})
                return true;
            }
        }
        
        setShowNotification({
            active: true, 
            mensage: "Preencha todos os campos", 
            bgColor: "bg-orange-500"
        });
        return false;
    }

    const updateAccount = async () => {
        setDisableButton(true);
        setLoad(true);
   
        if (validateFields()) {
            try {
                if(editName) {
                    await AccountService.updateAccount(login, name);
                }
                if(editPassword) {
                    await AccountService.updatePasswordAccount(password.oldPassword, password.password);
                }

                const query = await AccountService.getAccount(login.uid);
                setLogin(query);
                setEditName(false);
                setEditPassword(false);
                setShowNotification({
                    active: true, 
                    mensage: "Dados atualizados", 
                    bgColor: "bg-green-600"
                });

            } catch (error) {
                setShowNotification({
                    active: true, 
                    mensage: "" + error, 
                    bgColor: "bg-orange-500"
                });
            }
        }
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
            <Sidebar levelAccount={login.level} selected={6}/>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center py-6">
                    <div className="py-2 pl-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <User className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Perfil</h1>
                        </div>
                        <p className="text-gray-500">Visualize informações da sua conta</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">CONTA</h2>
                    
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                        <input 
                        value={login.name}
                        disabled={true}
                        placeholder="Nome"
                        className={`${editName && 'hidden'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                        onChange={(e) => setLogin(prev => ({...prev, name:e.target.value}))}
                        />
                        <input 
                        value={name}
                        disabled={false}
                        placeholder="Nome"
                        className={`${!editName && 'hidden'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                        onChange={(e) => setName(e.target.value)}
                        />
                        <button onClick={() => {
                            setName(login.name);
                            setEditName(true);
                        }} 
                            type="button" 
                            className={`${editName && "hidden"} absolute right-2 top-[50%] p-1 text-gray-600 hover:text-blue-600`}>
                            <Edit2 size={20} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-MAIL:</label>
                        <input 
                        value={login.email}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIVEL:</label>
                        <input 
                        value={login.level === 'admin' ? 'Administrador' : 'Usuário'}
                        disabled={true}
                        className={`border border-gray-500 rounded-md px-3 py-2 w-full`}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">SENHA:</label>
                        <button 
                            onClick={() => setEditPassword(true)}
                            type="button" 
                            className={`${editPassword && "hidden"} bg-mygray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300`}>
                            Alterar senha
                        </button>

                        <div className={`${!editPassword && 'hidden'} bg-mygray-200 p-4 rounded-[8px] border border-mygray-500 w-full`}>
                            {/* Campo senha */}
                            <div className="mb-4 w-[100%]">
                                <p>Senha antiga:</p> 
                                <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                                type="password" 
                                placeholder="Senha"
                                onChange={(e) => setPassword((prev) => ({...prev, oldPassword:e.target.value}))}
                                />
                                <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                            </div>

                            <div className="mb-4 w-[100%]">
                                <p>Nova Senha:</p> 
                                <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                                type="password" 
                                placeholder="Senha"
                                onChange={(e) => setPassword((prev) => ({...prev, password:e.target.value}))}
                                />
                                <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                            </div>
                            {/* Campo confirmar senha */}
                            <div className="w-[100%]">
                                <p>Confirmar senha:</p> 
                                <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} border border-gray-500 rounded-md px-3 py-2 w-full`}
                                type="password" 
                                placeholder="Confirmar senha"
                                onChange={(e) => setPassword((prev) => ({...prev, confirmPassword:e.target.value}))}
                                />
                                <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                            </div>
                        </div>
                    </div>
                
                
                    <div className={`${!editName && !editPassword && 'hidden'} flex justify-end space-x-4 mt-8`}>
                        <button type="button"
                            onClick={() => {
                                setEditName(false);
                                setEditPassword(false);
                            }} 
                            className="border border-gray-500 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>

                        <button onClick={updateAccount} 
                            disabled={disableButton}
                            type="button" 
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                            EDITAR
                        </button>
                    </div>
                </div>
            </div>       
        </div>
        </>
    )
}
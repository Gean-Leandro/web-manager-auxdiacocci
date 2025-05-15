import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { AccountService, IAccount } from "../../services/accountService";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export function Profile() {
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<IAccount>({uid:'', name:'', email: '', level:'', active: true});
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<{oldPassword: string, password:string, confirmPassword:string}>({oldPassword: '', password:'', confirmPassword:''});
    const [editName, setEditName] = useState<boolean>(false);
    const [editPassword, setEditPassword] = useState<boolean>(false);
    const [erro, setErro] = useState<{campo: string, mensage: string}>({campo: '', mensage:''});

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
    }, []);

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
        if (validateFields()) {
            try {
                if(editName) {
                    setLogin((prev) => ({...prev, name: name}));
                    await AccountService.updateAccount(login);
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
            <Sidebar levelAccount={login.level} selected={6}/>
            <div className="px-[15svh] overflow-y-auto">
                <div className="rounded-[8px] bg-mygray-300 flex items-center px-8 mt-5 h-[10svh] text-[25px]">
                    PERFIL
                </div>

                <div className="flex items-center justify-start mt-[10%]">
                    <div className="gap-10">
                        {/* Campo Nome */}
                        <div className="w-[100%] mb-8">
                            <p className="mb-2 flex gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.625 8.125C7.625 9.21902 8.0596 10.2682 8.83318 11.0418C9.60677 11.8154 10.656 12.25 11.75 12.25C12.844 12.25 13.8932 11.8154 14.6668 11.0418C15.4404 10.2682 15.875 9.21902 15.875 8.125C15.875 7.03098 15.4404 5.98177 14.6668 5.20818C13.8932 4.4346 12.844 4 11.75 4C10.656 4 9.60677 4.4346 8.83318 5.20818C8.0596 5.98177 7.625 7.03098 7.625 8.125Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5 20.5C5 18.7098 5.71116 16.9929 6.97703 15.727C8.2429 14.4612 9.95979 13.75 11.75 13.75C13.5402 13.75 15.2571 14.4612 16.523 15.727C17.7888 16.9929 18.5 18.7098 18.5 20.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Nome:
                            </p>
                            
                            <div className="flex gap-4">
                                <p className={`${editName && 'hidden'} flex items-center h-[45px] w-[403px] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2`}>
                                    {login.name}
                                </p>
                                <input type="text" 
                                    className={`${!editName && 'hidden'} h-[45px] w-[403px] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2`}
                                    placeholder="Novo nome"
                                    onChange={(e) => setName(e.target.value)}/>
                                
                                <button type="button" onClick={() => setEditName(true)}
                                    className={`${editName && 'hidden'} hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px] p-2 border-[2px] border-white`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Pencil-1--Streamline-Ultimate" height="24" width="24"><desc>Pencil 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.19 1.81002c-0.3406 -0.33916 -0.7449 -0.60748 -1.1898 -0.78945 -0.4449 -0.181969 -0.9214 -0.273985 -1.402 -0.270731 -0.4806 0.003255 -0.9558 0.101715 -1.3982 0.289691 -0.4423 0.18798 -0.8431 0.46175 -1.179 0.80549L2.521 16.345 0.75 23.25l6.905 -1.771 14.5 -14.49998c0.3437 -0.33593 0.6175 -0.73665 0.8055 -1.17901 0.188 -0.44235 0.2864 -0.91756 0.2897 -1.39819 0.0032 -0.48063 -0.0888 -0.95713 -0.2707 -1.40199 -0.182 -0.44486 -0.4503 -0.84925 -0.7895 -1.18981Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m16.606 2.26001 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.512 4.354 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m2.521 16.345 5.139 5.129" stroke-width="1.5"></path></svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Campo Email */}
                        <div className="w-[100%] mb-8">
                            <p className="mb-2 flex gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_494_1435)">
                                    <path d="M0.75 12C0.75 14.9837 1.93526 17.8452 4.04505 19.955C6.15483 22.0647 9.01631 23.25 12 23.25C14.9837 23.25 17.8452 22.0647 19.955 19.955C22.0647 17.8452 23.25 14.9837 23.25 12C23.25 9.01631 22.0647 6.15483 19.955 4.04505C17.8452 1.93526 14.9837 0.75 12 0.75C9.01631 0.75 6.15483 1.93526 4.04505 4.04505C1.93526 6.15483 0.75 9.01631 0.75 12Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15.0001 18.0478C13.6852 18.7004 12.1934 18.9065 10.7508 18.6351C9.30819 18.3637 7.99336 17.6295 7.00551 16.5437C6.01765 15.4579 5.41061 14.0798 5.27635 12.618C5.14209 11.1563 5.48793 9.69054 6.26146 8.44298C7.035 7.19542 8.19408 6.23398 9.56311 5.70431C10.9322 5.17465 12.4365 5.10563 13.8483 5.50771C15.2601 5.9098 16.5023 6.76107 17.3868 7.93256C18.2714 9.10405 18.7499 10.5319 18.7501 11.9998" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15 12V13.125C15 13.6223 15.1975 14.0992 15.5492 14.4508C15.9008 14.8025 16.3777 15 16.875 15C17.3723 15 17.8492 14.8025 18.2008 14.4508C18.5525 14.0992 18.75 13.6223 18.75 13.125V12" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_494_1435">
                                    <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                E-mail:
                            </p>
                            <p className="flex items-center h-[45px] w-[403px] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2">
                                {login.email}
                            </p>
                        </div>
                        {/* Campo Nível */}
                        <div className="w-[100%] mb-8">
                            <p className="mb-2 flex gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_626_1592)">
                                    <path d="M15.75 9.75H8.25C7.42157 9.75 6.75 10.4216 6.75 11.25V15.75C6.75 16.5784 7.42157 17.25 8.25 17.25H15.75C16.5784 17.25 17.25 16.5784 17.25 15.75V11.25C17.25 10.4216 16.5784 9.75 15.75 9.75Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 13.875C11.7929 13.875 11.625 13.7071 11.625 13.5C11.625 13.2929 11.7929 13.125 12 13.125" stroke="black" stroke-width="1.5"/>
                                    <path d="M12 13.875C12.2071 13.875 12.375 13.7071 12.375 13.5C12.375 13.2929 12.2071 13.125 12 13.125" stroke="black" stroke-width="1.5"/>
                                    <path d="M8.25 9.75V7.5C8.25 6.50544 8.64509 5.55161 9.34835 4.84835C10.0516 4.14509 11.0054 3.75 12 3.75C12.9946 3.75 13.9484 4.14509 14.6517 4.84835C15.3549 5.55161 15.75 6.50544 15.75 7.5V9.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 23.25C5.324 21.469 0.75 17.51 0.75 10.5V0.75H23.25V10.5C23.25 17.505 18.683 21.467 12 23.25Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_626_1592">
                                    <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>

                                Nível:
                            </p>
                            <p className="flex items-center h-[45px] w-[403px] bg-mygray-200 border-[2px] border-mygray-500 rounded-[8px] px-2">
                                {login.level == "admin" ? "Administrador" : "Usuário"}
                            </p>
                        </div>
                        {/* Campo Senha */}
                        <div className="w-[100%]">
                            <p className="mb-2 flex gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_494_1456)">
                                    <path d="M9.49012 12.82L12.0001 15.36L11.5301 17.12C11.4667 17.3908 11.4769 17.6735 11.5595 17.939C11.6422 18.2045 11.7943 18.4431 12.0001 18.63C12.1965 18.8133 12.4364 18.9434 12.6971 19.0082C12.9578 19.0729 13.2307 19.0701 13.4901 19L15.2401 18.53L16.0001 19.35L15.5301 21.11C15.4668 21.3808 15.4769 21.6635 15.5596 21.929C15.6422 22.1945 15.7943 22.4331 16.0001 22.62C16.1945 22.8034 16.4323 22.9344 16.6911 23.0008C16.9499 23.0673 17.2214 23.067 17.4801 23L19.2301 22.53C19.6717 22.9716 20.2706 23.2197 20.8951 23.2197C21.5196 23.2197 22.1185 22.9716 22.5601 22.53C23.0017 22.0884 23.2498 21.4895 23.2498 20.865C23.2498 20.2405 23.0017 19.6416 22.5601 19.2L12.8201 9.49003C13.3909 8.14617 13.4765 6.64557 13.0621 5.24552C12.6477 3.84548 11.7592 2.63321 10.5488 1.81657C9.33852 0.999935 7.88172 0.629806 6.42832 0.769649C4.97502 0.909492 3.61552 1.55059 2.58312 2.58303C1.55062 3.61547 0.909522 4.97492 0.769722 6.4283C0.629822 7.88167 1.00002 9.33842 1.81662 10.5488C2.63322 11.7591 3.84552 12.6477 5.24562 13.0621C6.64562 13.4765 8.14622 13.3909 9.49012 12.82Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M6.15981 4.26001C5.91031 4.26001 5.66331 4.30915 5.43271 4.40464C5.20221 4.50012 4.99281 4.64008 4.81631 4.81651C4.63991 4.99294 4.49991 5.20239 4.40451 5.43291C4.30901 5.66343 4.25981 5.9105 4.25981 6.16001C4.25981 6.40952 4.30901 6.65659 4.40451 6.88711C4.49991 7.11763 4.63991 7.32708 4.81631 7.50351C4.99281 7.67994 5.20221 7.8199 5.43271 7.91538C5.66331 8.01086 5.91031 8.06001 6.15981 8.06001C6.66371 8.06001 7.14701 7.85983 7.50331 7.50351C7.85971 7.14719 8.05981 6.66392 8.05981 6.16001C8.05981 5.6561 7.85971 5.17283 7.50331 4.81651C7.14701 4.46019 6.66371 4.26001 6.15981 4.26001Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_494_1456">
                                    <rect width="24" height="24" fill="white" transform="matrix(0 1 -1 0 24 0)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                Senha:
                            </p>

                            <div className={`${!editPassword && 'hidden'} bg-mygray-200 p-4 rounded-[8px] border-[2px] border-mygray-500 w-[420px]`}>
                                {/* Campo senha */}
                                <div className="mb-4 w-[100%]">
                                    <p>Senha antiga:</p> 
                                    <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[45px] w-[100%]`}
                                    type="password" 
                                    placeholder="Senha"
                                    onChange={(e) => setPassword((prev) => ({...prev, oldPassword:e.target.value}))}
                                    />
                                    <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                                </div>

                                <div className="mb-4 w-[100%]">
                                    <p>Nova Senha:</p> 
                                    <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[45px] w-[100%]`}
                                    type="password" 
                                    placeholder="Senha"
                                    onChange={(e) => setPassword((prev) => ({...prev, password:e.target.value}))}
                                    />
                                    <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                                </div>
                                {/* Campo confirmar senha */}
                                <div className="w-[100%]">
                                    <p>Confirmar senha:</p> 
                                    <input className={`${erro.campo == "password" ? 'border-red-600': 'border-mygray-500'} bg-white border-[2px] rounded-[8px] pl-2 h-[45px] w-[100%]`}
                                    type="password" 
                                    placeholder="Confirmar senha"
                                    onChange={(e) => setPassword((prev) => ({...prev, confirmPassword:e.target.value}))}
                                    />
                                    <p className={`${erro.campo === "password"? '' : 'hidden'} text-red-600`}>{erro.mensage}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setEditPassword(true)} 
                                className={`${editPassword && 'hidden'} hover:bg-mygray-400 bg-mygray-900 text-white font-bold h-[50px] w-[250px] rounded-[8px]`} 
                                type="button">ALTERAR SENHA</button>
                        </div>
                    </div>
                </div>

                <div className={`${!editName && !editPassword && 'hidden'} mb-5 mt-12 col-span-6 flex justify-end gap-4 *:font-bold *:py-4 *:px-10`}>
                        <button type="button"
                            onClick={() => {
                                setEditName(false);
                                setEditPassword(false);
                            }} 
                            className="border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                            CANCELAR
                        </button>
                        <button onClick={updateAccount} 
                        disabled={disableButton}
                            type="button" 
                            className="bg-black rounded-[8px] text-white hover:bg-mygray-600">
                            CADASTRAR
                        </button>
                </div>
            </div>        
        </div>
        </>
    )
}
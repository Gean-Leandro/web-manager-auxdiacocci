import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { ScientificNamesService, IScientificNames } from "../../services/scientificNamesService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";

export function ScientificNames() {
    const [scientificNames, setScientificNames] = useState<IScientificNames[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [filtradas, setFiltradas] = useState<IScientificNames[]>([]);
    const [busca, setBusca] = useState<string>('');
    const [fieldBusca, setFieldBusca] = useState<boolean>(true);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [scientificNameItem, setScientificNameItem] = useState<IScientificNames>({id: '', name: ''});
    const [idDelet, setIdDelet] = useState<string>('');
    const [editScientificName, setEditScientificName] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');

    useEffect(() => {
        document.title = "Nomes Científicos";
        const fetchReferences = async () => {
            const query = await ScientificNamesService.getScientificNames();
            if (query.status === "OK") {
                setScientificNames(query.result);
                setFiltradas(query.result);
            } else {
                setShowNotification({
                    active: true, 
                    mensage: query.status, 
                    bgColor: "bg-orange-500"
                })
            }
        }
        fetchReferences();

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
            setFiltradas(scientificNames);
        } else {    
            const resultado = scientificNames.filter((item) =>
                item.name.toLowerCase().includes(busca.toLowerCase())
            );
            setFiltradas(resultado);
        }
    };

    const updateScientificNamesList = async () => {
        const query = await ScientificNamesService.getScientificNames();

        if (query.status === "OK") {
            setScientificNames(query.result);
            setFiltradas(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const addNewScientificName = async () => {
        if (!(scientificNameItem.name === "")) {

            const nameExist = scientificNames.some(
                (item) => item.name.trim().toLowerCase() === scientificNameItem.name.trim().toLowerCase()
            )

            if (!nameExist) {
                try {
                    await ScientificNamesService.addNew(scientificNameItem);
                    setScientificNameItem({id:"", name: ""});
    
                    updateScientificNamesList();
    
                    setShowNotification({
                        active: true, 
                        mensage: "Novo nome científico adicionado", 
                        bgColor: "bg-green-600"
                    })
                } catch (error) {
                    setShowNotification({
                        active: true, 
                        mensage: "Error: " + error, 
                        bgColor: "bg-orange-500"
                    })
                }
            } else {
                setShowNotification({
                    active: true, 
                    mensage: "Nome científico já existe", 
                    bgColor: "bg-orange-500"
                })
            }
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha o campo", 
                bgColor: "bg-orange-500"
            })
        }
        
    }

    const updateScientificName = async () => {
        setDisableButton(true);

        try {
            const scientificNameIdentic = scientificNames.some(
                (item) => item.name.trim().toLowerCase() === scientificNameItem.name.trim().toLowerCase() 
            )

            if (scientificNameItem.name !== "") {
                if (!scientificNameIdentic){   
                    await ScientificNamesService.update(scientificNameItem);
                    setScientificNameItem({id:'', name:''});
                    setEditScientificName(false);
                    
                    updateScientificNamesList();
                    
                    setShowNotification({
                        active: true, 
                        mensage: "Nome Científico atualizado", 
                        bgColor: "bg-green-600"
                    })
                } else {
                    setShowNotification({
                        active: true, 
                        mensage: "Não exite alterações para serem atualizadas", 
                        bgColor: "bg-orange-500"
                    })
                }
            } else {
                setShowNotification({
                    active: true, 
                    mensage: "Preencha o campo", 
                    bgColor: "bg-orange-500"
                })
            }
        } catch (error) {
            setShowNotification({
                active: true, 
                mensage: "Error:" + error, 
                bgColor: "bg-orange-500"
            })
        }
        setDisableButton(false);
    }
    
    const deleteScientificName = async () => {
        try {
            await ScientificNamesService.delete(idDelet);
            updateScientificNamesList();
            setShowNotification({
                active: true, 
                mensage: "Nome científico excluido", 
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
                    NOMES CIENTÍFICOS
                </div>

                <div className={`flex items-center justify-start mt-[10%]`}>
                    <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500">

                        {/* Campo buscar */}
                        <div className={`${!fieldBusca && 'hidden'} mb-2 w-[100%] flex justify-center items-center`}>
                            <input className="bg-white border-[2px] border-r-[0px] border-mygray-500 rounded-l-[8px] pl-2 h-[35px] w-[230px]"
                            type="text" 
                            placeholder="Nome científico"
                            onChange={(e) => setBusca(e.target.value)}/>
                            <button type="button" onClick={handleBuscar}
                                className="bg-mygray-900 hover:bg-mygray-600 text-white font-bold h-[35px] w-[100px]  rounded-r-[8px]">
                                BUSCAR
                            </button>
                        </div>

                        {/* Campo editar */}
                        <div className={`${fieldBusca && 'hidden'} mb-2 ${editScientificName === true ? "min-w-[500px]": "min-w-[400px]"}`}>
                            <div className="w-[100%] flex justify-between mb-2">
                                <input className={`bg-white border-[2px] border-mygray-500 rounded-[8px] pl-2 h-[35px] ${editScientificName == true ? "w-[55%]": "w-[80%]"}`}
                                type="text" 
                                value={scientificNameItem.name}
                                placeholder="Nome científico"
                                onChange={(e) => setScientificNameItem((prev) => ({...prev, name:e.target.value}))}/>

                                {/* Adicionar Button */}
                                <button
                                    onClick={addNewScientificName}
                                    type="button" 
                                    className={`${editScientificName && "hidden"} bg-mygray-900 flex items-center justify-center h-[35px] w-[19%] rounded-[8px] hover:bg-mygray-600`}>
                                    <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                </button>

                                {/* Cancelar Button */}
                                <button
                                    onClick={() => {
                                        setEditScientificName(false);
                                        setScientificNameItem({id:'', name:''});
                                    }}
                                    type="button" 
                                    className={`${!editScientificName && "hidden"} bg-mygray-900 flex items-center justify-center text-white font-bold h-[35px] w-[22%] rounded-[8px] hover:bg-mygray-600`}>
                                    CANCELAR
                                </button>

                                {/* Salvar Button */}
                                <button
                                    disabled={disableButton}
                                    onClick={updateScientificName}
                                    type="button" 
                                    className={`${!editScientificName && "hidden"} bg-green-600 flex items-center justify-center text-white font-bold h-[35px] w-[22%] rounded-[8px] hover:bg-green-500`}>
                                    SALVAR
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-[8px] p-2 border-[2px] border-mygray-500">
                            <div className="h-[40svh]  overflow-y-auto w-[100%]">
                                {filtradas.length > 0 ? 
                                <ul>
                                    { filtradas.map((item) => (
                                        <li className="p-2 border-b flex capitalize items-center justify-between">
                                        {item.name}
                                        <div className="flex items-center gap-2 *:p-1">
                                            <button type="button"
                                                onClick={() => {
                                                    setScientificNameItem(item);
                                                    setFieldBusca(false);
                                                    setEditScientificName(true);
                                                }} 
                                                className={`${login !== "admin"? "hidden" : ""} ${editScientificName && scientificNameItem.id === item.id ? "hidden": ""} hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Pencil-1--Streamline-Ultimate" height="24" width="24"><desc>Pencil 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.19 1.81002c-0.3406 -0.33916 -0.7449 -0.60748 -1.1898 -0.78945 -0.4449 -0.181969 -0.9214 -0.273985 -1.402 -0.270731 -0.4806 0.003255 -0.9558 0.101715 -1.3982 0.289691 -0.4423 0.18798 -0.8431 0.46175 -1.179 0.80549L2.521 16.345 0.75 23.25l6.905 -1.771 14.5 -14.49998c0.3437 -0.33593 0.6175 -0.73665 0.8055 -1.17901 0.188 -0.44235 0.2864 -0.91756 0.2897 -1.39819 0.0032 -0.48063 -0.0888 -0.95713 -0.2707 -1.40199 -0.182 -0.44486 -0.4503 -0.84925 -0.7895 -1.18981Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m16.606 2.26001 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.512 4.354 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m2.521 16.345 5.139 5.129" stroke-width="1.5"></path></svg>
                                            </button>
                                           
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setConfirmModal(true);
                                                    setIdDelet(item.id);
                                                }} 
                                                className={`${login !== "admin"? "hidden" : ""} hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]`}>
                                                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_100_271)">
                                                    <path d="M0.833252 4.1665H19.1666" stroke="#BE0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M11.875 0.833496H8.125C7.79348 0.833496 7.47553 0.965196 7.24112 1.19961C7.0067 1.43403 6.875 1.75198 6.875 2.0835V4.16683H13.125V2.0835C13.125 1.75198 12.9933 1.43403 12.7589 1.19961C12.5245 0.965196 12.2065 0.833496 11.875 0.833496Z" stroke="#BE0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M8.125 14.7915V8.5415" stroke="#BE0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M11.875 14.7915V8.5415" stroke="#BE0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M15.7167 18.0165C15.6935 18.3297 15.5525 18.6224 15.3221 18.8358C15.0917 19.0492 14.789 19.1673 14.475 19.1665H5.525C5.21098 19.1673 4.90828 19.0492 4.67789 18.8358C4.4475 18.6224 4.30652 18.3297 4.28333 18.0165L3.125 4.1665H16.875L15.7167 18.0165Z" stroke="#BE0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </g>
                                                    <defs>
                                                    <clipPath id="clip0_100_271">
                                                    <rect width="20" height="20" fill="white"/>
                                                    </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                    )) }
                                </ul>
                            :   <div className="h-[100%] w-[100%] flex justify-center items-center text-mygray-700">
                                    Nenhum nome científico cadastrado
                                </div>
                            }
                            </div>
                        </div>
                        <div className="flex justify-end mt-2">
                            <button type="button"
                                onClick={() => setFieldBusca(false)}
                                className={`${!fieldBusca && "hidden"} border-[2px] flex gap-2 border-black rounded-[8px] py-2 px-4 font-bold hover:bg-white`}>
                                CADASTRAR 
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5 1C13.5 0.447715 13.0523 0 12.5 0C11.9477 0 11.5 0.447715 11.5 1H13.5ZM11.5 22.2789C11.5 22.8312 11.9477 23.2789 12.5 23.2789C13.0523 23.2789 13.5 22.8312 13.5 22.2789H11.5ZM1 10.6395C0.447715 10.6395 0 11.0872 0 11.6395C0 12.1917 0.447715 12.6395 1 12.6395V10.6395ZM24 12.6395C24.5523 12.6395 25 12.1917 25 11.6395C25 11.0872 24.5523 10.6395 24 10.6395V12.6395ZM11.5 1V11.6395H13.5V1H11.5ZM11.5 11.6395V22.2789H13.5V11.6395H11.5ZM12.5 10.6395H1V12.6395H12.5V10.6395ZM1 12.6395H23.2581V10.6395H1V12.6395ZM23.2581 12.6395H23.629V10.6395H23.2581V12.6395ZM23.629 12.6395H24V10.6395H23.629V12.6395Z" fill="black"/>
                                </svg>
                            </button>
                            
                            <button type="button"
                                onClick={() => setFieldBusca(true)}
                                className={`${fieldBusca && "hidden"} border-[2px] flex gap-2 border-black rounded-[8px] py-2 px-4 font-bold hover:bg-white`}>
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>        
        </div>

        {confirmModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px] w-[25%]">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold h-[24px] justify-center text-[18px] pl-8 flex items-center w-[90%]">
                            CONFIRMAÇÃO
                        </div>
                        <button type="button" onClick={() => {
                                setConfirmModal(false);
                                setIdDelet('');
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="text-center mb-10">
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
                        Deseja excluir esse nome científico?
                    </div>


                    
                    <div className="h-[20%] flex justify-between items-center gap-4 *:font-bold *:py-1 *:px-10">
                        <button onClick={() => {
                                setConfirmModal(false);
                                setIdDelet('');
                            }} 
                            className="w-[300px] border-[2px] border-black rounded-[8px] hover:bg-mygray-600 hover:text-white">
                            CANCELAR
                        </button>
                        <button type="button"
                            disabled={disableButton}
                            onClick={deleteScientificName} 
                            className="w-[300px] border-[2px] border-black bg-black rounded-[8px] text-white hover:bg-mygray-600">
                            EXCLUIR
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
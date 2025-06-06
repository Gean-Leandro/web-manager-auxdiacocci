import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { ScientificNamesService, IScientificNames } from "../../services/scientificNamesService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { Check, Edit2, Eye, Microscope, Plus, Trash2, X } from "lucide-react";
import { ScreamLoading } from "../../components/ScreamLoading";

export function ScientificNames() {
    const [scientificNames, setScientificNames] = useState<IScientificNames[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [busca, setBusca] = useState<string>('');
    const [fieldBusca, setFieldBusca] = useState<boolean>(true);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [scientificNameItem, setScientificNameItem] = useState<IScientificNames>({id: '', name: ''});
    const [idDelet, setIdDelet] = useState<IScientificNames | null>();
    const [editScientificName, setEditScientificName] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Nomes Científicos";
        const fetchReferences = async () => {
            const query = await ScientificNamesService.getScientificNames();
            if (query.status === "OK") {
                setScientificNames(query.result);
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
        filtradas
    };

    const filtradas = useMemo(() => {
        return scientificNames
          .filter(item => item.name.toLowerCase().includes(busca.toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name));
    }, [scientificNames, busca]);

    const updateScientificNamesList = async () => {
        const query = await ScientificNamesService.getScientificNames();

        if (query.status === "OK") {
            setScientificNames(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const addNewScientificName = async () => {
        setLoad(true);
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
        setLoad(false);
    }

    const updateScientificName = async () => {
        setDisableButton(true);
        setLoad(true);
        try {
            const scientificNameIdentic = scientificNames.some(
                (item) => item.name.trim() === scientificNameItem.name.trim() 
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
        setLoad(false);
    }
    
    const deleteScientificName = async () => {
        setLoad(true);
        try {
            if (idDelet) {
                await ScientificNamesService.delete(idDelet.id, idDelet.name);
            }
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
            <Sidebar levelAccount={login} selected={4}/>
            <div className="flex-grow overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <Microscope className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Nomes Científicos</h1>
                        </div>
                        <p className="text-gray-500">Gerencie os nomes científicos cadastrados.</p>
                    </div>
                </div>


                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden">

                        {/* Campo editar */}
                        <div className={`${fieldBusca && 'hidden'} p-4 border-b`}>
                            <div className="pb-4 border-b bg-white">
                                <h2 className="text-lg font-semibold">{!editScientificName ? "Preencha o formulário": "Editando"}</h2>
                            </div>

                            <div className="w-[100%] flex justify-between pt-4">
                                <input className={`pl-4 pr-24 py-2 border border-gray-500 rounded ${editScientificName == true ? "w-[78%]": "w-[89%]"}`}
                                type="text" 
                                value={scientificNameItem.name}
                                placeholder="Palavra"
                                onChange={(e) => setScientificNameItem((prev) => ({...prev, name:e.target.value}))}/>

                                {/* Adicionar Button */}
                                <button
                                    onClick={addNewScientificName}
                                    type="button" 
                                    className={`${editScientificName && "hidden"} w-[10%] flex items-center justify-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}>
                                    <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                </button>

                                {/* Cancelar Button */}
                                <button
                                    onClick={() => {
                                        setEditScientificName(false);
                                        setScientificNameItem({id:'', name:''});
                                    }}
                                    type="button" 
                                    className={`${!editScientificName && "hidden"} w-[10%] text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]`}>
                                    <X size={20}/>
                                </button>

                                {/* Salvar Button */}
                                <button
                                    disabled={disableButton}
                                    onClick={updateScientificName}
                                    type="button" 
                                    className={`${!editScientificName && "hidden"} w-[10%] text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]`}>
                                    <Check size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-b bg-white">
                            <h2 className="text-lg font-semibold">Lista de nomes científicos</h2>
                        </div>
                        
                        {/* Search and Add */}
                        <div className="p-4 bg-gray-100">
                            <div className="flex items-center">
                                <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Palavra"
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
                        {filtradas.length !== 0 ? filtradas.map((item) => (
                            <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                            >
                            <div className="font-medium">{item.name}</div>
                            
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => {
                                        setScientificNameItem(item);
                                        setFieldBusca(false);
                                        setEditScientificName(true);
                                    }} className={`${login !== "admin"? "hidden" : ""} ${editScientificName && scientificNameItem.id === item.id ? "hidden": ""}  p-1 text-gray-600 hover:text-blue-600`}>
                                    <Edit2 size={18} />
                                </button>
                                
                                <button type="button"
                                        onClick={() => {
                                            setConfirmModal(true);
                                            setIdDelet(item);
                                        }} 
                                        className={`${login !== "admin"? "hidden" : ""} p-1 text-red-500 hover:text-red-700`}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            </div>
                        ))
                        :   <div className="h-[100%] w-[100%] py-10 flex justify-center items-center text-mygray-700">
                                Nenhum nome científico cadastrado
                            </div>
                        }
                        </div>
                        
                        {/* Cadastrar Button */}
                        <div className="p-4 border-t flex justify-end gap-2 items-center">
                            <button type="button"
                                onClick={() => setFieldBusca(true)}
                                className={`${fieldBusca && "hidden"} flex items-center px-4 py-2 border-slate-500 border-[2px] rounded bg-white hover:bg-gray-100`}>
                                CANCELAR
                            </button>
                            <button type="button"
                                onClick={() => setFieldBusca(false)} className={`${!fieldBusca && "hidden"} flex items-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}>
                                <Plus size={18} className="mr-1" />
                                <span>CADASTRAR</span>
                            </button>
                        </div>
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
                                setIdDelet(null);
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="pl-5 text-center mb-10 w-[300px]">
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
                                setIdDelet(null);
                            }} 
                            className="flex justify-center items-center border border-gray-500 bg-white text-gray-800 w-[150px] px-1 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button"
                            disabled={disableButton}
                            onClick={deleteScientificName} 
                            className="flex justify-center items-center w-[150px] bg-gray-900 text-white px-10 py-2 rounded-md hover:bg-gray-800">
                            EXCLUIR
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
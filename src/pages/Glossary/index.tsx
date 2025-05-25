import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { GlossaryService, Iglossary} from "../../services/glossaryService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { BookOpen, Check, Edit2, Eye, Plus, Trash2, X } from "lucide-react";
import { ScreamLoading } from "../../components/ScreamLoading";

export function Glossary() {
    const [glossary, setGlossary] = useState<Iglossary[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [busca, setBusca] = useState<string>('');
    const [fieldBusca, setFieldBusca] = useState<boolean>(true);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [viewGlossaryItem, setViewGlossaryItem] = useState<Iglossary>({id: '', word: '', meaning: ''});
    const [glossaryItem, setGlossaryItem] = useState<Iglossary>({id: '', word: '', meaning: ''});
    const [idDelet, setIdDelet] = useState<Iglossary|null>();
    const [editGlossary, setEditGlossary] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = "Glossario";
        const fetchGlossary = async () => {
            const query = await GlossaryService.getGlossary();
            if (query.status === "OK") {
                setGlossary(query.result);
            } else {
                setShowNotification({
                    active: true, 
                    mensage: query.status, 
                    bgColor: "bg-orange-500"
                })
            }
        }
        fetchGlossary();
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

    const scrollToTop = () => {
        if (divRef.current) {
        divRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        }
    };

    const filtradas = useMemo(() => {
        return glossary
          .filter(item => item.word.toLowerCase().includes(busca.toLowerCase()))
          .sort((a, b) => a.word.localeCompare(b.word));
    }, [glossary, busca]);
    
    const updateGlossaryList = async () => {
        const query = await GlossaryService.getGlossary();

        if (query.status === "OK") {
            setGlossary(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const addNewGossary = async () => {
        setLoad(true);
        if (!(glossaryItem.word === "") || !(glossaryItem.meaning === "")) {

            const wordExist = glossary.some(
                (item) => item.word.trim().toLowerCase() === glossaryItem.word.trim().toLowerCase()
            )

            if (!wordExist) {
                try {
                    await GlossaryService.addNew(glossaryItem);
                    setGlossaryItem({id:"", word:"", meaning: ""});
    
                    updateGlossaryList();
    
                    setShowNotification({
                        active: true, 
                        mensage: "Nova palavra adicionada", 
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
                    mensage: "Palavra já existe", 
                    bgColor: "bg-orange-500"
                })
            }
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            })
        }
        setLoad(false);
    }

    const updateGlossary = async () => {
        setDisableButton(true);
        setLoad(true);
        if (!(glossaryItem.word === "") || !(glossaryItem.meaning === "")){

            try {
                const wordIdentic = glossary.some(
                    (item) => item.word.trim() === glossaryItem.word.trim() && item.meaning.trim() === glossaryItem.meaning.trim() 
                )
    
                if (!wordIdentic) {
    
                    await GlossaryService.update(glossaryItem);
                    setGlossaryItem({id:'', word:'', meaning:''});
                    setEditGlossary(false);
                    
                    updateGlossaryList();
                    
                    setShowNotification({
                        active: true, 
                        mensage: "Palavra atualizada", 
                        bgColor: "bg-green-600"
                    })
                } else {
                    setShowNotification({
                        active: true, 
                        mensage: "Não exite alterações para serem atualizadas", 
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
        } else {
            setShowNotification({
                active: true, 
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            })
        }
        setDisableButton(false);
        setLoad(false);
    }
    
    const deleteWord = async () => {
        setLoad(true);
        try {
            if(idDelet){
                await GlossaryService.delete(idDelet.id, idDelet.word);
            }
            updateGlossaryList();
            setShowNotification({
                active: true, 
                mensage: "Palavra excluida", 
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
        {load && <ScreamLoading />}
        <div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={3}/>
            <div ref={divRef} className="flex-grow overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <BookOpen className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Glossário</h1>
                        </div>
                        <p className="text-gray-500">Gerencie as informações sobre Eimeria.</p>
                    </div>
                </div>


                {openView && (
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden p-4">
                        <div className="flex border-b pb-2 justify-between h-[10%] mb-3">
                            <div className="font-bold h-[24px] justify-center text-[18px] pl-12 flex items-center w-[90%]">
                                <h2 className="text-lg font-semibold">VISUALIZAÇÃO</h2>
                            </div>
                            <button type="button" onClick={() => {
                                    setOpenView(false);
                                }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Palavra:</label>
                            <input className={`pl-4 pr-24 py-2 border border-gray-500 rounded w-full mb-4`}
                                type="text" 
                                disabled={true}
                                value={viewGlossaryItem.word}
                                placeholder="Palavra"/>

                            <label className="block text-sm font-medium mb-2">Significado:</label>
                            <textarea className={`pl-4 pr-24 py-2 border border-gray-500 rounded w-full`} 
                                disabled={true}
                                value={viewGlossaryItem.meaning}
                                placeholder="Palavra"/>
                        </div>
                    </div>
                </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden">

                        {/* Campo editar */}
                        <div className={`${fieldBusca && 'hidden'} p-4 border-b`}>
                            <div className="pb-4 border-b bg-white">
                                <h2 className="text-lg font-semibold">{!editGlossary ? "Preencha o formulário": "Editando"}</h2>
                            </div>

                            <div className="w-[100%] flex justify-between pt-4">
                                <input className={`pl-4 pr-24 py-2 border border-gray-500 rounded ${editGlossary == true ? "w-[78%]": "w-[89%]"}`}
                                type="text" 
                                value={glossaryItem.word}
                                placeholder="Palavra"
                                onChange={(e) => setGlossaryItem((prev) => ({...prev, word:e.target.value}))}/>

                                {/* Adicionar Button */}
                                <button
                                    onClick={addNewGossary}
                                    type="button" 
                                    className={`${editGlossary && "hidden"} w-[10%] flex items-center justify-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}>
                                    <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                </button>

                                {/* Cancelar Button */}
                                <button
                                    onClick={() => {
                                        setEditGlossary(false);
                                        setGlossaryItem({id:'', word:'', meaning:''});
                                    }}
                                    type="button" 
                                    className={`${!editGlossary && "hidden"} w-[10%] text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]`}>
                                    <X size={20}/>
                                </button>

                                {/* Salvar Button */}
                                <button
                                    disabled={disableButton}
                                    onClick={updateGlossary}
                                    type="button" 
                                    className={`${!editGlossary && "hidden"} w-[10%] text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]`}>
                                    <Check size={20}/>
                                </button>
                            </div>
                            <div className="w-[100%] mt-2">
                                <textarea className="pl-4 pr-24 py-2 border border-gray-500 rounded w-[100%]"
                                rows={5} 
                                value={glossaryItem.meaning}
                                placeholder="Significado"
                                onChange={(e) => setGlossaryItem((prev) => ({...prev, meaning:e.target.value}))}/>
                            </div>
                        </div>

                        <div className="p-4 border-b bg-white">
                            <h2 className="text-lg font-semibold">Lista do Glossário</h2>
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
                        {filtradas.length !== 0 ? filtradas.map((word) => (
                            <div 
                            key={word.id} 
                            className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                            >
                            <div className="font-medium">{word.word}</div>
                            
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => {
                                        setGlossaryItem(word);
                                        setFieldBusca(false);
                                        setEditGlossary(true);
                                    }} className={`${login !== "admin"? "hidden" : ""} ${editGlossary && glossaryItem.id === word.id ? "hidden": ""}  p-1 text-gray-600 hover:text-blue-600`}>
                                    <Edit2 size={18} />
                                </button>

                                <button type="button" 
                                    onClick={() => {
                                        setViewGlossaryItem(word);
                                        setOpenView(true);
                                        scrollToTop();
                                    }}
                                    className="p-1 text-gray-600 hover:text-blue-600">
                                    <Eye size={18} />
                                </button>
                                
                                <button type="button"
                                        onClick={() => {
                                            setConfirmModal(true);
                                            setIdDelet(word);
                                        }} 
                                        className={`${login !== "admin"? "hidden" : ""} p-1 text-red-500 hover:text-red-700`}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            </div>
                        ))
                        :   <div className="h-[100%] w-[100%] py-10 flex justify-center items-center text-mygray-700">
                                Nenhuma palavra cadastrada
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
                <div className="bg-white p-6 rounded-md w-[25%]">
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
                        Deseja excluir essa palavra?
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
                            onClick={deleteWord} 
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
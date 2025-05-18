import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { Notification } from "../../components/Notification";
import { ReferencesService, IReference } from "../../services/referencesService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { Check, Edit2, Eye, FileText, Plus, Trash2, X } from "lucide-react";

export function References() {
    const [references, setReferences] = useState<IReference[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [filtradas, setFiltradas] = useState<IReference[]>([]);
    const [busca, setBusca] = useState<string>('');
    const [fieldBusca, setFieldBusca] = useState<boolean>(true);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [viewReferenceItem, setViewReferenceItem] = useState<IReference>({
        id:'',
        title: '',
        tipoReferencia: '',
        ano: ''
    });
    const [referenceItem, setReferenceItem] = useState<IReference>({
        id:'',
        title: '',
        tipoReferencia: '',
        ano: ''
    });
    const [idDelet, setIdDelet] = useState<string>('');
    const [editReference, setEditReference] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [login, setLogin] = useState<string>("");

    
    const resetForm = () => {
        setReferenceItem({id: '', title: '', ano: '', tipoReferencia: ''})
    };
    

    useEffect(() => {
        document.title = "Referências";
        const fetchReferences = async () => {
            const query = await ReferencesService.getReferences();
            if (query.status === "OK") {
                setReferences(query.result);
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
            setFiltradas(references);
        } else {    
            const resultado = references.filter((item) =>
                item.title.toLowerCase().includes(busca.toLowerCase())
            );
            setFiltradas(resultado);
        }
    };

    const validateFields = () => {
        switch (referenceItem.tipoReferencia) {
            case "artigo":
                if (referenceItem.title !== '' && referenceItem.autor 
                    && referenceItem.ano !== '' && referenceItem.local 
                    && referenceItem.mes && referenceItem.volume 
                    && referenceItem.numero) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.volume !== '' 
                        && referenceItem.numero !== '') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            case "livro":
                if (referenceItem.title !== '' && referenceItem.autor
                    && referenceItem.ano !== '' && referenceItem.mes 
                    && referenceItem.edicao && referenceItem.editora 
                    && referenceItem.local && referenceItem.paginas) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.edicao !== '' 
                        && referenceItem.editora !== ''  && referenceItem.paginas !== '') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            case "pdf":
                if (referenceItem.title !== '' && referenceItem.autor  
                    && referenceItem.local  && referenceItem.mes  
                    && referenceItem.volume  && referenceItem.numero  
                    && referenceItem.ano !== '' 
                    && referenceItem.url) {

                    if (referenceItem.autor !== '' && referenceItem.local !== '' 
                        && referenceItem.mes !== '' && referenceItem.volume !== '' 
                        && referenceItem.numero !== '' && referenceItem.url) {
                        return true;
                    } else {
                        return false;
                    }
                    
                } else {
                    return false;
                }
            case "site":
                if (referenceItem.title !== '' && referenceItem.autor 
                    && referenceItem.mes && referenceItem.url 
                    && referenceItem.ano !== '' && referenceItem.tituloSite) {

                    if (referenceItem.autor !== '' && referenceItem.mes !== '' 
                        && referenceItem.tituloSite !== '' && referenceItem.url) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
        }
    }

    const updateReferenceList = async () => {
        const query = await ReferencesService.getReferences();

        if (query.status === "OK") {
            setReferences(query.result);
            setFiltradas(query.result);
        } else {
            setShowNotification({
                active: true, 
                mensage: query.status, 
                bgColor: "bg-orange-500"
            })
        }
    }

    const addNewReference = async () => {
        if (validateFields()) {

            const titleExist = references.some(
                (item) => item.title.trim().toLowerCase() === referenceItem.title.trim().toLowerCase()
            )

            if (!titleExist) {
                try {
                    await ReferencesService.addNew(referenceItem);
                    resetForm();
    
                    updateReferenceList();
    
                    setShowNotification({
                        active: true, 
                        mensage: "Nova referência adicionada", 
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
                    mensage: "Titulo já existe", 
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
        
    }

    const updateReference = async () => {
        setDisableButton(true);

        if (validateFields()) {
            try {

                await ReferencesService.update(referenceItem);
                setReferenceItem({id:'', title:'', ano:'', tipoReferencia: ''});
                setEditReference(false);
                
                updateReferenceList();
                setFieldBusca(true);
                
                setShowNotification({
                    active: true, 
                    mensage: "Referência atualizada", 
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
                mensage: "Preencha todos os campos", 
                bgColor: "bg-orange-500"
            })
        }
        setDisableButton(false);
    }
    
    const deleteReference = async () => {
        try {
            await ReferencesService.delete(idDelet);
            updateReferenceList();
            setShowNotification({
                active: true, 
                mensage: "Referência excluida", 
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

<div className="flex h-screen bg-gray-100">
            <Sidebar levelAccount={login} selected={3}/>
            <div className="flex-grow overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <FileText className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Referências</h1>
                        </div>
                        <p className="text-gray-500">Gerencie as referências cadastradas.</p>
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
                        <form>
                                <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">TIPO DE REFERÊNCIA:</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={viewReferenceItem.tipoReferencia}
                                    required
                                    disabled={true}
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="artigo">Artigo Científico</option>
                                    <option value="livro">Livro</option>
                                    <option value="pdf">PDF</option>
                                    <option value="site">Site/Página Web</option>
                                </select>
                                </div>
                                
                                {viewReferenceItem.tipoReferencia === "artigo" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                            value={viewReferenceItem.mes}
                                            disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.volume}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.numero}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.doi}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "livro" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">EDIÇÃO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: 2. ed." 
                                                value={viewReferenceItem.edicao}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">EDITORA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.editora}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">TOTAL DE PÁGINAS:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.paginas}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "pdf" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={viewReferenceItem.autor}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={viewReferenceItem.local}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.volume}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.numero}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.doi}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL DO DOCUMENTO:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.url}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                                
                                {viewReferenceItem.tipoReferencia === "site" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DA PÁGINA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.title}
                                                disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR/RESPONSÁVEL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                            value={viewReferenceItem.autor}
                                            disabled={true}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO SITE:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.tituloSite}
                                                disabled={true}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO DE PUBLICAÇÃO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.ano}
                                                disabled={true}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS (SE HOUVER):</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={viewReferenceItem.mes}
                                                disabled={true}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={viewReferenceItem.url}
                                                disabled={true}/>
                                    </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white rounded-lg border shadow-lg overflow-hidden">

                        {/* Campo editar */}
                        <div className={`${fieldBusca && 'hidden'} p-4 border-b`}>
                            <div className="pb-4 mb-4 border-b bg-white">
                                <h2 className="text-lg font-semibold">{!editReference ? "Preencha o formulário": "Editando"}</h2>
                            </div>

                            <form>
                                <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">TIPO DE REFERÊNCIA:</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={referenceItem.tipoReferencia}
                                    onChange={(e) => setReferenceItem((prev) => ({ ...prev, tipoReferencia:e.target.value}))}
                                    required
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="artigo">Artigo Científico</option>
                                    <option value="livro">Livro</option>
                                    <option value="pdf">PDF</option>
                                    <option value="site">Site/Página Web</option>
                                </select>
                                </div>
                                
                                {referenceItem.tipoReferencia === "artigo" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                            value={referenceItem.mes}
                                            onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.volume}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, volume:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.numero}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, numero:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.doi}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, doi:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "livro" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">EDIÇÃO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: 2. ed." 
                                                value={referenceItem.edicao}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, edicao:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">EDITORA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.editora}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, editora:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">TOTAL DE PÁGINAS:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.paginas}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, paginas:e.target.value}))}/>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "pdf" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO ARTIGO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR(ES):</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Ex: SOBRENOME, Nome; SOBRENOME, Nome" 
                                                value={referenceItem.autor}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">LOCAL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" placeholder="Cidade" 
                                                value={referenceItem.local}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, local:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS:</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">VOLUME:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.volume}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, volume:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">NÚMERO:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.numero}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, numero:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">DOI:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.doi}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, doi:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL DO DOCUMENTO:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.url}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, url:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                
                                {referenceItem.tipoReferencia === "site" && (
                                    <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DA PÁGINA:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.title}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, title:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">AUTOR/RESPONSÁVEL:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                            value={referenceItem.autor}
                                            onChange={(e) => setReferenceItem((prev) => ({ ...prev, autor:e.target.value}))}/>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">TÍTULO DO SITE:</label>
                                        <input type="text" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.tituloSite}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, tituloSite:e.target.value}))}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-gray-700 mb-2">ANO DE PUBLICAÇÃO:</label>
                                        <input type="number" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.ano}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, ano:e.target.value}))}/>
                                        </div>
                                        <div>
                                        <label className="block text-gray-700 mb-2">MÊS (SE HOUVER):</label>
                                        <select className="w-full border border-gray-500 rounded p-2"
                                                value={referenceItem.mes}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, mes:e.target.value}))}>
                                            <option value="">Selecione o mês</option>
                                            <option value="jan">jan</option>
                                            <option value="fev">fev</option>
                                            <option value="mar">mar</option>
                                            <option value="abr">abr</option>
                                            <option value="mai">mai</option>
                                            <option value="jun">jun</option>
                                            <option value="jul">jul</option>
                                            <option value="ago">ago</option>
                                            <option value="set">set</option>
                                            <option value="out">out</option>
                                            <option value="nov">nov</option>
                                            <option value="dez">dez</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">URL:</label>
                                        <input type="url" className="w-full border border-gray-500 rounded p-2" 
                                                value={referenceItem.url}
                                                onChange={(e) => setReferenceItem((prev) => ({ ...prev, url:e.target.value}))}/>
                                    </div>
                                    </div>
                                )}
                                    
                                    <div className={`${!editReference && 'hidden'} flex justify-end gap-2 mt-8`}>
                                    
                                        {/* Cancelar Button */}
                                        <button
                                            onClick={() => {
                                                setEditReference(false);
                                                resetForm();
                                                setFieldBusca(true);
                                            }}
                                            type="button" 
                                            className={`w-[10%] py-2 text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]`}>
                                            <X size={25}/>
                                        </button>

                                        {/* Salvar Button */}
                                        <button
                                            disabled={disableButton}
                                            onClick={updateReference}
                                            type="button" 
                                            className={`w-[10%] py-2 text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]`}>
                                            <Check size={25}/>
                                        </button>
                                    </div>

                                    <div className={`${editReference && 'hidden'} flex justify-end mt-8`}>
                                    
                                        <button onClick={addNewReference}
                                            type="button" 
                                            className={`${referenceItem.tipoReferencia === "" && 'hidden'} w-[10%] flex items-center justify-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}
                                        >
                                            <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                        </button>
                                    </div>
                            </form>
                        </div>

                        <div className="p-4 border-b bg-white">
                            <h2 className="text-lg font-semibold">Lista de referências</h2>
                        </div>
                        
                        {/* Search and Add */}
                        <div className="p-4 bg-gray-100">
                            <div className="flex items-center">
                                <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Título"
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
                        {filtradas.length !== 0 ? filtradas.map((reference) => (
                            <div 
                            key={reference.id} 
                            className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                            >
                            <div className="font-medium">{reference.title}</div>
                            
                            <div className="flex space-x-2">
                                <button type="button" onClick={() => {
                                        setReferenceItem((prev) => (reference));
                                        console.log(referenceItem);
                                        setFieldBusca(false);
                                        setEditReference(true);
                                    }} className={`${login !== "admin"? "hidden" : ""} ${editReference && referenceItem.id === reference.id ? "hidden": ""}  p-1 text-gray-600 hover:text-blue-600`}>
                                    <Edit2 size={18} />
                                </button>

                                <button type="button" 
                                    onClick={() => {
                                        setViewReferenceItem((prev) => (reference));
                                        setOpenView(true);
                                    }}
                                    className="p-1 text-gray-600 hover:text-blue-600">
                                    <Eye size={18} />
                                </button>
                                
                                <button type="button"
                                        onClick={() => {
                                            setConfirmModal(true);
                                            setIdDelet(reference.id);
                                        }} 
                                        className={`${login !== "admin"? "hidden" : ""} p-1 text-red-500 hover:text-red-700`}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            </div>
                        ))
                        :   <div className="h-[100%] w-[100%] py-10 flex justify-center items-center text-mygray-700">
                                Nenhuma referência cadastrada
                            </div>
                        }
                        </div>
                        
                        {/* Cadastrar Button */}
                        <div className="p-4 border-t flex justify-end gap-2 items-center">
                            <button type="button"
                                onClick={() => {
                                    setFieldBusca(true)
                                    setEditReference(false);
                                }}
                                className={`${fieldBusca && "hidden"} flex items-center px-4 py-2 border-slate-500 border-[2px] rounded bg-white hover:bg-gray-100`}>
                                CANCELAR
                            </button>
                            <button type="button"
                                onClick={() => {
                                        setFieldBusca(false);
                                        resetForm();    
                                    }} className={`${!fieldBusca && "hidden"} flex items-center px-4 py-2 border-[2px] border-black bg-black rounded text-white hover:bg-mygray-600`}>
                                <Plus size={18} className="mr-1" />
                                <span>CADASTRAR</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>        
        </div>






        {/* <div className="grid grid-cols-[250px_1fr] h-screen">
            <Sidebar levelAccount={login} selected={5}/>
            <div className="px-[15svh] overflow-y-auto">
                <div className="rounded-[8px] bg-mygray-300 flex items-center px-8 mt-5 h-[10svh] text-[25px]">
                    REFERÊNCIAS
                </div>

                {openView && (
                    <div className="flex items-center justify-start mt-[10%]">
                        <div className="bg-mygray-200 p-2 w-[50%] rounded-[8px] font-bold border-[2px] border-mygray-500">
                            <div className="flex justify-between h-[10%] mb-3">
                                <div className="font-bold h-[24px] justify-center text-[18px] pl-12 flex items-center w-[90%]">
                                    VISUALIZAÇÃO
                                </div>
                                <button type="button" onClick={() => {
                                        setOpenView(false);
                                    }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="*:bg-white *:border-mygray-500 *:border-[2px] *:rounded-[8px] *:p-2 *:font-normal">
                                <p className="h-[35px] items-center flex mb-2">
                                    {viewReferenceItem.title}
                                </p>
                                <p className="">
                                    {viewReferenceItem.reference}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`flex items-center justify-start ${openView? "mt-[2%]": "mt-[10%]"}`}>
                    <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500">

                        <div className={`${!fieldBusca && 'hidden'} mb-2 w-[100%] flex justify-center items-center`}>
                            <input className="bg-white border-[2px] border-r-[0px] border-mygray-500 rounded-l-[8px] pl-2 h-[35px] w-[230px]"
                            type="text" 
                            placeholder="Título"
                            onChange={(e) => setBusca(e.target.value)}/>
                            <button type="button" onClick={handleBuscar}
                                className="bg-mygray-900 hover:bg-mygray-600 text-white font-bold h-[35px] w-[100px]  rounded-r-[8px]">
                                BUSCAR
                            </button>
                        </div>

                        <div className={`${fieldBusca && 'hidden'} mb-2 ${editReference === true ? "min-w-[500px]": "min-w-[400px]"}`}>
                            <div className="w-[100%] flex justify-between mb-2">
                                <input className={`bg-white border-[2px] border-mygray-500 rounded-[8px] pl-2 h-[35px] ${editReference == true ? "w-[55%]": "w-[80%]"}`}
                                type="text" 
                                value={referenceItem.title}
                                placeholder="Título"
                                onChange={(e) => setReferenceItem((prev) => ({...prev, title:e.target.value}))}/>

                                <button
                                    onClick={addNewReference}
                                    type="button" 
                                    className={`${editReference && "hidden"} bg-mygray-900 flex items-center justify-center h-[35px] w-[19%] rounded-[8px] hover:bg-mygray-600`}>
                                    <img width={25} height={25} src="\src\assets\AddWhite.png" alt="" />
                                </button>

                                <button
                                    onClick={() => {
                                        setEditReference(false);
                                        setReferenceItem({id:'', title:'', reference:''});
                                    }}
                                    type="button" 
                                    className={`${!editReference && "hidden"} bg-mygray-900 flex items-center justify-center text-white font-bold h-[35px] w-[22%] rounded-[8px] hover:bg-mygray-600`}>
                                    CANCELAR
                                </button>

                                <button
                                    disabled={disableButton}
                                    onClick={updateReference}
                                    type="button" 
                                    className={`${!editReference && "hidden"} bg-green-600 flex items-center justify-center text-white font-bold h-[35px] w-[22%] rounded-[8px] hover:bg-green-500`}>
                                    SALVAR
                                </button>
                            </div>
                            <div className="w-[100%]">
                                <textarea className="bg-white border-[2px] border-mygray-500 break-words rounded-[8px] p-2 h-[95px] w-[100%]"
                                rows={5} 
                                value={referenceItem.reference}
                                placeholder="Referencia"
                                onChange={(e) => setReferenceItem((prev) => ({...prev, reference:e.target.value}))}/>
                            </div>
                        </div>
                        <div className="bg-white rounded-[8px] p-2 border-[2px] border-mygray-500">
                            <div className="h-[40svh]  overflow-y-auto w-[100%]">
                                {filtradas.length > 0 ? 
                                <ul>
                                    { filtradas.map((item) => (
                                        <li className="p-2 border-b flex capitalize items-center justify-between">
                                        {item.title}
                                        <div className="flex items-center gap-2 *:p-1">
                                            <button type="button"
                                                onClick={() => {
                                                    setReferenceItem(item);
                                                    setFieldBusca(false);
                                                    setEditReference(true);
                                                }} 
                                                className={`${login !== "admin"? "hidden" : ""} ${editReference && referenceItem.id === item.id ? "hidden": ""} hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Pencil-1--Streamline-Ultimate" height="24" width="24"><desc>Pencil 1 Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M22.19 1.81002c-0.3406 -0.33916 -0.7449 -0.60748 -1.1898 -0.78945 -0.4449 -0.181969 -0.9214 -0.273985 -1.402 -0.270731 -0.4806 0.003255 -0.9558 0.101715 -1.3982 0.289691 -0.4423 0.18798 -0.8431 0.46175 -1.179 0.80549L2.521 16.345 0.75 23.25l6.905 -1.771 14.5 -14.49998c0.3437 -0.33593 0.6175 -0.73665 0.8055 -1.17901 0.188 -0.44235 0.2864 -0.91756 0.2897 -1.39819 0.0032 -0.48063 -0.0888 -0.95713 -0.2707 -1.40199 -0.182 -0.44486 -0.4503 -0.84925 -0.7895 -1.18981Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m16.606 2.26001 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.512 4.354 5.134 5.134" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m2.521 16.345 5.139 5.129" stroke-width="1.5"></path></svg>
                                            </button>
                                            <button type="button"
                                                onClick={() => {
                                                    setViewReferenceItem(item);
                                                    setOpenView(true);
                                                }} 
                                                className="hover:border-[2px] hover:border-mygray-400 hover:bg-mygray-300 rounded-[8px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Search-Circle--Streamline-Ultimate" height="24" width="24"><desc>Search Circle Streamline Icon: https://streamlinehq.com</desc><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M0.75 12c0 2.9837 1.18526 5.8452 3.29505 7.955C6.15483 22.0647 9.01631 23.25 12 23.25c2.9837 0 5.8452 -1.1853 7.955 -3.295 2.1097 -2.1098 3.295 -4.9713 3.295 -7.955 0 -2.98369 -1.1853 -5.84517 -3.295 -7.95495C17.8452 1.93526 14.9837 0.75 12 0.75c-2.98369 0 -5.84517 1.18526 -7.95495 3.29505C1.93526 6.15483 0.75 9.01631 0.75 12Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M6.75 11.125c0 1.1603 0.46094 2.2731 1.28141 3.0936 0.82047 0.8205 1.93327 1.2814 3.09359 1.2814 1.1603 0 2.2731 -0.4609 3.0936 -1.2814 0.8205 -0.8205 1.2814 -1.9333 1.2814 -3.0936 0 -1.16032 -0.4609 -2.27312 -1.2814 -3.09359C13.3981 7.21094 12.2853 6.75 11.125 6.75c-1.16032 0 -2.27312 0.46094 -3.09359 1.28141C7.21094 8.85188 6.75 9.96468 6.75 11.125Z" stroke-width="1.5"></path><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m14.219 14.218 3.031 3.032" stroke-width="1.5"></path></svg>
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
                                    Nenhuma referência cadastrada
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
        </div> */}

        {confirmModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-md w-[25%]">
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
                        Deseja excluir essa referência?
                    </div>


                    
                    <div className="h-[20%] flex justify-end items-center gap-4 *:font-bold *:py-1 *:px-10">
                        <button onClick={() => {
                                setConfirmModal(false);
                                setIdDelet('');
                            }} 
                            className="flex justify-center items-center border border-gray-500 bg-white text-gray-800 w-[150px] px-1 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                        </button>
                        <button type="button"
                            disabled={disableButton}
                            onClick={deleteReference} 
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
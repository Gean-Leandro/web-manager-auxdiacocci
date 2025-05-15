import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar";
import { DynamicListInputDescription } from "../../components/DynamicListDescription";
import { Notification } from "../../components/Notification";
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AccountService } from "../../services/accountService";
import { Egg, Image, Search } from "lucide-react";

interface Iscore {
    level: number,
    img: string,
    imgUrlTemp: string,
    imgPath: string,
    description: Array<string>
}

interface eimeriaProps{
    name: string,
    imgLocal: string,
    imgPath: string,
    category: string,
    general_description: string,
    place_of_action: string,
    clinical_signs: Array<string>,
    score: Array<Iscore>
}

export function ViewEimeria(){
    useEffect(() => {
        document.title = "Visualizando Eimeria";
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

    const location = useLocation();
    const [eimeria, setEimeria] = useState<eimeriaProps>(location.state);
    const [image, setImage] = useState<string>("");
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [scoreModal, setScoreModal] = useState<boolean>(false);
    const [scoreDescription, setScpreDescription] = useState<string[]>([]);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );
    const [login, setLogin] = useState<string>('');

    function capitalizeFirstLetter(text: string) {
        const lowerText = text.toLowerCase();
        return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
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
            <Sidebar levelAccount={login} selected={2}/>
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center py-6">
                        <div className="py-2 pl-2">
                            <div className="flex gap-1 mb-2 justify-start items-center">
                                <Egg className="mr-3 text-blue-600" size={35} />
                                <h1 className="text-2xl font-bold">Visualizando eimeria</h1>
                            </div>
                            <p className="text-gray-500">Informações da espécie cadastrada</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">CADASTRO EIMERIA</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">NOME:</label>
                            <input 
                            value={eimeria.name}
                            disabled={true}
                            placeholder="Nome"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full" 
                            />
                        </div>
                    
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">IMAGEM DA ÁREA DE LESÃO:</label>

                            <div className="flex justify-start items-center gap-2">
                                <button 
                                    onClick={() => {
                                        setImage(eimeria.imgLocal);
                                        setImageModal(true);
                                    }}
                                    type="button" 
                                    className={`${eimeria.imgLocal !== "" ? "bg-green-500 text-white" : "bg-mygray-300"} text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300`}>
                                {eimeria.imgLocal !== "" ? "VER IMAGEM" : "SELECIONAR IMAGEM"}
                                </button>
                            </div>
                        </div>
                    
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">CATEGORIA:</label>
                            <input 
                            value={eimeria.category}
                            disabled={true}
                            placeholder="Categoria"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full" 
                            />
                        </div>
                    
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">DESCRIÇÃO GERAL:</label>
                            <div className="relative">
                                <textarea name="description" 
                                id="description"
                                disabled={true}
                                value={eimeria.general_description}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full" 
                                placeholder="DESCRIÇÃO"/>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">LOCAL DE AÇÃO:</label>
                            <div className="relative">
                                <textarea name="placeOfAction" 
                                    id="placeOfAction"
                                    disabled={true}
                                    value={eimeria.place_of_action}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full" 
                                    placeholder="LOCAL"/>
                            </div>
                        </div>
                    
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">SINAIS CLÍNICOS E SINAIS MACROSCÓPICOS:</label>
                            
                            <div className="mt-2 border border-gray-400 rounded-md bg-gray-50">
                                <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                                        { eimeria.clinical_signs.length === 0 ? (
                                            <p className="text-gray-500 pt-[15px] text-sm text-center">Nenhum sinal adicionado</p>
                                        ): (
                                            <ul className="px-2 py-1">
                                                {eimeria.clinical_signs.map((desc, index) => (
                                                    <li key={index} className="p-1 border-b flex items-center justify-between">
                                                        <div className="w-[100%] break-words">
                                                            {desc}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            </div>
                        </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">SCORE:</label>

                        <div className="mt-2 border border-gray-400 rounded-md bg-gray-50">
                            <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                            { eimeria.score.length === 0 ? (
                                        <p className="text-center text-gray-500 p-2 mt-1">Nenhum score disponível.</p>
                                    ): (
                                        <ul>
                                            {eimeria.score.map((score, index) => (
                                                <li key={index} className="py-2 px-4 border-b flex first-letter:uppercase items-center justify-between">
                                                    {score.level}
                                                    <div className="flex items-center gap-2 *:p-1">
                                                        {/* Botão visualizar imagem */}
                                                        <button onClick={() => {
                                                                setImage(score.img);
                                                                setImageModal(true);
                                                            }} 
                                                            type="button" 
                                                            className={`${score.img === "" ? "hidden": ""} hover:text-blue-500 flex justify-center items-center`}>
                                                            <Image size={20}/>
                                                        </button>
                                                        
                                                        {/* Botão de visualizar */}
                                                        <button 
                                                            onClick={() => {
                                                                setScpreDescription(eimeria.score[index].description);
                                                                setScoreModal(true);
                                                            }}
                                                            type="button" 
                                                            className="hover:text-blue-500">
                                                            <Search size={20}/>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <Link to={'/eimerias'} className="border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100">
                            CANCELAR
                            </Link>
                            <Link to={'/atualizar-eimeria'} state={eimeria} className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
                                EDITAR
                            </Link>
                        </div>
                    </div>
                </div>       
            </div>
        </div>

        {/* Modal Imagem */}
        {imageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white px-4 pb-1 pt-4 rounded-lg shadow-lg min-w-[30%] min-h-[30%] max-w-[90%] max-h-[90%] overflow-auto relative">
                    <div className="flex justify-between h-[10%] w-[100%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center items-center w-[90%] pl-12">
                            IMAGEM
                        </div>
                        <button type="button" onClick={() => {
                            setImageModal(false);
                            setImage('');
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src={image} alt="Visualização" className="max-w-full max-h-[70vh] rounded border-[2px] border-mygray-500 mb-4" />
                    </div>
                </div>
            </div>
        )}

        {/* Modal Visualizar score*/}
        {scoreModal && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-[8px] w-[50%] min-h-[20%]">
                    <div className="flex justify-between h-[10%] mb-3">
                        <div className="font-bold text-[18px] flex justify-center items-center w-[90%] pl-10">
                            <strong className="text-mygray-600 mr-1">SCORE {">"}</strong>INFORMAÇÕES ADICIONAIS
                        </div>
                        <button type="button" onClick={() => {
                                setScoreModal(false);
                                setScpreDescription([]);
                            }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 2.5L12 12M21.5 21.5L12 12M12 12L2.5 21.5L21.5 2.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div className="h-[90%] w-[100%] flex items-center justify-center">
                        <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500 w-[100%]">
                            <div className="bg-white rounded-[8px] border-[2px] border-mygray-500 p-1">
                                <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                                        { scoreDescription.length === 0 ? (
                                            <p className="text-center text-gray-500 p-2 mt-1">Nenhuma descrição adicionada</p>
                                        ): (
                                            <ul>
                                                {scoreDescription.map((desc, _) => (
                                                    <li className="p-2 border-b flex first-letter:uppercase items-center justify-between">
                                                        <div className="w-[100%] break-words">
                                                            {capitalizeFirstLetter(desc)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
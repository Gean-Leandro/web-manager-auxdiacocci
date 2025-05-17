import { useState } from "react";
import { Notification } from "../Notification";
import { Check, Edit2, Trash2, X } from "lucide-react";

interface DynamicListInputProps {
    title: string,
    textEmptyReport: string,
    placeholder: string,
    list: Array<string>,
    onRemove: (index: number) => void,
    onAdd: (newItem: string) => void,
    onEdit: (index: number | null, newDescription: string) => boolean
}

export function DynamicListInput(props:DynamicListInputProps) {
    const [newDescription, setNewDescription] = useState("");
    const [editDescriptionIndex, setEditDescriptionIndex] = useState<number | null>(null);
    const [showNotification, setShowNotification] = useState<{active:boolean, mensage:string, bgColor:string}>(
        {active:false, mensage:"", bgColor:""}
    );

    const addNewDescriptionButton = () => {
        if (newDescription.trim() !== "") {
            props.onAdd(newDescription.trim());
            setNewDescription("");
        } else {
            setShowNotification({
                active: true,
                mensage: "Preencha o campo para poder adicionar uma nova descrição",
                bgColor: "bg-orange-500"
            })
        }
    }

    const editDescriptionActivate = (index:number, description:string) => {
        setEditDescriptionIndex(index);
        setNewDescription(description);
    }

    const editDescriptionCancel = () => {
        setNewDescription("");
        setEditDescriptionIndex(null);
    }

    const editDescriptionSave = () => {
        if (props.onEdit(editDescriptionIndex, newDescription.trim())) {
            setNewDescription("");
            setEditDescriptionIndex(null);
            setShowNotification({
                active: true,
                mensage: "Descrição atualizada",
                bgColor: "bg-green-600"
            });
        } else {
            setShowNotification({
                active: true,
                mensage: "Descrição é idêntica a anterior, ação cancelada",
                bgColor: "bg-orange-500"
            });
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

        <label className="block text-sm font-medium text-gray-700 mb-2">{props.title}</label>

        <div className={`relative ${editDescriptionIndex !== null ? "hidden": ""}`}>
            <input 
                type="text" 
                className="border border-gray-500 pr-10 rounded-md px-3 py-2 w-full" 
                placeholder={props.placeholder} 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-gray-200 rounded-md p-1 hover:bg-gray-300"
                onClick={addNewDescriptionButton}
                type="button">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>

        {/* Campo de edição */}
        <div className={`relative ${editDescriptionIndex === null ? "hidden": ""} py-2`}>
            <input 
                type="text" 
                className="border border-gray-300 pr-10  rounded-md px-3 py-3 w-full" 
                placeholder={props.placeholder} 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />

            <div className="absolute right-2 top-3 flex gap-2 py-1 *:py-2 *:px-2">
                <button
                    onClick={editDescriptionCancel}
                    type="button" 
                    className="text-red-500 hover:text-red-700 bg-red-200 flex items-center justify-center rounded-[8px]">
                    <X size={20}/>
                </button>
                <button
                    onClick={editDescriptionSave}
                    type="button" 
                    className="text-green-500 hover:text-green-700 flex items-center bg-green-200 justify-center rounded-[8px]">
                    <Check size={20}/>
                </button>
            </div>
        </div>

        <div className="mt-2 border border-gray-400 rounded-md bg-gray-50">
            <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                    { props.list.length === 0 ? (
                        <p className="text-gray-500 pt-[15px] text-sm text-center">{ props.textEmptyReport }</p>
                    ): (
                        <ul className="px-2 py-1">
                            {props.list.map((desc, index) => (
                                <li key={index} className="p-1 border-b flex items-center justify-between">
                                    <div className="w-[85%] break-words">
                                        {desc}
                                    </div>
                                    <div className="flex items-center gap-2 *:p-2">
                                        {/* Botão de edição */}
                                        <button onClick={() => editDescriptionActivate(index, desc)}
                                            type="button" 
                                            className={`text-gray-600 hover:text-blue-600 rounded-[8px] ${index === editDescriptionIndex ? "hidden": ""}`}>
                                            <Edit2 size={20} />
                                        </button>
                                        <button onClick={() => props.onRemove(index)} type="button" className="text-red-500 hover:text-red-700 rounded-[8px]">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
        </>
    )
}
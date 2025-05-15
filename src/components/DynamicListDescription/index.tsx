interface DynamicListInputProps {
    title: string,
    icon: any,
    textEmptyReport: string,
    list: Array<string>
}

export function DynamicListInputDescription(props:DynamicListInputProps) {
    function capitalizeFirstLetter(text: string) {
        const lowerText = text.toLowerCase();
        return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
    }
    
    return(
        <>
        <div className="flex gap-3">
            {props.icon}
            {props.title}:
        </div>
        <div className="bg-mygray-200 p-2 rounded-[8px] border-[2px] border-mygray-500">
            <div className="bg-white rounded-[8px] border-[2px] border-mygray-500 p-1">
                <div className="min-h-[50px] max-h-[200px] overflow-y-auto w-[100%]">
                        { props.list.length === 0 ? (
                            <p className="text-center text-gray-500 p-2 mt-1">{ props.textEmptyReport }</p>
                        ): (
                            <ul>
                                {props.list.map((desc, _) => (
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
        </>
    )
}
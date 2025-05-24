import {  
    FileText, 
    BookOpen, 
    FilePlus, 
    Microscope,
    LayoutDashboard,
  } from 'lucide-react';
import { Sidebar } from '../../components/sidebar';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AccountService, IAccount } from '../../services/accountService';
import { auth } from '../../../firebaseConfig';
  
export default function Dashboard() {

    const [login, setLogin] = useState<IAccount>({
        uid: '',
        name: '',
        email: '',
        level: '',
        active: true,
        historic: [],
    });

    useEffect(() => {
        document.title = "Cadastros de Eimerias";
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

    return (
        <div className="flex h-screen w-full bg-gray-100">
        
            {/* Sidebar azul escura */}
            <Sidebar levelAccount={login.level} selected={1}/>
            
            {/* Conteúdo principal */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="flex items-center p-6">
                    <div className="p-2">
                        <div className="flex gap-1 mb-2 justify-start items-center">
                            <LayoutDashboard className="mr-3 text-blue-600" size={35} />
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                        </div>
                        <p className="text-gray-500">Gerencie as informações sobre Eimeria, termos e referências de pesquisa.</p>
                    </div>
                </div>
                
                {/* Cards */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 *:hover:cursor-pointer">
                    {/* Card - Registrar Eimeria */}
                    <Link to={'/nova-eimeria'} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Registrar Eimeria</h2>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FilePlus className="text-blue-500" size={24} />
                        </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                        Adicionar nova espécie de Eimeria e suas informações
                        </p>
                    </Link>
                    
                    {/* Card - Glossário */}
                    <Link to={'/glossario'} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Glossário</h2>
                        <div className="bg-green-100 p-3 rounded-full">
                            <BookOpen className="text-green-500" size={24} />
                        </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                        Gerencie os termos técnicos e definições
                        </p>
                    </Link>
                    
                    {/* Card - Referências de pesquisa */}
                    <Link to={'/referencias'} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Referências de pesquisa</h2>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <FileText className="text-orange-500" size={24} />
                        </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                        Adicione e gerencie citações de pesquisa
                        </p>
                    </Link>
                    
                    {/* Card - Nomes científicos */}
                    <Link to={'/nomes-cientificos'} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Nomes científicos</h2>
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <Microscope className="text-indigo-500" size={24} />
                        </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                        Gerencie taxonomia e classificação científica
                        </p>
                    </Link>
                </div>

                
                
                {/* Atividades recentes */}
                <div className="mx-6 mb-6 bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Atividades recente</h2>
                        { login.historic.length === 0  &&
                            <p className="text-blue-600">você ainda não adicionou nenhuma entrada</p>
                        }
                    </div>
                    
                    <div className='border-t flex w-[100%] items-center py-2 border-b hover:bg-gray-50'>
                        <p className='border-x w-[37.5%] flex justify-center items-center font-bold'>Tipo</p>
                        <p className='border-x w-[28.5%] flex justify-center items-center font-bold'>Item</p>
                        <p className='border-x w-[18.5%] flex justify-center items-center font-bold'>Entidade</p>
                        <p className='border-x w-[20%] flex justify-center items-center font-bold'>Data/Hora</p>
                    </div>
                    {/* Área vazia com ícone */}
                    <div className="h-[220px] overflow-y-auto border-t-4">
                        { login.historic.length === 0 ?
                            <div className='w-[100%] h-[100%] flex justify-center items-center'>
                                <div className="bg-gray-100 p-6 rounded-full mb-4">
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-300" stroke="currentColor" fill="none">
                                        <circle cx="12" cy="12" r="10" strokeWidth="1" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>:

                            <>
                                {login?.historic && login.historic.map((item, index) => (
                                    <div key={index} 
                                        className="flex w-[100%] items-center justify-between border-b hover:bg-gray-50">
                                        
                                        <p className='border-x w-[40%] p-2 flex h-[100%] justify-center break-words items-center'>
                                            {item.action}
                                        </p>
                                        <p className='w-[30%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.name}
                                        </p>
                                        <p className='border-l w-[20%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.entity}
                                        </p>
                                        <p className='border-x w-[20%] flex h-[100%] p-2 justify-center break-words items-center'>
                                            {item.timestamp.toDate().toLocaleString()}
                                        </p>
                                    </div>
                                ))
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
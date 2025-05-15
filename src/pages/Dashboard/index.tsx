import {  
    FileText, 
    BookOpen, 
    FilePlus, 
    User,
    Microscope,
  } from 'lucide-react';
import { Sidebar } from '../../components/sidebar';
  
export default function Dashboard() {
return (
    <div className="flex h-screen w-full bg-gray-50">
    
        {/* Sidebar azul escura */}
        <Sidebar levelAccount='admin'/>
        
        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto bg-[#FBFBFB]">
            {/* Cabeçalho */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-blue-600">Gerencie as informações sobre Eimeria, termos e referências de pesquisa.</p>
            </div>
            
            {/* Cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 *:hover:cursor-pointer">
            {/* Card - Registrar Eimeria */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Registrar Eimeria</h2>
                <div className="bg-blue-100 p-3 rounded-full">
                    <FilePlus className="text-blue-500" size={24} />
                </div>
                </div>
                <p className="text-gray-600 text-sm">
                Adicionar nova espécie de Eimeria e suas informações
                </p>
            </div>
            
            {/* Card - Glossário */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Glossário</h2>
                <div className="bg-green-100 p-3 rounded-full">
                    <BookOpen className="text-green-500" size={24} />
                </div>
                </div>
                <p className="text-gray-600 text-sm">
                Gerencie os termos técnicos e definições
                </p>
            </div>
            
            {/* Card - Referências de pesquisa */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Referências de pesquisa</h2>
                <div className="bg-orange-100 p-3 rounded-full">
                    <FileText className="text-orange-500" size={24} />
                </div>
                </div>
                <p className="text-gray-600 text-sm">
                Adicione e gerencie citações de pesquisa
                </p>
            </div>
            
            {/* Card - Nomes científicos */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Nomes científicos</h2>
                <div className="bg-indigo-100 p-3 rounded-full">
                    <Microscope className="text-indigo-500" size={24} />
                </div>
                </div>
                <p className="text-gray-600 text-sm">
                Gerencie taxonomia e classificação científica
                </p>
            </div>
            
            {/* Card - Gerenciar Conta */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Gerenciar Conta</h2>
                <div className="bg-purple-100 p-3 rounded-full">
                    <User className="text-purple-500" size={24} />
                </div>
                </div>
                <p className="text-gray-600 text-sm">
                Gerencie as sua informações de conta
                </p>
            </div>
            </div>
            
            {/* Atividades recentes */}
            <div className="mx-6 mb-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Atividades recente</h2>
                <p className="text-blue-600">você ainda não adicionou nenhuma entrada</p>
            </div>
            
            {/* Área vazia com ícone */}
            <div className="flex flex-col items-center justify-center py-20 px-6 border-t">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                <div className="w-16 h-16 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-300" stroke="currentColor" fill="none">
                    <circle cx="12" cy="12" r="10" strokeWidth="1" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="1" />
                    </svg>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
);
}
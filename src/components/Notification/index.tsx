import { useEffect } from "react";

interface NotificationProps {
    message: string;
    bgColor?: string;
    onClose: () => void;
}

export function Notification({ message, bgColor = "bg-blue-500", onClose }: NotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose();
        }, 5000); // 5 segundos

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-[8px] shadow-lg text-white text-sm z-50 ${bgColor} transition-all duration-300`}
        >
        {message}
        </div>
    );
};

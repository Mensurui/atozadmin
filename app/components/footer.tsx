import React from "react";

export function Footer({children}: {children:React.ReactNode}){
    return (
        <div className="bg-blue-900">
            {children}
        </div>
    )
}
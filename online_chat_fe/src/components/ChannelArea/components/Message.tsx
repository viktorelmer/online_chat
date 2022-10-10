import React from "react";
import { IMessage } from "../../../exports/types.common";
import Appendix from "./Appendix";

interface Props {
    message: IMessage
    isMessageFromYou: boolean
    date: string
}

const Message: React.FC<Props> = ({message, isMessageFromYou, date}) => {

    return (
       <div className={`message-item flex ${isMessageFromYou && 'justify-end'} mt-2 items-center`}>
            {!isMessageFromYou && 
                <div className="logo w-8 mt-4 mr-2">
                     <img src={'https://joeschmoe.io/api/v1/'+message.user_id.id} alt="" className=" rounded-full bg-white"/>
                </div>
            }
            <div className={`message-text message-type-last ${isMessageFromYou && '!ml-0 bg-[rgb(220,248,197)]'} bg-white rounded-md px-2 flex`}>
                <div className="info py-2">
                    {!isMessageFromYou &&
                        <>
                            <div className=" text-[#a695e7] font-semibold">{message.user_id.username}</div>
                            <Appendix/>
                        </>
                    }
                    {message.text}
                </div>
                {date && <div className={`time text-[0.75rem] m-0 self-end text-gray-500 opacity-70 ml-2 ${isMessageFromYou && 'text-[rgb(79,174,78)]'}`}>
                    <>{date.split(' ')[1]}</>
                </div>}
            </div>
        </div>
    )
}

export default React.memo(Message)
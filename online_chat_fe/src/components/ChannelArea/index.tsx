import { Empty } from "antd";
import { Channel } from "pusher-js";
import React from "react";
import { IChannel, IInitMessage, IMessage, ISendMessage, IUser } from "../../exports/types.common";
import { getCurrentChannel, pusher } from "../../exports/util";
import useAuthHook from "../../hooks/authHook";
import useSWRCustom from "../../hooks/useSWR";

import './ChannelArea.scss'
import Appendix from "./components/Appendix";

interface Props {
    userData: IUser
}

const ChannelArea: React.FC<Props> = ({ userData }) => {
    const [channel, setChannel] = React.useState<IChannel>(),
        [messages, setMessages] = React.useState<IMessage[]>()

    const { data: messagesFetched, error: messagesError } = useSWRCustom<IMessage[]>('get', channel ?`/messages/${channel.id}` : null);
    const [newMessage, setMessage] = React.useState<ISendMessage | null>()
    const { data: message, error } = useSWRCustom<IMessage>('post', newMessage ? '/messages/new' : null, newMessage)


    const subscriberRef = React.useRef<Channel>(),
        messageContainerRef = React.createRef<HTMLDivElement>()

    React.useEffect(() => {
        if (message?.data) {
            setMessage(null)
            window.scrollTo({
                top: messageContainerRef.current?.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [message])
    
    React.useEffect(() => {
        function onChangeChannel() {
            const currentChannel = getCurrentChannel()
            if (currentChannel) setChannel(currentChannel);
        }        

        document.addEventListener('storage', onChangeChannel)
        return () => {
            document.removeEventListener('storage', onChangeChannel)
        }
    }, [])

    React.useEffect(() => {
        if (messagesFetched) {
            const msgs = messagesFetched.data
            setMessages(msgs);
        }
    }, [messagesFetched])

    const subscribeCB = React.useCallback((data: {message: IMessage, user: IUser}) => {
        setMessages((prevState) => {
            data.message.user_id = data.user
            const newMessages = prevState ? [...prevState, data.message] : [data.message]
            return newMessages 
        });
    }, [messages])

    React.useEffect(() => {
        subscriberRef.current = pusher.subscribe("channel-" + channel?.id);
        subscriberRef.current.bind("send-message", subscribeCB);
        
        return () => {
            // fix multiply binds for 1 connection
            subscriberRef.current?.unbind("send-message", subscribeCB)

        }
    }, [channel, subscribeCB])


    React.useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
        }
    }, [messages])

    function sendMessage(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const text = e.currentTarget.value
            e.currentTarget.value = ""
            if (text.length > 0 && channel?.id && userData) setMessage({
                text: text,
                channel_id: channel.id,
                UUID: userData.uuid
            })
        }
    }
    
    function getUserLogo(userId: string | number, isLatestMessage: boolean, nextMessage: IMessage) {
        if (!isLatestMessage && nextMessage.user_id.id === userId) return;
        return <img src={'https://joeschmoe.io/api/v1/'+userId} alt="" className=" rounded-full bg-white"/>;
    }

    if (!channel) {
        return <div className="w-full h-screen flex justify-center items-center">
            <Empty description={false}/>
        </div>;
    }
    
    return (
        <div className="channel-area w-full max-h-screen overflow-hidden">
            <div className="message-area m-auto flex w-full h-full flex-col items-center">     
                <header className="message-area-header w-full p-5 bg-white">
                {channel?.name}
                </header>
                <div className="messages flex flex-col overflow-auto w-1/2 flex-grow px-5" ref={messageContainerRef}>
                    {messages?.map((message, id) => {
                        const isMessageFromYou = message.user_id.id === userData?.id

                        let messageType: 'first' | 'last' | 'middle' | 'one' = 'last'

                        if (id > 0 && id < messages.length - 1) {
                            const [prevMessage, nextMessage] = [messages[id - 1], messages[id + 1]]
                            if (prevMessage.user_id.id !== message.user_id.id) {
                                if (nextMessage.user_id.id !== message.user_id.id) {
                                    messageType = "one";
                                } else {
                                    messageType = "first";
                                }
                            } else {
                                if (nextMessage.user_id.id !== message.user_id.id) {
                                    messageType = "last";
                                } else {
                                    messageType = "middle";
                                }
                            }
                        }

                        let date
                        if (message.createdAt) {
                            date = new Date(message.createdAt).toLocaleDateString('en-GB', {
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        }
                        
                        return (
                            <div key={message.id} className={`message-item flex ${isMessageFromYou && 'justify-end'} mt-2 items-center`}>
                                {!isMessageFromYou && 
                                    <div className="logo w-8 mr-2">
                                        {getUserLogo(message.user_id.id, id + 1 === messages.length, messages[id+1])}
                                    </div>
                                }
                                <div className={`message-text message-type-${messageType} ${isMessageFromYou && '!ml-0 bg-[rgb(220,248,197)]'} bg-white rounded-md px-2 flex`}>
                                    <div className="info py-2">
                                        {(messageType === 'first' || messageType === 'one') && !isMessageFromYou && 
                                            <div className=" text-[#a695e7] font-semibold">{message.user_id.username}</div>
                                        }
                                        {(messageType === 'last' || messageType === 'one') && !isMessageFromYou && <Appendix/>}
                                        {message.text}
                                    </div>
                                    {date && <div className={`time text-[0.75rem] m-0 self-end text-gray-500 opacity-70 ml-2 ${isMessageFromYou && 'text-[rgb(79,174,78)]'}`}>
                                        <>{date.split(' ')[1]}</>
                                    </div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <input className="w-1/3 mb-5 outline-none rounded-lg text-xl px-3 py-4 mt-3" placeholder="Message" onKeyDown={sendMessage} disabled={!!newMessage}/>
            </div>

        </div>
    )
}

export default ChannelArea
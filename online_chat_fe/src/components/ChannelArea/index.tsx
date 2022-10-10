import { Empty } from "antd";
import { Channel } from "pusher-js";
import React, { useCallback } from "react";
import { IChannel, IMessage, ISendMessage, IUser, MessageTypes } from "../../exports/types.common";
import { BACKEND_URL, getCurrentChannel, pusher } from "../../exports/util";
import useAxios from "../../hooks/useAxios";
import useSWRCustom from "../../hooks/useSWR";

import Message from "./components/Message";

import "./ChannelArea.scss";

interface Props {
    userData: IUser
}

const ChannelArea: React.FC<Props> = ({ userData }) => {
    const [channel, setChannel] = React.useState<IChannel>(),
        [messages, setMessages] = React.useState<IMessage[]>()

    const { data: messagesFetched } = useSWRCustom<IMessage[]>('get', channel ?`/messages/${channel.id}` : null);
    const {send} = useAxios(BACKEND_URL)


    const subscriberRef = React.useRef<Channel>(),
        messageContainerRef = React.createRef<HTMLDivElement>()
        
    
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

    const sendMessage = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && channel) {
            const text = e.currentTarget.value
            e.currentTarget.value = ""

            const newMessage: ISendMessage = {
                text: text,
                channel_id: channel.id,
                UUID: userData.uuid
            }
            send<ISendMessage>('post', '/messages/new', newMessage)

        }
    }, [userData, channel, send])

    const getSortedMessages = useCallback((): IMessage[] => {
        if (messages) {
            return messages.sort((pV, cV) => {
                if (pV.id < cV.id) return -1
                return 1
            })
        }
        return []
    }, [messages])

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
                    {getSortedMessages().map((message) => {
                        const date = new Date(message.createdAt).toLocaleDateString('en-GB', {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                        
                        return (
                            <Message key={message.id} date={date} message={message} isMessageFromYou={message.user_id.id === userData?.id}/>
                        )
                    })}
                </div>
                <input className="w-1/3 mb-5 outline-none rounded-lg text-xl px-3 py-4 mt-3" placeholder="Message" onKeyDown={sendMessage} />
            </div>

        </div>
    )
}

export default ChannelArea
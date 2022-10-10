import { Channel } from "pusher-js";
import React from "react";
import { IChannel, IMessage, IUser } from "../../../exports/types.common";
import { pusher, setCurrentChannel } from "../../../exports/util";


interface Props {
    channel: IChannel;
    selectChannel: (channelID: number) => void;
    isSelected: boolean
}

const ChannelItem: React.FC<Props> = ({channel, selectChannel, isSelected}) => {
    const [unreadedMessages, setUndreadedMessages] = React.useState<number>(0)

    const logoRef = React.createRef<HTMLDivElement>(),
        subscriberRef = React.useRef<Channel>()
    
    React.useEffect(() => {
        if (isSelected) {
            setUndreadedMessages(0)
        }
    }, [isSelected])


    const subscribeCB = React.useCallback((data: {message: IMessage, user: IUser}) => {
        setUndreadedMessages((prevValue) => prevValue + 1)
    }, [])

    React.useEffect(() => {
        subscriberRef.current = pusher.subscribe("channel-" + channel?.id);
        subscriberRef.current.bind("send-message", subscribeCB);

    }, [subscribeCB, channel]);

    React.useEffect(() => {
        const logoColor = Math.floor((channel.id + 1)*54354564).toString(16)

        if (logoRef.current)
            logoRef.current.style.background = `linear-gradient(#ffffff -125%, #${logoColor})`;

    }, [logoRef])


    function setActiveChannel() {
        setCurrentChannel(channel)
        selectChannel(channel.id)
    }

    function getUnreadedMessages() {
        if (isSelected && unreadedMessages > 0) {
            setUndreadedMessages(0)
        } else if (unreadedMessages > 0) {
            return (
                <div className="unreaded w-6 rounded-full bg-slate-500 text-center text-white">
                    {unreadedMessages}
                </div>
            )
        }
    }

    return (
        <div className={`channel-item overflow-hidden w-full rounded-2xl flex p-3 ${isSelected && '!bg-[rgb(51,144,236)] text-white'}`} onClick={setActiveChannel}>
            <div className="logo text-xl mr-3" ref={logoRef}>
                {channel.name[0].toLocaleUpperCase()}
            </div>
            <div className="info w-full">
                <div className="title flex">
                    <div className="font-semibold text-lg">
                        {channel.name}
                    </div>
                </div>
                <div className="subtitle w-full flex justify-between">
                    <div className="subtitle-text">
                    </div>
                    {getUnreadedMessages()}
                </div>
            </div>
        </div>
    )
}

export default React.memo(ChannelItem);
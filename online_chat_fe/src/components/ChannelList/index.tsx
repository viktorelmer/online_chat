import React, { useCallback } from "react";
import { IChannel } from "../../exports/types.common";
import { pusher } from "../../exports/util";
import useSWRCustom from "../../hooks/useSWR";
import NewChannel from "../NewChannel";

import './ChannelList.scss'
import ChannelItem from "./components/ChannelItem";

interface Props {

}

const ChannelList: React.FC<Props> = () => {
    const { data: fetchedChannels, error } = useSWRCustom<IChannel[]>("get", "/channels/all")
    const [channels, setChannels] = React.useState<IChannel[]>()
    const [mouseOver, setMouseOver] = React.useState(false)
    const [modal, setModalState] = React.useState(false)
    const [activeChannel, setActiveChannel] = React.useState<number>()

    const setMouseOverTrue = () => setMouseOver(true)
    const setMouseOverFalse = () => setMouseOver(false);

    const selectChannel = React.useCallback((channelID: number) => {
        setActiveChannel(channelID);
      }, [setActiveChannel]);

    React.useEffect(() => {
        const newChannels = pusher.subscribe('new-channels')
        newChannels.bind('new-channel-created', (data: IChannel) => {
            const newChannels = channels ? [...channels, data] : [data];
            setChannels(newChannels);
        })
    }, [channels])

    React.useEffect(() => {
        if (fetchedChannels?.data) {
            setChannels([...fetchedChannels.data])
        } 
    }, [fetchedChannels])

    if (error) {
        return <div>Error: {error.response.data.message}</div>
    }
    
    return (
        <div className="channel-list min-w-[400px] w-1/3 h-screen overflow-hidden bg-white" onMouseOver={setMouseOverTrue} onMouseLeave={setMouseOverFalse}>
            <div className="p-2 h-screen overflow-auto">
                {channels?.map(channel => 
                    <ChannelItem key={channel.id} channel={channel} selectChannel={selectChannel} isSelected={activeChannel === channel.id}/>
                )}
            </div>
            <div className={`NewChatButton ${mouseOver && 'revealed'} flex items-center justify-center select-none text-xl`} onClick={() => {
                setModalState(true)
            }}>
                ✏️
            </div>
            <NewChannel open={modal} setModalState={setModalState} />
        </div>
    )
}

export default ChannelList
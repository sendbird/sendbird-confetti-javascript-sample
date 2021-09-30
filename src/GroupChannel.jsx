import "sendbird-uikit/dist/index.css";
import React, { useState } from "react";
import { ChannelList , Channel , ChannelSettings, sendBirdSelectors, withSendBird} from 'sendbird-uikit';
import "./index.css";
import CustomizedMessageItem from "./CustomizedMessageItem";
import Confetti from "react-confetti";
// import ConfettiTrigger from './ConfettiTrigger';

function GroupChannel({ sdk, userId}) {
    const [currentChannel, setCurrentChannel] = useState(null);
    const currentChannelUrl = currentChannel ? currentChannel.url : "";
    const [showSettings, setShowSettings] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    var channelChatDiv = document.getElementsByClassName('channel-chat')[0];

    const renderSettingsBar =()=>{     
        channelChatDiv.style.width="52%";
        channelChatDiv.style.cssFloat="left";
    }

    const hideSettingsBar=()=>{ 
        channelChatDiv.style.width="76%";
        channelChatDiv.style.cssFloat="right";
    }

    const handleSendUserMessage = (text) => {
        console.log("sdk", sdk)
        const userMessageParams = new sdk.UserMessageParams();
        console.log("userMessageparams",userMessageParams)
        if(text.includes("congrats") || text.includes("congratulations")){
            userMessageParams.data="confetti"
            setShowConfetti(true);
            userMessageParams.message = text;
            return userMessageParams;
        }
    }
    
    // const CustomInputWithSendbird = withSendBird(ConfettiTrigger, (state) => {
    //     const sendMessage = sendBirdSelectors.getSendUserMessage(state);
    //     const sdk = sendBirdSelectors.getSdk(state);
    //     return {
    //         sendMessage,
    //         sdk
    //     };
    // })
    console.log(sdk)
    return (
      <div className="group-channel-wrap">
        {showConfetti &&
            // <ConfettiTrigger showConfetti={showConfetti} setShowConfetti={setShowConfetti}/>,
            <Confetti   width={1300} height={800} />
        }
        <div className="channel-list">  
            <ChannelList
                onChannelSelect={(channel) => {
                    if (channel && channel.url) {                                 
                        setCurrentChannel(channel);                
                    } 
                }}                                         
            /> 
        </div>
         <div className="channel-chat"> 
            <Channel
                channelUrl={currentChannelUrl}
                onChatHeaderActionClick={() => {
                    setShowSettings(!showSettings);
                    renderSettingsBar();
                }}    
                renderChatItem={({
                    message,
                    onDeleteMessage,
                    onUpdateMessage
                }) => (
                    <CustomizedMessageItem
                        message={message}
                        onDeleteMessage={onDeleteMessage}
                        onUpdateMessage={onUpdateMessage}
                        userId={userId}
                    />
                )}            
                // renderMessageInput={CustomInputWithSendbird}
                onBeforeSendUserMessage={handleSendUserMessage}
            />
        </div>
        {showSettings && (
            <div className="channel-settings">                
                <ChannelSettings
                    channelUrl={currentChannelUrl}
                    onCloseClick={() => {
                        setShowSettings(false);
                        hideSettingsBar();
                    }}
                />
            </div>
         )}     
    </div>
  );
}

export default withSendBird(GroupChannel, (store) => {
    return {
      sdk: sendBirdSelectors.getSdk(store),
      user: store.stores.userStore.user
    };
});
import "sendbird-uikit/dist/index.css";
import React, { useState } from "react";
import { ChannelList , Channel , ChannelSettings, sendBirdSelectors, withSendBird} from 'sendbird-uikit';
import "./index.css";
import CustomizedMessageItem from "./CustomizedMessageItem";
import Confetti from "react-confetti";
import SendBird from 'sendbird';

function GroupChannel({ sdk, userId}) {
    const [currentChannel, setCurrentChannel] = useState(null);
    const currentChannelUrl = currentChannel ? currentChannel.url : "";
    const [showSettings, setShowSettings] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [recycleOption, setRecycleOption]= useState(false);
    var channelChatDiv = document.getElementsByClassName('channel-chat')[0];

    const renderSettingsBar=()=>{     
        channelChatDiv.style.width="52%";
        channelChatDiv.style.cssFloat="left";
    }

    const hideSettingsBar=()=>{ 
        channelChatDiv.style.width="76%";
        channelChatDiv.style.cssFloat="right";
    }

    const handleSendUserMessage = (text) => {
        const userMessageParams = new sdk.UserMessageParams();
        if(text.includes("congrats") || text.includes("congratulations") || text.includes("Congratulations") || text.includes("Congrats")){
            userMessageParams.data="confetti"
            triggerConfetti();
        }
        //then setTimeout ->  setShowConfetti(false); (after recycles changed to false)
        userMessageParams.message = text;
        return userMessageParams;
    }

    const triggerConfetti=()=>{
        setShowConfetti(true);
        setRecycleOption(true);
          
        setTimeout(() => {
          setRecycleOption(false);
        }, 3000);
    };

    var sb = SendBird.getInstance();
    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message)=>{   
        console.log("MESSAGE RECEIEVED", channel, message)
        // if(message.data="confetti"){
        //    triggerConfetti();
        // };
    };
    
    var key = uuid4;
    sb.addChannelHandler(key, channelHandler.onMessageReceived);


    return (
      <div className="group-channel-wrap">
        {showConfetti &&
            <Confetti   width={1300} height={800} recycle={recycleOption}/>
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
                        setShowConfetti={setShowConfetti}
                        setRecycleOption={setRecycleOption}
                    />
                )}            
                onBeforeSendUserMessage={handleSendUserMessage}
                onBeforeUpdateUserMessage={handleSendUserMessage}
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

export const uuid4 = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  };
  
import "sendbird-uikit/dist/index.css";
import React, { useState } from "react";
import { ChannelList , Channel , ChannelSettings, sendBirdSelectors, withSendBird} from 'sendbird-uikit';
import "./index.css";
import CustomizedMessageItem from "./CustomizedMessageItem";
import Confetti from "react-confetti";
import { useCookies } from 'react-cookie';

function GroupChannel({ sdk, userId}) {
    const [currentChannel, setCurrentChannel] = useState(null);
    const currentChannelUrl = currentChannel ? currentChannel.url : "";
    const [showSettings, setShowSettings] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [recycleOption, setRecycleOption]= useState(false);
    const [message, setMessage]=useState({});
    var channelChatDiv = document.getElementsByClassName('channel-chat')[0];
    const [cookies, setCookie] = useCookies(['viewedMessage','messageId', 'confetti']);

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
        let hasConfetti = false;
        if(text.includes("congrats") || text.includes("congratulations") || text.includes("Congratulations") || text.includes("Congrats")){
            userMessageParams.data="confetti";
            hasConfetti = true;
            triggerConfetti(); 
        }  
        //add  in setCookie( {path: "/", expires: timeVariable } ) ?
//How do you attach this cookie obj to this message? 
        setCookie('viewedMessage', false)
        setCookie('messageId', message.messageId)
        setCookie('confetti', hasConfetti)
//why is setting confetti delayed ??
        console.log("cookies", cookies)

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

// Track in a cookie which ID’s I’ve seen by messageID -> create viewedMessage
// Get cookie values in JS & say I’ve got a cookie value here w/ confetti & I’ve seen before
    
    // Check messageID & confetti & viewedMessage 
        // if(!cookies.viewedMessage && cookies.confetti)       didnt view msg & confettis true
            //triggerConfetti()
    // viewedMessage, do nothing
    // Otherwise, if there’s a global Boolean that says currentlyShowingConfetti? 
            //If false, then SHOW confetti

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
                        setMessage={setMessage}
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
  
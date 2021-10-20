// "use strict";
import "sendbird-uikit/dist/index.css";
import React, { useState } from "react";
import {
  ChannelList,
  Channel,
  ChannelSettings,
  sendBirdSelectors,
  withSendBird,
} from "sendbird-uikit";
import "./index.css";
import CustomizedMessageItem from "./CustomizedMessageItem";
import Confetti from "react-confetti";

function GroupChannel({ sdk, userId }) {
  const [currentChannel, setCurrentChannel] = useState(null);
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recycleOption, setRecycleOption] = useState(false);
  var channelChatDiv = document.getElementsByClassName("channel-chat")[0];

  const renderSettingsBar = () => {
    channelChatDiv.style.width = "52%";
    channelChatDiv.style.cssFloat = "left";
  };

  const hideSettingsBar = () => {
    channelChatDiv.style.width = "76%";
    channelChatDiv.style.cssFloat = "right";
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setRecycleOption(true);
    setTimeout(() => {
      setRecycleOption(false);
    }, 3000);
  };

  const checkCurrentMessageSeen = (message) => {
    // var confettiDecay = 0;
    // var confettiTime = 0;
  };

  const handleSendUserMessage = (text) => {
    const userMessageParams = new sdk.UserMessageParams();
    // const metaArray = new MessageMetaArray('shownConfetti', ['123456'])
    // console.log('metaArray=', metaArray)
    let lowerCaseText = text.toLowerCase();
    if (lowerCaseText.includes("congrat")) {
      userMessageParams.data = "confetti";
      var shownConfettiArray = new sdk.MessageMetaArray('shownConfetti', ['123456'])
      userMessageParams.metaArrays = [shownConfettiArray]; 
      triggerConfetti(setShowConfetti, setRecycleOption);
    }
    userMessageParams.message = text;
    return userMessageParams;
  };

  //when msg received by Michelle,
  //create metaArray key/value for that message if it contains confetti
  //when msg received by chris -> metaArray will have key/value pair already since Michelle's userId is in the value (aka seen it already)
  //metaArray holds the users that've seen the confetti already so it doesnt retrigger for anyone
  if (sdk && sdk.ChannelHandler) {
    var channelHandler = new sdk.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {

    //   console.log('channel=', channel)
    //   if (message.data === "confetti") {
    //     channel.createMessageMetaArrayKeys(
    //       message,
    //       ["confetti"],
    //       function (message, error) {
    //         if (error) {
    //           console.log("error: createMessageMetaArrayKeys");
    //         }
    //         var metaArraysValue = message.metaArrays[0].value;
    //         var found = metaArraysValue.find((msgString) => {
    //           msgString.includes(userId);
    //         });
    //         //if theres a metaArraysValue already && userId is NOT found OR no metaArraysValue set yet
    //         if ((metaArraysValue && !found) || !metaArraysValue) {
    //           let currentMessageString = `${userId}`;
    //           //** isnt updating metaArraysValue -> only replacing the currentMsgString */
    //           metaArraysValue.push(currentMessageString);
    //           channel.addMessageMetaArrayValues(
    //             message,
    //             { confetti: metaArraysValue },
    //             function (message, error) {
    //               if (error) {
    //                 console.log("error: addMessageMetaArrayValues");
    //               }
    //               triggerConfetti(setShowConfetti, setRecycleOption);
    //               console.log("message=",message)
    //             }
    //           );
    //         }
    //       }
    //     );
    //   }
      console.log("onMessageReceived; message=", message)
    };

    sdk.addChannelHandler("abc12334", channelHandler);
    
  }

//   //here is where we'll check to see if its in the last 3 messages / within 24 hrs
//   channelHandler.onMessageUpdated = (channel, message) => {
// //if you add metaArrays after the msg was sent, you'll recieve message changes here (when you add meta array key/values)
//     console.log("onMessageUpdated:", message)
//   }


  return (
    <div className="group-channel-wrap">
      {showConfetti && (
        <Confetti width={1300} height={800} recycle={recycleOption} />
      )}
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
            onUpdateMessage,
            emojiContainer,
          }) => (
            <CustomizedMessageItem
              message={message}
              onDeleteMessage={onDeleteMessage}
              onUpdateMessage={onUpdateMessage}
              emojiContainer={emojiContainer}
              userId={userId}
              checkCurrentMessageSeen={checkCurrentMessageSeen}
            />
          )}
          onBeforeSendUserMessage={handleSendUserMessage}
          // ** no duplicate props allowed:
          // onBeforeUpdateUserMessage={handleSendUserMessage}
          // onBeforeUpdateUserMessage={handleSendUserMessage}
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
    user: store.stores.userStore.user,
  };
});
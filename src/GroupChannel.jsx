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
    var confettiDecay = 0;
    var confettiTime = 0;
  };

  const handleSendUserMessage = (text) => {
    const userMessageParams = new sdk.UserMessageParams();
    let lowerCaseText = text.toLowerCase();
    if (lowerCaseText.includes("congrat")) {
      userMessageParams.data = "confetti";
      triggerConfetti(setShowConfetti, setRecycleOption);
    }
    userMessageParams.message = text;
    return userMessageParams;
  };

  const channelHandler = new sdk.ChannelHandler();
  channelHandler.onMessageReceived = (channel, message) => {
    if (message.data === "confetti") {
      channel.createMessageMetaArrayKeys(
        message,
        ["confetti"],
        function (message, error) {
          if (error) {
            console.log("error: createMessageMetaArrayKeys");
          }
          var metaArraysValue = message.metaArrays[0].value;
          var found = metaArraysValue.find((msgString) => {
            msgString.includes(userId);
          });
          //if theres a metaArraysValue already && userId is NOT found OR no metaArraysValue set yet
          if (metaArraysValue && !found || !metaArraysValue) {
            let currentMessageString = `${userId}`;
            metaArraysValue.push(currentMessageString);
            channel.addMessageMetaArrayValues(
              message,
              { confetti: metaArraysValue },
              function (message, error) {
                if (error) {
                  console.log("error: addMessageMetaArrayValues");
                }
                triggerConfetti(setShowConfetti, setRecycleOption);
              }
            );
          } 
        }
      );
    }
  };

  channelHandler.onMessageUpdated = (channel, message) => {
    console.log("onMessageUpdated:", message)
  }
  sdk.addChannelHandler("abc12334", channelHandler);

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
              sdk={sdk}
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

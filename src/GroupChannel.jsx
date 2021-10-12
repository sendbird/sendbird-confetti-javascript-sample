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
import { useCookies } from "react-cookie";

function GroupChannel({ sdk, userId }) {
  const [currentChannel, setCurrentChannel] = useState(null);
  const currentChannelUrl = currentChannel ? currentChannel.url : "";
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recycleOption, setRecycleOption] = useState(false);
  var channelChatDiv = document.getElementsByClassName("channel-chat")[0];
  const [cookies, setCookie, removeCookie] = useCookies(["confettiSeen"]);

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
    let currentMessageId = `${message.messageId}`;
    var startDate = message.createdAt;
    var endDate = new Date().getTime() / 1000;
    var difference = endDate - startDate;
    var secondsInDay = 86400;

    if (message.data === "confetti") {
      if (cookies.confettiSeen) {
        let arrayConfettiSeen = cookies.confettiSeen.split(",");
        const includesId = (id) => id.includes(currentMessageId);
        if (
          !arrayConfettiSeen.some(includesId) &&
          currentMessageId !== 0 &&
          difference < secondsInDay
        ) {
          triggerConfetti();
          let currentMessageString = `${currentMessageId}=${startDate}`;
          arrayConfettiSeen.push(currentMessageString);
          let newValue = arrayConfettiSeen.join(",");
          setCookie("confettiSeen", newValue);
        }
      } else if (currentMessageId !== 0 && difference < secondsInDay) {
        let value = `${message.messageId}=${startDate}`;
        setCookie("confettiSeen", value);
        triggerConfetti();
      }
    }
  };

  const handleSendUserMessage = (text) => {
    const userMessageParams = new sdk.UserMessageParams();
    let lowerCaseText = text.toLowerCase();
    if (
      lowerCaseText.includes("congrats") ||
      lowerCaseText.includes("congratulations")
    ) {
      userMessageParams.data = "confetti";
      triggerConfetti(setShowConfetti, setRecycleOption);
    }
    userMessageParams.message = text;
    return userMessageParams;
  };

  // removeCookie('confettiSeen');

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
          renderChatItem={({ message, onDeleteMessage, onUpdateMessage }) => (
            <CustomizedMessageItem
              message={message}
              onDeleteMessage={onDeleteMessage}
              onUpdateMessage={onUpdateMessage}
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

export const uuid4 = () => {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
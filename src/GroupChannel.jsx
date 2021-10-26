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

  const handleSendUserMessage = (text) => {
    const userMessageParams = new sdk.UserMessageParams();
    let lowerCaseText = text.toLowerCase();
    let createdAt = new Date().getTime();
    if (lowerCaseText.includes("congrat")) {
      userMessageParams.data = "confetti";
      var shownConfettiArray = new sdk.MessageMetaArray("shownConfetti", [
        `${userId}=${createdAt}`,
      ]);
      userMessageParams.metaArrays = [shownConfettiArray];
      triggerConfetti(setShowConfetti, setRecycleOption);
    }
    userMessageParams.message = text;
    return userMessageParams;
  };

  if (currentChannel && sdk && sdk.ChannelHandler) {
    var listQuery = currentChannel.createPreviousMessageListQuery();
    listQuery.limit = 20;
    listQuery.includeMetaArray = true;
    listQuery.load(function (messages, error) {
      if (error) {
        console.log("error in listQuery");
      }
      messages.forEach((message) => {
        if (message.data === "confetti") {
          var startDate = message.createdAt;
          var endDate = new Date().getTime();
          var difference = endDate - startDate;
          var secondsInDay = 86400;
          var metaArraysValue = message.metaArrays[0].value;
          var found = metaArraysValue.find((msgString) =>
            msgString.includes(userId)
          );
          if (!found && difference < secondsInDay) {
            let currentMessageString = `${userId}=${message.createdAt}`;
            metaArraysValue.push(currentMessageString);
            currentChannel.addMessageMetaArrayValues(
              message,
              { shownConfetti: metaArraysValue },
              function (message, error) {
                if (error) {
                  console.log("error: addMessageMetaArrayValues");
                }
                triggerConfetti(setShowConfetti, setRecycleOption);
              }
            );
          }
        }
      });
    });

    var channelHandler = new sdk.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
      if (message.data === "confetti") {
        var metaArraysValue = message.metaArrays[0].value;
        var found = metaArraysValue.find((msgString) =>
          msgString.includes(userId)
        );
        if (!found) {
          let currentMessageString = `${userId}=${message.createdAt}`;
          metaArraysValue.push(currentMessageString);
          currentChannel.addMessageMetaArrayValues(
            message,
            { shownConfetti: metaArraysValue },
            function (message, error) {
              if (error) {
                console.log("error: addMessageMetaArrayValues");
              }
              triggerConfetti(setShowConfetti, setRecycleOption);
            }
          );
        }
      }
    };
    sdk.addChannelHandler("abc12334", channelHandler);
  }

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
    user: store.stores.userStore.user,
  };
});

A feature we all know and love is watching confetti explode on your screen when you send or receive a congratulatory message. While many of you likely encountered the confetti animation in your text messages, we figured why not bring it over to your own application’s chat experience as well? 

Once your base application is up and running with the Sendbird UIKit, we want to show how to further enhance your app with novel features.

### Getting started
To begin, you want to create a new application in your Sendbird dashboard. Within that application, create a user and a Group Channel. On the left sidebar, in the ‘Overview’ tab, you can find the application ID. In the ‘Users’ tab, click on the user you’ve created and you’ll be able to access the user’s information such as the user’s ID, nickname and access token. These are all key variables you will need to include in your application later on in order to make it run. Learn more about these initial steps to send your first message.

Open your application and install the Sendbird-UIKit with ‘npm install sendbird-uikit –save’. Upon installing the UIKit, create a .env file where you will export your application ID, user ID, user’s nickname, and user’s access token provided from the application you created in the dashboard. These variable names must start with “REACT_APP” (e.g. REACT_APP_APP_ID). The application ID, user ID, nickname, and access token will then be imported in your App.js file.

### App function
In our App function, import the Sendbird Provider component from the UIKit. When using this component, it expects an application ID, user ID, user nickname, and user access token, so we can pass in those variables we imported from the .env file. Have the SendBirdProvider component wrap around a custom component we’re creating called ‘GroupChannel’. 

### Group Channel components
GroupChannel will hold and return the Channel List, Channel, and Channel Setting components that are imported from the UIKit. ChannelList will utilize the onChannelSelect function. Channel needs to use channelUrl to set the current channel and the onChatHeaderActionClick function in order to create custom actions when the icon button in the header is clicked on. This function will render and close our channel settings sidebar on a click event. Our last component, ChannelSettings will pass in the channelUrl and use the onClickClose function to hide the settings bar.

After implementing those three components within GroupChannel and with some custom styling, you should have a working application with UIKit.

### Trigger confetti
Now, it’s time for the main attraction: confetti! To implement the confetti, we’re going to utilize the react-confetti package. Once installed, we’ll import it into GroupChannel. We create a variable showConfetti, where if it’s true, it will render the confetti component. 

We create a function triggerConfetti that when called, sets showConfetti to true, sets the variable for the recycle property (that the confetti components needs) to true, and then runs a setTimeout where it will set the recycle property to false after 3000 milliseconds. This will have the confetti component go off, provide the correct props to it and then stop after the specified period of time.

###Sending a message that triggers confetti
Now that we have the functionality to make confetti render to the screen, we can implement it at the particular time we want it to go off. We use the onBeforeSendUserMessge callback function property from the Channel component and pass in our function ‘handleSendUserMessage’. onBeforeSendUserMessge passes the ‘text’ to handleSendUserMessage allowing us to perform additional operations before the message is sent out. 

In this function, we want to check the text and see if it meets our requirements, which in this case is to contain the word ‘congrat’ (case insensitive). If it does contain our keyword, then we set the current message’s userMessageParams data property equal to “confetti” to identify that this message is a confetti trigger. The userMessageParams object is used to customize the message’s properties. By accessing these message parameters, we’re able to perform actions when we’re sending and receiving messages based on their specific properties.

### Setting message params’ meta array on send of message
After changing the data property in our message object, we want to set the message’s meta array to hold a list of all the users that have seen this particular message/confetti and the time that they saw it. 

In order to set the userMessageParams’ meta array, we have to create a variable that’s a new instance of ‘MessageMetaArray’. We then want to pass in a key value pair to this class. The pair we want to initially set for an outgoing message that triggers confetti will have a key of “shownConfetti” and the value set to be an array with the string ‘userId=createdAt’. Once that variable is set, we use userMessageParams.metaArrays and set it equal to an array with our variable we created of the new instance.

Lastly, we’ll call the triggerConfetti function to set off the confetti component. For any message coming in, whether it’s containing the keyword to trigger confetti or not, we will set the userMessageParams’ message property equal to the text passed in and return the params as a whole.

This step handles all the customization before the message is sent and allows the confetti to be seen by the sender’s side as well. Now, we have to control the confetti being seen by the user that’s receiving the message.

### Receiving a message that triggers confetti
While the user is active on the app, we want to utilize a channel handler in order to perform an action in real time. It’s important to note, when you register a channel handler, you need the current channel object, sdk, and sdk channel handler all available and set (after the initial load). 

### Receiving a message that triggers confetti
Generating a channel handler for when a user is actively receiving a message
Once those parameters are successfully in place in GroupChannel, we can create a new instance of a channel handler, where on an event that a message is received, we’ll check if the message’s data is equal to ‘confetti’. For this, we’re going to use the channel event onMessageRecevied, which triggers every time you receive a message. 

If the message’s data prop is equal to ‘confetti’, then we can see if the message’s userMessageParams meta array for ‘shownConfetti’ has a value with the current user’s ID. If it does, then that means this user has already seen this message/confetti and we do nothing. 

If it doesn’t include the current user’s ID in the value, create a variable in the format `userId=createdAt` to push it into the meta array’s value.

### Setting message params’ meta array
To implement the update of the new meta array’s value, take the current channel object and call addMessageMetaArrayValues on it. With that, we’re able to pass in our new meta array’s value as an object and inside the callback function call our ‘triggerConfetti’ function.

This end result has active users seeing confetti when receiving a congratulatory message! However, what happens when a user isn’t currently on the chat?

### Checking messages received when a user was inactive from app
When a user doesn’t have the app open, and returns to it later on, we need to provide an alternative solution to have confetti explode on a missed congratulatory message! To do this, we utilize a message list query to load previous messages from a channel.

### Message List Query
On the initial page load, in GroupChannel within the same check to see if there’s a current channel object, sdk, and sdk channel handler available, we can create a query instance using createPreviousMessageListQuery. The list query instance will render on every page load. 

### List query parameters
We set the list query’s limit to 20, so that we don’t load every single previous message and we have the includeMetaArray property set to true. Then, we use the list query’s load method where we’ll be retrieving the previous messages. Within this function, iterate through each of the message’s the callback function provides us, and check each message as we did before. 

An additional check we want to perform for when a user returns from being inactive is to see if the message received was sent less than 24 hours ago. We include this edge case because we don’t want confetti to randomly go off when a user returns to a channel. There may be an old message earlier in the conversation that is irrelevant to the context of the chat now.

To check this, we grab the time that message was created from the userMessageParams and get the current time, both in seconds. With these two variables, we can subtract them from each other in order to get the difference. Then,  make sure the difference is less than the amount of seconds in a day.

So, if the message’s data is equal to ‘confetti’, the current user’s ID is not found within the meta array’s value and if the message was sent less than 24 hours ago, then we create a variable in the format `userId=createdAt` and push it into the meta array’s value. As previously mentioned for the channel handler’s implementation to update the meta array’s value, we take the current channel object and call addMessageMetaArrayValues on it. Here, we’re able to pass in our new meta array’s value and inside the callback function call, ‘triggerConfetti’.

### Conclusion
Congratulations, *cue the confetti*! You’re now able to see how you can spice up your chat experience and implement features your users know and love using Sendbird UIKit.

[BlogPost](https://sendbird.com/blog/using-confetti-animation-in-sendbird-uikit)

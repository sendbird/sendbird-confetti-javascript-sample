import Confetti from "react-confetti";
import React, { useState, useEffect } from "react";

export default function ConfettiTrigger({ sdk, showConfetti, setShowConfetti}) {
    // this will clearInterval in parent component after counter gets to 5
    // useEffect(() => {
    //   if (counter < 5) return;
  
    //   clearInterval(currentTimer);
    // }, []);
  
    // return null;

    // useEffect(
    //     () => {
    //       let timer1 = setTimeout(() => setShowConfetti(true), 5 * 1000);
    
    //       // this will clear Timeout
    //       // when component unmount like in willComponentUnmount
    //       // and show will not change to true
    //       return () => {
    //         clearTimeout(timer1);
    //       };
    //     },
    //     // useEffect will run only one time with empty []
    //     // if you pass a value to array,
    //     // like this - [data]
    //     // than clearTimeout will run every time
    //     // this value changes (useEffect re-run)
    //     []
    //   );



 
        console.log("sdk", sdk)
        const userMessageParams = new sdk.UserMessageParams();
        console.log("userMessageparams",userMessageParams)
        // if(text.includes("congrats") || text.includes("congratulations")){
//WHICH PARAM IS BETTER TO USE??? params.data or params.customType 
            // userMessageParams.data="confetti"
            // return   <Confetti width={100} height={300} />
            //trigger state change for Confetti component to show -> then initiate timer
        //     setShowConfetti(true);
        //     userMessageParams.message = text;
        //     return userMessageParams;
        // }
    return (
        <div>
            <h1>Hi</h1>
        </div>
    )

}
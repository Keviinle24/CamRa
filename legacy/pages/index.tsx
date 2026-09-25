

import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from 'next';
import { RtmChannel } from "agora-rtm-sdk";
import Filter from "../components/Filter"
import Navbar1 from '../components/Navbar1';
import styles from "/styles/Login.module.css";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axios, { AxiosError } from 'axios';

import {
  ICameraVideoTrack,
  IRemoteVideoTrack,
  IAgoraRTCClient,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import Image from "next/image";
 
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'; // Import EmojiPicker and EmojiClickData
const logo = 'public/FinalLogo4.png'


type TCreateRoomResponse = {
  room: Room;
  rtcToken: string;
  rtmToken: string;
};

type TGetRandomRoomResponse = {
  rtcToken: string;
  rtmToken: string;
  rooms: Room[];
};

type Room = {
  _id: string;
  status: string;
};

type TMessage = {
  userId: string;
  message: string | undefined;
};

function createRoom(userId: string): Promise<TCreateRoomResponse> {
  return fetch(`/api/rooms?userId=${userId}`, {
    method: "POST",
  }).then((response) => response.json());
}

function deleteRoom(roomId: string, userId: string) {
  return axios.delete(`/api/rooms/${roomId}?userId=${userId}`).then((response) =>
      response
  );
}

function getRandomRoom(userId: string): Promise<TGetRandomRoomResponse> {
  return fetch(`/api/rooms?userId=${userId}`).then((response) =>
    response.json()
  );
}

function getRoom(roomId: string, userId:string){
  return axios.get(`/api/rooms/${roomId}?userId=${userId}`).then((response) =>
      response.data.room
  );

}

function setRoomToWaiting(roomId: string, userId: string ) {
  return fetch(`/api/rooms/${roomId}?userId=${userId}`, { method: "PUT" }).then((response) =>
    response.json()
  );
}

export const VideoPlayer = ({
  videoTrack,
  style,
}: {
  videoTrack: IRemoteVideoTrack | ICameraVideoTrack;
  style: object;
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const playerRef = ref.current;
    if (!videoTrack) return;
    if (!playerRef) return;

    videoTrack.play(playerRef);

    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  return <div ref={ref} style={style}></div>;
};

async function connectToAgoraRtc(
  roomId: string,
  userId: string,
  onVideoConnect: any,
  onWebcamStart: any,
  onAudioConnect: any,
  token: string
) {
  const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  await client.join(
    process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    roomId,
    token,
    userId
  );

  client.on("user-published", (themUser, mediaType) => {
    client.subscribe(themUser, mediaType).then(() => {
      if (mediaType === "video") {
        onVideoConnect(themUser.videoTrack);
      }
      if (mediaType === "audio") {
        onAudioConnect(themUser.audioTrack);
        themUser.audioTrack?.play();
      }
    });
  });

  const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  onWebcamStart(tracks[1]);
  await client.publish(tracks);

  return { tracks, client };
}

// async function connectToAgoraRtm(
//   roomId: string,
//   userId: string,
//   onMessage: (message: TMessage) => void,
//   token: string
// ) {
//   const { default: AgoraRTM } = await import("agora-rtm-sdk");
//   const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_APP_ID!);
//   await client.login({
//     uid: userId,
//     token,
//   });
//   const channel = await client.createChannel(roomId);
//   await channel.join();
//   channel.on("ChannelMessage", (message, userId) => {
//     onMessage({
//       userId,
//       message: message.text,
//     });
//   });

//   return {
//     channel,
//   };
// }
async function connectToAgoraRtm(
  roomId: string,
  userId: string,
  onMessage: (message: TMessage) => void,
  token: string,
  onUserCountUpdate: (count: number) => void
) {
  const { default: AgoraRTM } = await import("agora-rtm-sdk");
  const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_APP_ID!);
  await client.login({
    uid: userId,
    token,
  });

  const channel = await client.createChannel(roomId);
  await channel.join();

  channel.on("ChannelMessage", (message, userId) => {
    onMessage({
      userId,
      message: message.text,
    });
  });

  // Track the number of users in the channel
  channel.on("MemberJoined", () => {
    channel.getMembers().then((members) => {
      onUserCountUpdate(members.length);
    });
  });

  channel.on("MemberLeft", () => {
    channel.getMembers().then((members) => {
      onUserCountUpdate(members.length);
    });
  });


  const members = await channel.getMembers();
  onUserCountUpdate(members.length);

  return {
    channel,
  };
}

export default function Home() {
  //USER ID IS CALL IDENTIFIER AND IS RANDOM
  const [userId] = useState(parseInt(`${Math.random() * 1e9}`) + "");
  const [room, setRoom] = useState<Room | undefined>();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [input, setInput] = useState("");
  const [themVideo, setThemVideo] = useState<IRemoteVideoTrack>();
  const [myVideo, setMyVideo] = useState<ICameraVideoTrack>();
  const [themAudio, setThemAudio] = useState<IRemoteAudioTrack>();
  const channelRef = useRef<RtmChannel>();
  const rtcClientRef = useRef<IAgoraRTCClient>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState<number>(0);



  const handleStopClick = async () => {
    leaveRoomHelper();
  };





  function handleNextClick() {
    try {
      connectToARoom();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error;
    
          if (axiosError.response) {
            if (axiosError.response.status === 429) {
              router.push('/429');
            } else if (axiosError.response.status === 500) {
              router.push('/500');
            } else {
   
              router.push('/500');
            }
          } 
        }
      }
  }

  function handleStartChattingClicked() {
    try {
    connectToARoom();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
 
            router.push('/500');
          }
        } 
      }
    }
  }

  async function handleSubmitMessage(e: React.FormEvent) {
    //Message Check
    e.preventDefault();

    if (input.trim() === "") {
      return;  
    }
  
    await channelRef.current?.sendMessage({
      text: input,
    });
    setMessages((cur) => [
      ...cur,
      {
        userId,
        message: input,
      },
    ]);
    setInput("");
  }

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  

async function leaveRoomHelper() {

 try {
     
      if (channelRef.current) {
        await channelRef.current.leave();
        channelRef.current = undefined;
      }
 
      if (rtcClientRef.current) {
        const rtcClient = rtcClientRef.current;

        if (rtcClient.localTracks.length > 0) {
          rtcClient.localTracks.forEach((track) => track.stop());
          rtcClient.localTracks.forEach((track) => track.close());
        }

        await rtcClient.leave();
        rtcClientRef.current = undefined;
      }
      try {
        if (room){
          const updatedRoom = await getRoom(room._id, userId)
          if (updatedRoom.status==="waiting") {
            await deleteRoom(room._id, userId)
          } else{
            await setRoomToWaiting(room._id, userId);
          }
        }
      } catch (error) {
        console.error('Error leaving the channel:', error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          if (axiosError.response) {
            if (axiosError.response.status === 429) {
              router.push('/429');
            } else if (axiosError.response.status === 500) {
              router.push('/500');
            } else {

              router.push('/500');
            }
          }
        }
      } finally {
        setIsLeaving(false);
      }

    
      setThemAudio(undefined);
      setThemVideo(undefined);
      setMyVideo(undefined);
      setRoom(undefined);
      setMessages([]);
    } catch (error) {
      console.error("Error while stopping the call:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
            router.push('/500');
          }
        }
      }
    }
 
}

 useEffect(() => {
  const handleBeforeUnload = async (event: BeforeUnloadEvent) => {

    event.preventDefault();
    leaveRoomHelper();
 
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);



  async function connectToARoom() {
    setThemAudio(undefined);
    setThemVideo(undefined);
    setMyVideo(undefined);
    setMessages([]);

    if (isLeaving) return; 
    setIsLeaving(true);
    
    try {
      if (channelRef.current) {
        await channelRef.current.leave();
      }
    } catch (error) {
      console.error('Error leaving the channel:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
 
            router.push('/500');
          }
        } 
      }
    } finally {
      setIsLeaving(false);
    }

    if (rtcClientRef.current) {
      await rtcClientRef.current.leave();
    }
    if (isLeaving) return; 
    setIsLeaving(true);
    try {
    if (room){
      const updatedRoom = await getRoom(room._id, userId)
      if (updatedRoom.status==="waiting") {
        await deleteRoom(room._id, userId)
      } else{
        await setRoomToWaiting(room._id, userId);
      }
    }
  } catch (error) {
      console.error('Error leaving the channel:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 429) {
            router.push('/429');
          } else if (axiosError.response.status === 500) {
            router.push('/500');
          } else {
 
            router.push('/500');
          }
        } 
      }
    } finally {
      setIsLeaving(false);
    }


    const { rooms, rtcToken, rtmToken } = await getRandomRoom(userId);
    if (isLeaving) return; 
    setIsLeaving(true);
    try {
    if (rooms.length > 0) {
      setRoom(rooms[0]);
      const { channel } = await connectToAgoraRtm(
        rooms[0]._id,
        userId,
        (message: TMessage) => setMessages((cur) => [...cur, message]),
        rtmToken,
        (count: number) => setUserCount(count) 
      );
      channelRef.current = channel;

      const { tracks, client } = await connectToAgoraRtc(
        rooms[0]._id,
        userId,
        (themVideo: IRemoteVideoTrack) => setThemVideo(themVideo),
        (myVideo: ICameraVideoTrack) => setMyVideo(myVideo),
        (themAudio: IRemoteAudioTrack) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
    } else {

      const { room, rtcToken, rtmToken } = await createRoom(userId);
      setRoom(room);
      const { channel } = await connectToAgoraRtm(
        room._id,
        userId,
        (message: TMessage) => setMessages((cur) => [...cur, message]),
        rtmToken,
        (count: number) => setUserCount(count) 
      );
      channelRef.current = channel;

      const { tracks, client } = await connectToAgoraRtc(
        room._id,
        userId,
        (themVideo: IRemoteVideoTrack) => setThemVideo(themVideo),
        (myVideo: ICameraVideoTrack) => setMyVideo(myVideo),
        (themAudio: IRemoteAudioTrack) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
    }
  } catch (error) {
    console.error('Error leaving the channel:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        if (axiosError.response.status === 429) {
          router.push('/429');
        } else if (axiosError.response.status === 500) {
          router.push('/500');
        } else {

          router.push('/500');
        }
      } 
    }
  } finally {
    setIsLeaving(false);
  }
  }

  function convertToYouThem(message: TMessage) {
    return message.userId === userId ? "You" :  <span style={{ color: '#FF6F6F' }}>Colleague</span>;
  }
 const toggleOpen = () => setIsOpen(!isOpen);
  const isChatting = room!!;

  return (
    <>
        <Navbar1 toggleOpen={toggleOpen}  handleStop={handleStopClick}/>
        <Head>
          <title>CamRa</title>
          <meta name="description" content="Your Video Stream App" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/public/FinalLogo10.png"/>
      
      
        </Head>

      <main className=" bg-gray-100 flex min-h-screen flex-col items-center justify-between" style={{ background: 'var(--color-gray-100)', backgroundSize: 'cover' }}>
        {isChatting ? (
          <>
            <div className=" w-full h-screen bg-center bg-cover relative"   >
              <header className="w-1/5 ">
              <div>


       <style jsx>{`
       
         
            
  


`}</style>
    </div>
              </header>
              <div className=" flex items-center">
              </div>
              <div className="flex justify-center items-center ">
             
              <div className=" flex" style={{ bottom: 0 }}>
  <div
    className="video-container parent-container flex flex-row bg-black"
    style={{
      width: 'calc(36.35% - 20px)',
      height: 'calc(49.3% - 50px)',
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: 0,
    }}
  >

                
                    {myVideo && (
                      
                      <VideoPlayer
                        style={{ width: "100%", height: "auto", objectFit: " cover", position: 'relative', bottom: '0px', left: '0px', zIndex: 10 }}
                        videoTrack={myVideo}
                      />
                    )}
        <img
        src={logo}
        alt="Logo"
        className="absolute z-10"
        style={{ width: '15%', bottom: 0, right: -5
       
        }}
      />
                  </div>
                  <div className=" video-container bg-black " style={{ width: 'calc(36.35% - 20px)', height: 'calc(49.3% - 50px)', position: 'absolute' , top: '89px', left: '10px', zIndex: 0, }}> 
                    {themVideo && (
                      <VideoPlayer
                        style={{ width: "100%", height: "100%", objectFit: "cover", position: 'absolute', top: '0px', left: '0px', zIndex: 10 }}
                        videoTrack={themVideo}
                      />
                    )}
                     <img
        src={logo}
        alt="Logo"
        className="absolute z-10"
        style={{width: '15%', bottom: 0, right: -5
    
        }}
      />
                  </div>

                </div>
              
                <div className="chat-panel overflow-auto  border-black" style={{ height: 'calc(99.9% - 100px)', position: 'absolute', bottom: '11.15px', right: '10px', width: "62.9%"  }}>
                <style jsx>{`


    @media (max-width: 960px) {
      .chat-panel {
        max-width: 50%;
      }
      .chat-input {
       min-width: calc(49.6% - 143.8px);
       margin-left: -48px
      
       
      }
                }
   
  //     @media (max-width: 500px) {
  // .chat-panel {
  //   max-height: 75.75%;
  //   margin-bottom: 80px;
  // }
  //   .backgroundPage {
  //    margin-bottom: -80px;
  //   }
//           .chat-input {
//  display: fixed;
//        margin-bottom: 76px;
       
//       }
//                  .leave-button  {
 
//        margin-bottom: 100px;
       
//       }
//                         .next-button  {
 
//        margin-bottom: 100px;
       
//       }
//                 }
  `}</style>
              <div className="messages-container" >
                <ul>
                    {messages.map((message, idx) => (
                      <li key={idx} className="mb-3  text-blue-400" style={{ lineHeight: 1, fontWeight: 600, fontFamily: 'Josefin Sans', fontSize: 15 }}>
                        {convertToYouThem(message)}<span style={{ color: 'black' }}>:</span><span className=" text-black rounded-2xl p-2 ">{message.message}</span>
                      </li>
                    ))}
                
                  </ul>
                  <div ref={messagesEndRef} />
                  <div className="chat-container" style={{   marginLeft: '40px' }}>
<form onSubmit={handleSubmitMessage}>
  <input
    value={input}
    
    onChange={(e) => setInput(e.target.value)}
    className="chat-input bg-white text-black border-black rounded-lg p-1.5 text-left align-top"
    style={{
      position: 'fixed',
      bottom: '24.3px',
      width: 'calc(62.7% - 330px)',

      borderColor: 'black',
      borderWidth: '2px',
      borderStyle: 'solid',
    
      
       
    }}
    placeholder="Type a message..."
    
    ></input>  <button className=""></button></form>  </div>
  {isChatting && (
   <button
          className="leave-button px-6 py-2.5   text-center text-white bg-black border border-black rounded-lg active:text-indigo-500 hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring m-6"
          style={{fontFamily: 'Josefin Sans', position: 'fixed', bottom: 0,right: '131px', marginLeft:'10px',width: '120px' }}
      
          onClick={handleStopClick} >    
         Stop
         </button>
        )}          
              {isChatting && (
        <button
          className="next-button px-6 py-2.5  text-center text-white bg-black border border-black rounded-lg active:text-indigo-500 hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring m-6"
          style={{fontFamily: 'Josefin Sans', position: 'fixed', bottom: 0,  right: '2px', marginLeft: '141px', width: '120px'}}
          onClick={handleNextClick}
        >
         Next
        </button>
        
      )}

{userCount === 1 && (
          <p   style={{fontFamily: 'Josefin Sans'}}>Click "Next" to find new people.</p>
        )}
      <form onSubmit={handleSubmitMessage}>
<button
                      className="leave-button fixed text-white p-2 rounded-lg w-10" style={{position: 'fixed', bottom: 24.3, right: 284}}
                      type="submit"
                    >
                   <img src="public/send.png" alt="Send" className="w-6 h-6" style={{  display: 'fixed' }}/>
                    </button>
  </form>
</div>
                    <button
                    className=" emoji absolute " style={{position: 'fixed', fontSize: '1.9rem', bottom: 22, marginRight: '880px', marginLeft: '-13px' }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    {showEmojiPicker ? '😀' : '😀'}
                  </button>
                  {showEmojiPicker && (
                    <div className="   " style={{position: 'fixed', bottom: 75}}>
                      <EmojiPicker onEmojiClick={(emojiObject: EmojiClickData) => {
                        setInput(input + emojiObject.emoji);
                        setShowEmojiPicker(false);
                      }} />
                    </div>
                  )}

</div>

              </div>
            </div>
          </>
        ) : (
          // Connect page
          <>

<div className=" relative h-screen text-white overflow-hidden w-full" style={{  background: 'var(--color-gray-100)', backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
  <div className="start-chatting relative z-10   flex-col justify-center items-center text-center" style={{ marginTop: '650px' }}>
    <Filter />
   
    <button className="button px-6 py-3 min-w-[120px] text-center text-white bg-black border border-black rounded-full active:text-indigo-500 hover:bg-indigo-700 hover:text-indigo-600 focus:outline-none focus:ring" onClick={handleStartChattingClicked} style={{fontWeight: 700, fontFamily: 'Josefin Sans', marginTop: '20px' }}>  Start Chatting</button> 
  </div>
</div>
<style jsx>{`
   

   .button {
    background: linear-gradient(90deg, #00fff0, #ff00f5 );

   }


`}</style>
          </>
        )}
      </main>

    </>
  );
}


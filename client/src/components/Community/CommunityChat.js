import { useRef, useState } from 'react';
import '../../assets/CSS/CommunityChat.css'
import Arrow from '../../assets/images/arrows.png';
export const CommunityChat = () => {
    const Username= 'Sidhant';
    const messRef= useRef(null);
    const chats=[
        {
            MessageID:1,
            SenderID : 1,
            SenderName : "Sidhant",
            Message : "It's very heartbreaking to watch!",
            Date : "2024-07-18  8:24:49 PM"
        },
        // More dummy data to add
    ];
    const [chatbox, setChatbox]= useState(chats);
    
  return (
    <>
    <h1>Chat</h1>
    <div className="chatbox-container">
        <h2 className='chat-header'>CommunityName</h2>
        <div className="chat-header-underline"></div>
        
        <div className="chatbox">
        {
            chatbox.map((message)=>(
                <div key={message.MessageID} className='message-container'><img src={Arrow} className="chat-person" alt="arrow" />
                <div className={`message mine`}>
                <p style={{
                    margin: '5px', fontSize:'small',fontFamily:'Times New Roman',fontWeight:'bold',marginLeft:'2px'
                }} >{message.SenderName===Username?'Me' : message.SenderName}</p>
                {message.Message}
                <span className='time' >{message.Date}</span></div>
                </div>
            ))
        }
            
            <form name='messForm' className='input-area' onSubmit={(e)=>{
                e.preventDefault();
                console.log('hah');
            }}>
            <input type="text" className="input-text"  ref={messRef}  />
            <button className="sendMessage" onClick={()=>{
                if (messRef.current.value){
                    var datetime = new Date().toISOString()+" " + (new Date().toLocaleTimeString());
                    var datearray= datetime.split('T')[0];
                    var date =   datetime.split('T')[0];
                    var time = datetime.split('Z')[1]
                    console.log(date+time);
                    const mess=
                    {
                        MessageID:chatbox.length+1,
                        SenderID : 1,
                        SenderName : "Siddhant",
                        Message : messRef.current.value,
                        Date : date+" "+time
                        
                    }
                    setChatbox([...chatbox,mess])
                    messRef.current.value="";
                    messRef.current.focus();
                    console.log(mess);
                }

            }}
            >Send</button>
            </form>
        </div>


    </div>
    </>

  )
}

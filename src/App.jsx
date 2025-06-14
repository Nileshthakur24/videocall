import React, { useState, useRef, useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import './video.css';

function App() {
  const [roomID, setRoomID] = useState('');
  const [showVideoPage, setShowVideoPage] = useState(false);
  const meetingRef = useRef(null);

  // ✅ Automatically join room if roomID is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromURL = params.get("roomID");
    if (roomFromURL) {
      setRoomID(roomFromURL);
      setShowVideoPage(true);
    }
  }, []);

  // ✅ Join room when video page is shown
  useEffect(() => {
    if (showVideoPage && meetingRef.current && roomID) {
      const appID = 890769787;
      const serverSecret = "75eb414be48e8d2788142b3ebfe4c679";
      const userID = Date.now().toString();
      const userName = "User-" + Math.floor(Math.random() * 1000);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetingRef.current,
        sharedLinks: [
          {
            name: 'Copy link',
            url:
              window.location.protocol +
              '//' +
              window.location.host +
              window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    }
  }, [showVideoPage, roomID]);

  const handleJoin = () => {
    if (roomID.trim() !== '') {
      setShowVideoPage(true);
    } else {
      alert('Room ID dal bhai!');
    }
  };

  return (
    <div className="app">
      {!showVideoPage ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Enter Room ID to Join</h2>
          <input
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            type="text"
            placeholder="Enter Your Room ID"
            style={{ padding: '10px', marginRight: '10px' }}
          />
          <button onClick={handleJoin} style={{ padding: '10px 20px' }}>
            Join Now
          </button>
        </div>
      ) : (
        <div ref={meetingRef} className="videopage"></div>
      )}
    </div>
  );
}

export default App;


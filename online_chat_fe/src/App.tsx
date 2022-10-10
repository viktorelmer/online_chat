import React from 'react';
import ChannelList from './components/ChannelList';
import useAuthHook from './hooks/authHook';
import ChannelArea from './components/ChannelArea';

function App() {
    const { authenticate, isAuth, UUID, userData } = useAuthHook()
  

  React.useEffect(() => {
    authenticate();
  }, []);

  if (!isAuth || !UUID || !userData) {
    return (
      <div className="relative">
        loading
      </div>
    );
  }

  return (
    <div className="relative z-10 flex w-full">
      {/* CHAT LIST */}
      <ChannelList/>
      {/* CHANNEL AREA */}
      <ChannelArea userData={userData}/>
    </div>
  );
}

export default App;

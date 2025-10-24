import HomeOn from '@assets/Frame 2113.svg';
import TalkOff from '@assets/Frame 2113-1.svg';
import CallOff from '@assets/Frame 2113-2.svg';
import TalkOn from '@assets/talkon.svg';
import HomeOff from '@assets/homeoff.svg';
import { Link } from 'react-router-dom';

export const BottomNavHome = () => {
  return (
    <div className="absolute bottom-0 bg-white w-[375px] h-[56px] shadow-2size">
      <div className="flex justify-between items-center">
        <Link to="/">
          <img src={HomeOn} />
        </Link>
        <Link to="/chat">
          <img src={TalkOff} />
        </Link>
        <img src={CallOff} />
      </div>
    </div>
  );
};

export const BottomNavChat = () => {
  return (
    <div className="absolute bottom-0 bg-white w-[375px] h-[56px] shadow-2size ">
      <div className="flex justify-between items-center">
        <Link to="/">
          <img src={HomeOff} />
        </Link>
        <Link to="/chat">
          <img src={TalkOn} />
        </Link>
        <img src={CallOff} />
      </div>
    </div>
  );
};

import type { User } from '@assets/type';
import { BottomNavHome } from '@components/nav/bottomNav';
import { HomeTopNav } from '@components/nav/homeTopNav';
import ChannelImg from '@assets/officialA.svg';
import RecoFriend from '@assets/recommend.svg';
import { ProfileModal } from '@components/modal/profileModal';
import { useState } from 'react';

const home = ({ me, friendsList }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="relative bg-white w-[375px] h-[728px]">
      <HomeTopNav />
      <div
        className="mt-[15px] hover:bg-gray-50 transition flex justify-between items-center w-[375px] h-[76px] cursor-pointer"
        onClick={() => setSelectedUser(me)}
      >
        <div className="ml-[16px] w-[266px] h-[44px]">
          <p className="heading-medium-sb">{me.name}</p>
          <p className="body-small-rg text-gr-700">{me.bio}</p>
        </div>
        <img
          src={me.profileImageUrl}
          className=" mr-[16px] w-[60px] h-[60px] rounded-[20px]"
        />
      </div>
      <div className="flex flex-col items-center overflow-y-scroll no-scrollbar h-[550px]">
        <div className="w-[326px] ml-[-15px] mb-[16px] mt-[16px]">
          <p className="heading-small-md text-gr-700">그룹</p>
        </div>
        <div className="w-[326px] ml-[-15px] mb-[16px] mt-[16px]">
          <p className="heading-small-md text-gr-700">채널</p>
          <img src={ChannelImg} className="cursor-pointer" />
        </div>
        <div className="w-[326px] ml-[-15px] mb-[16px] mt-[16px]">
          <p className="heading-small-md text-gr-700">추천 친구</p>
          <img src={RecoFriend} className="cursor-pointer" />
        </div>
        <div className="mb-[15px] mt-[15px] w-[326px] ml-[-15px]">
          <p className="heading-small-md text-gr-700">
            친구 {friendsList.length}
          </p>
        </div>
        {friendsList.map((friend: User) => (
          <div
            className="flex hover:bg-gr-50 transition items-center justify-between w-[375px] last:mb-[30px] pl-[16px] pr-[16px]"
            key={friend.id}
            onClick={() => setSelectedUser(friend)}
          >
            <div className="flex w-[126px] items-center mb-[8px] mt-[8px] cursor-pointer">
              <img
                className="w-[36px] h-[36px] rounded-[12px]"
                src={friend.profileImageUrl}
              />
              <p className="ml-[15px] body-large-md">{friend.name}</p>
            </div>
            <p className="body-small-rg text-gr-800">{friend.bio}</p>
          </div>
        ))}
      </div>
      {selectedUser && (
        <ProfileModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <BottomNavHome />
    </div>
  );
};

export default home;

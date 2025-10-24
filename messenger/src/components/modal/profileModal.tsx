import Modal from 'react-modal';
import type { User } from '@assets/type';
import buttonX from '@assets/button_top_navigation_bar.svg';
import topButtons from '@assets/Frame 2147225517.svg';
import profileBottom from '@assets/profileBottom.svg';

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

Modal.setAppElement('#root');

export const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      className="fixed top-0 left-0 w-[375px] h-[728px] bg-[#B6BCC8] outline-none"
      overlayClassName="fixed inset-0 bg-transparent"
    >
      <div className="">
        <button className="absolute top-3 left-3" onClick={onClose}>
          <img src={buttonX} alt="Close" />
        </button>
        <img src={topButtons} className="absolute top-3 right-3" />
      </div>
      <img
        src={user.profileImageUrl}
        className="absolute top-3/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute top-8/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="heading-xlarge-sb text-white text-center">{user.name}</p>
        <p className="body-small-rg text-gray-100 text-center">{user.bio}</p>
      </div>
      <img
        src={profileBottom}
        className="absolute bottom-0 border-t-[0.5px] border-white"
      />
    </Modal>
  );
};

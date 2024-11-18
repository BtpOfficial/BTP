import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import IMG from "../../assets/profile.jpg";
import DropdownComponent from './Dropdown';

const Profile = () => {
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);
  const data1 = useSelector((state) => state.id);
  const [adata,setAdata]=useState(null)
  console.log(data1);

  const isProfile = () => {
    if (!data) {
      console.log(data);
      navigate('/');
    }
  };
  
  useEffect(() => {
    isProfile();
  }, []);

  const profileData = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    qualification: data?.qualification,
    gender: data?.gender,
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state) => state.user?._id);
  const getassessment = async() =>{
    try {
      const res = await fetch(`http://localhost:3001/users/assessMe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
      });
      const fetchedData = await res.json();
      if (res.status === 201) {
          window.scrollTo({
              top: 0,
              behavior: "smooth"
          });
          message.success(fetchedData.message);
          console.log(fetchedData);
          setAdata(fetchedData.data);
      } else {
          message.error('Some error occurred');
      }
  } catch (error) {
      console.log(error);
      message.error('Some error occurred');
  }
  }
  const showModal = async() => {
     await getassessment();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (<>
      <button onClick={showModal} style={{
        width:'100px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '50px',
        marginBottom: '20px',
        display: 'block',
        backgroundColor: 'Black',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '10px',
        height: '40px',
      }}>Assess Me</button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
    <button
      key="custom-cancel"
      onClick={handleCancel}
      style={{ backgroundColor: 'red', color: 'white', borderRadius: '5px',marginRight: '20px',padding: '5px 10px' }}
    >
      Cancel
    </button>,
    <button
      key="custom-ok"
      onClick={handleOk}
      style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px',padding: '5px 10px'   }}
    >
      OK
    </button>,
  ]}>
        <p>Here is generated response...</p>
        <p>{adata}</p>
      </Modal>
    <div className="max-w-screen mx-auto my-8 flex gap-[5%]">
      {/* Left Box: Profile Details (60% width) */}
      <div className="bg-white rounded-xl shadow-2xl p-8 w-[50%] ml-9">
        <img src={IMG} alt="Profile" className="rounded-full w-40 h-40 mx-auto mb-6 " />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
          <p className="text-gray-600">{profileData.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Name</h2>
            <p className="text-gray-700">{profileData.firstName} {profileData.lastName}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="text-gray-700">{profileData.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Qualification</h2>
            <p className="text-gray-700">{profileData.qualification}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Gender</h2>
            <p className="text-gray-700">{profileData.gender}</p>
          </div>
        </div>
      </div>

      {/* Right Box: Check Progress Here (30% width) */}
       
      <div className="bg-white rounded-xl shadow-2xl p-8 w-[40%] mr-9">
        <h2 className="text-xl font-bold mb-4 text-center">Check Progress Here</h2>
        <div className="text-gray-700 text-center">
          <DropdownComponent />
        </div>
      </div>

    </div>
    </>
  );
};

export default Profile;

import React, { useEffect } from 'react';
import IMG from "../../assets/profile.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DropdownComponent from './Dropdown';

const Profile = () => {
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);
  const data1 = useSelector((state) => state.id);
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

  return (
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
  );
};

export default Profile;

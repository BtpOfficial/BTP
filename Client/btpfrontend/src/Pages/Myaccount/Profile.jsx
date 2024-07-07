import React from 'react';
import { useEffect } from 'react';
import IMG from "../../assets/profile.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
const Profile = () => {
  const navigate = useNavigate();
  const data = useSelector((state) => state.user);
  const data1 = useSelector((state) => state.id)
  console.log(data1);
  const isprofile = () => {
    if (!data) {
      console.log(data)
      navigate('/');
    }
  }
  useEffect(() => {
    isprofile();
  }, []);


  const profileData = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    qualification: data?.qualification,
    gender: data?.gender,
  };

  return (
    <div className="max-w-screen-md mx-auto my-8 bg-white rounded-xl shadow-2xl p-8 flex">
      <div className="flex-grow mr-4">
        <img src={IMG} alt="Profile" className="rounded-full w-40 h-40" />
        <div className="flex-grow">
          <div className="mb-6 ml-8">
            <h1 className="text-3xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mr-12 mt-12">
          <h2 className="text-lg font-semibold mb-2">Name</h2>
          <p className="text-gray-700">{profileData.firstName} {profileData.lastName}</p>
        </div>
        <div className="mr-12 mt-12">
          <h2 className="text-lg font-semibold mb-2">Email</h2>
          <p className="text-gray-700">{profileData.email}</p>
        </div>
        <div className="mr-12">
          <h2 className="text-lg font-semibold mb-2">Qualification</h2>
          <p className="text-gray-700">{profileData.qualification}</p>
        </div>
        <div className="mr-12">
          <h2 className="text-lg font-semibold mb-2">Gender</h2>
          <p className="text-gray-700">{profileData.gender}</p>
        </div>

      </div>
    </div>

  );
};

export default Profile;
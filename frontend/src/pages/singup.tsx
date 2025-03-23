import React, { useState } from 'react';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });
  const [panCardPhoto, setPanCardPhoto] = useState(null);
  const [kycPhoto, setKycPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate form
    if (!formData.email || !formData.password || !formData.phone || !panCardPhoto || !kycPhoto) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      submitData.append('kyc', 'true'); // Setting kyc to true since documents are being uploaded
      submitData.append('panCardPhoto', panCardPhoto);
      submitData.append('kycPhoto', kycPhoto);

      // Make POST request
      const response = await fetch('http://localhost:4200/auth/signup', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during sign up');
      }

      setSuccess('Account created successfully! You can now login.');
      // Reset form
      setFormData({ email: '', password: '', phone: '' });
      setPanCardPhoto(null);
      setKycPhoto(null);
      
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 8 characters"
              minLength="8"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your phone number"
              required
            />
          </div>
          
          <div>
            <label htmlFor="panCardPhoto" className="block text-sm font-medium text-gray-700 mb-1">
              PAN Card Photo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-1 text-sm text-gray-500 text-center">
                    {panCardPhoto ? panCardPhoto.name : 'Upload PAN Card'}
                  </p>
                </div>
                <input 
                  id="panCardPhoto" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPanCardPhoto)} 
                  required
                />
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="kycPhoto" className="block text-sm font-medium text-gray-700 mb-1">
              KYC Photo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-1 text-sm text-gray-500 text-center">
                    {kycPhoto ? kycPhoto.name : 'Upload KYC Document'}
                  </p>
                </div>
                <input 
                  id="kycPhoto" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setKycPhoto)} 
                  required
                />
              </label>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account? <a href="#" className="text-blue-600 hover:underline">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
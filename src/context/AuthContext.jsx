import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage, session, etc.)
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('afprotrack_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('afprotrack_user');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (serviceId, password) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (serviceId && password) {
        const userData = {
          id: '1',
          serviceId: serviceId,
          name: 'Lt. Surname, FN',
          role: 'admin',
          email: `${serviceId}@afp.mil.ph`
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('afprotrack_user', JSON.stringify(userData));
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('afprotrack_user');
  };

  const requestPasswordReset = async (email) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock password reset request - in real app, this would send an OTP email
      if (email && email.includes('@')) {
        // Generate a mock OTP (in real app, this would be sent via email)
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Mock OTP for testing:', mockOTP); // For testing purposes
        
        return { 
          success: true, 
          message: 'OTP sent successfully',
          otp: mockOTP // In real app, this wouldn't be returned to client
        };
      } else {
        throw new Error('Valid email address is required');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OTP verification - in real app, this would verify against stored OTP
      if (email && otp && otp.length === 6) {
        // Generate a mock token for password reset
        const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        return { 
          success: true, 
          message: 'OTP verified successfully',
          token: mockToken
        };
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock password reset - in real app, this would update the password in the database
      if (token && newPassword) {
        return { success: true, message: 'Password reset successfully' };
      } else {
        throw new Error('Invalid token or password');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requestPasswordReset,
    verifyOTP,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
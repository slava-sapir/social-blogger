import { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/app-context';

function HeaderLoggedOut() {
    const { login, addFlashMessage } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');   
    
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, password });

      if (response.data?.token) {
        login({
          token: response.data.token,
          username: response.data.username,
          avatar: response.data.avatar
        });
        addFlashMessage("You have successfully logged in.", 'success');
      } 
        else {
            addFlashMessage("Invalid username or password.", 'danger');
        }
    } catch (e) {
      addFlashMessage("Login failed. Please try again.", 'danger');
      console.error("Login error:", e.response?.data || e.message);
    }
  };
 

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
        <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
            <input onChange={(e) => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
            <button className="btn btn-success btn-sm">Sign In</button>
        </div>
        </div>
    </form>
  )
}

export default HeaderLoggedOut
        

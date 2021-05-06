import './App.css';
import { useContext } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { AuthContext } from './context/AuthContext';

function App() {

  const { user, loading } = useContext(AuthContext);

  return (
    !loading
      ? <div className="App">
        {!user ? <Login /> : <Home />}
      </div>
      : null
  );
}

export default App;

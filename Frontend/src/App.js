import './App.css';
import Main from './components/Main';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

function App() {
  // optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}
  return (
    <div>
       <AlertProvider template={AlertTemplate} {...options}>
      <Main />
      </AlertProvider>
    </div>
  );
}

export default App;

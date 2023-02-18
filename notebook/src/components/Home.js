

import Notes from './Notes';


export const Home = (props) => {
  const {showAlert} = props

  return (
    <div className='home'>
    <Notes  showAlert={showAlert}/>
    </div>
  )
}

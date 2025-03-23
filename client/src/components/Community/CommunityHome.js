import {Map} from '..';
import '../../assets/CSS/CommunityHome.css';
export const CommunityHome = () => {
  return (
    <>
        <section id="details">
        <h2 style={{ textDecoration: 'underline'}}>Community Details</h2>
        <ul>
            <li className='p-28'><span> Incident Type:</span> Others</li>
            <li><span> Incident Details:</span> Quota Movement 2024</li>
            <li><span>Number of Members:</span> whole India</li>
            <li><span>Community Leader: </span>John Doe </li>
            <li><span >Community Location: </span>  India</li>
            <li><span >Date Created: </span>16/07/2024</li>
        </ul>

        </section>

        {/* <section id="forums">
            <h2>Discussion Forums</h2>
        </section> */}


        <section id="volunteer">
            <h2>Volunteer and Donation Opportunities</h2>
            <button className='volunteer-donate-btn'>Join as Volunteer</button>
            <button className='volunteer-donate-btn'>Donate Us</button>

        </section>

        <section id="maps">
            <h2>Interactive Maps</h2>
            <span style={{ display: 'block', fontWeight : 'bold'}}>Incident Location : Dehradun, Uttarakhand, India</span>
            <span style={{ display: 'block', fontWeight : 'bold'}}>Location Coordinates: 30.3165° N, 78.0322° E</span>
            < Map locations={[{ position: [30.3165, 78.0322], popupText: 'Marker 1' }]} 
            longitude={30.3165} latitude={78.0322} defaultZoom={16} />
        </section>
    </>
  )
}

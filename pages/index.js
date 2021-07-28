import React from 'react'
import Head from '../components/head'

import dynamic from 'next/dynamic';


const MapWithNoSSR = dynamic(() => import('../components/map'), {
  ssr: false
});


const Home = () => (
    // 
  <div style={{height: '100vh'}}> 
    <Head title="Live Vehicle Map" />

    <div>
      <MapWithNoSSR />
    </div>
  </div>
)

export default Home

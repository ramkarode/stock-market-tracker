import React from 'react'
import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('../../../components/alerts/AlertPage'),
 
)

const page = () => {
  return (
    <div>
      <DynamicComponentWithNoSSR />
    </div>
  )
}

export default page

import React from 'react'
import { Link } from "react-router-dom";
import './MenuLink.css'

function MenuLink(props) {
  return (
    <>
    <Link to={props.url} id="link">{props.name}</Link>
    </>
  )
}

export default MenuLink
import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
 
const SortableItem = (props) => {
  return <li className="box">{props.value}</li>
}
 
export default SortableElement(SortableItem);
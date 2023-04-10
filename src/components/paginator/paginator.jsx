 import { useEffect } from 'react';
  import { useState } from 'react';
import api from '../utilites/api';
import React from 'react';

  
  export const Paginator =({cardsListPage,totalCards})=>{
const pageCards =[];
for (let i=1; i<Math.ceil(totalCards/cardsListPage); i++){
  pageCards.push(i)
}

return (
  <div>
    <ul className='pagination'></ul>
  </div>
)

  }
  
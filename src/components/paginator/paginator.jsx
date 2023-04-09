 import React, { useState, useEffect } from 'react';
  import { useState } from 'react';
import api from '../utilites/api';
  
  export const Paginator =(cards, getPostlist)=>{
  const [cards, setCards]=useState([]);
  const [loading, setLoading]=useState([false]);
  const [currentPage, setCurrentPage]=useState([1]);
  const [sardsListPage]=useState([10]);

useEffect(()=>{

    const getCards = async ()=>{
        setLoading(true);
        const res = await api.getPostList(cards);
        setCards(res);
        setLoading(false)
        console.log(res.data);
    }
}),[]

  }
import React, { useEffect, useState } from 'react';
import './index.css';
import { Footer } from '../footer/footer.jsx';
import { Header } from '../header/header.jsx';
import api from '../utilites/api';
import { CollectionPage } from '../page/Collection/collection';
import { PostPage } from '../page/PostPage/postPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { CardContext } from '../../context/cardContext';
import { Modal } from '../Form/Modal/modal';
import { SubHeader } from '../SubHeader/subHeader';
import { FormPost } from '../FormPost/formPost';
import SearchInfo from '../SearchInfo/searchInfo.jsx';
import { EditPost } from '../EditPost/editPost';
import { Login } from '../Login/login';
import { Register } from '../Register/register';
import { ResetPass } from '../ResetPass/resetPass';
import { ModalPost } from '../Form/Modal/modalPost';
import { Profile } from '../profile/profile';
import { FaqPage } from '../page/faq/faq';
import {NoMatchFound} from '../page/NoMatchFound/noMatchFound'
import { Paginator } from '../paginator/paginator';




const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};


function App() {


  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState([null]);
  const [activeModal, setActiveModal] = useState(true);
  const [dataPostForm, setDataPostForm] = useState([]);
  const [show, setShow] = useState(true);

console.log('works');

  const debounceSearchQuery = useDebounce(searchQuery, 500);

  const handleRequest = () => {

    api
      .search(searchQuery)
      .then((res) => setCards(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleRequest();
  }, [debounceSearchQuery]);



  const handleInputChange = (inputValue) => {
    setSearchQuery(inputValue);
  };



  useEffect(() => {
    Promise.all([api.getPostList(), api.getUserInfo()]).then(([dataPosts, dataUser]) => {
      setCards(dataPosts);

      setCurrentUser(dataUser);
    });
  }, []);



  function headlyPostLike(posts) {
    const liked = posts.likes.some(id => id === currentUser?._id);

    api.changeLikePosts(posts._id, liked).then((newCard) => {

      const newPost = cards.map((cardState) => {

        return cardState._id === newCard._id ? newCard : cardState;
      })
      setCards(newPost)
    })
  }


  const addPost = (dataPostForm) => {
    setCards([dataPostForm, ...cards ])

  }
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const initialPath = location.state?.location;

 const deletePost = (cardId)=>{
setCards(cards.filter(card=>card._id !==cardId));

/////////////////////////////////////////////


  }
//  const [cards, setCards]=useState([]);
const [loading, setLoading]=useState([false]);
const [currentPage, setCurrentPage]=useState([1]);
const [cardsListPage]=useState([10]);

useEffect(()=>{

  const getCards = async ()=>{
      setLoading(true);
      const res = await api.getPostList();
      setCards(res);
      setLoading(false)
      console.log({res});
  }
  getCards();
},[])
const lastPageIndex = currentPage*cardsListPage;
const firstIndexPage = lastPageIndex-cardsListPage;
const currentCards = cards.clise(firstIndexPage,lastPageIndex)


  return (
    <>
      <CardContext.Provider value={{ cards: cards, setActiveModal: setActiveModal, setShow: setShow, headlyPostLike: headlyPostLike }}>
        <UserContext.Provider value={{ currentUser: currentUser, headlyPostLike: headlyPostLike }}>
          <div className='content_container'>
            <div className='content_cards'>
              <div className="App">

                <Header changeInput={handleInputChange} setActiveModal={setActiveModal} />
                <SearchInfo searchCount={cards.length} searchText={searchQuery} />
                <SubHeader show={show} setShow={setShow} ></SubHeader>
                <Routes location={backgroundLocation && { ...backgroundLocation, path: initialPath || location }}>
                  <Route path='/login' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                      <Login />

                    </Modal>
                  }>
                  </Route>
                  <Route path='/register' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>

                      <Register />

                    </Modal>
                  }>
                  </Route>
                  <Route path='/resetPass' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>

                      <ResetPass />

                    </Modal>
                  }>
                  </Route>
                  <Route path='/' element={
                    <CollectionPage cards={cards} currentUser={currentUser} headlyPostLike={headlyPostLike} />
                  }
                  > </Route>
                  <Route path='post/:postId' element={<PostPage currentUser={currentUser} onDeletePost={deletePost} />}></Route>

                  <Route path='/edit-post/:postId' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                      <EditPost />
                    </Modal>
                  }
                  > </Route>


                  <Route path='/formPost' element={
                    <ModalPost show={show} setShow={setShow}>
                      <div style={{ width: '600px', height: '100%' }}>
                        <FormPost addPost={addPost} />
                      </div>

                    </ModalPost>
                  }>
                  </Route>
                  <Route path='/profile' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                      <Profile />

                    </Modal>
                  }>
                  </Route>

                  <Route path='/faq' element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                      <div style={{ width: '800px', height: '100%', padding: '20px' }}>

                        <FaqPage />
                      </div>
                    </Modal>
                  }>
                  </Route>
                  <Route path='*' element={<NoMatchFound/>}></Route>
                </Routes>
                <Paginator />
                <Footer setActiveModal={setActiveModal}/>

              </div>
            </div>
          </div>
        </UserContext.Provider>
      </CardContext.Provider>
    </>

  )
}

export default App;
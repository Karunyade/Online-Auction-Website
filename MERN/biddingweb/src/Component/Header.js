import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import './Header.css'
import Home from './Home';
import Bid from './Bid';
import EntryForm from './EntryForm';
import Category from './Category';
import Auth from './Auth';
import WishList from './WishList';
import Mybid from './Mybid';
function Header(props){

    function insertProduct(products,file)
    {
        //console.log(products);
        props.insertToDB(products,file)
    }
    function searchcat(category){
        props.sprocat(category);
    }
    return(
        <BrowserRouter>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/activelis">Active Listing</Link></li>
                <li><Link to="/createlis">Create Listing</Link></li>
                <li><Link to="/category">Category</Link></li>
                <li><Link to="/wishlist">WishList</Link></li>
                <li><Link to="/mybid">My Bid</Link></li>
                <li className='corner'><Link to="/auth">Login/Register</Link></li>
            </ul>
            <Routes>
                <Route exact path='/' element={<Home/>}></Route>
                <Route exact path='/activelis' element={<Bid pro={props.pro}/>}></Route>
                <Route exact path='/createlis' element={<EntryForm setBidp={insertProduct}/>}></Route>
                <Route exact path='/category' element={<Category setCat={searchcat} cproduct={props.cproduct}/>}></Route>
                <Route exact path='/wishlist' element={<WishList/>}></Route>
                <Route exact path='/mybid' element={<Mybid/>}></Route>
                <Route exact path='/auth' element={<Auth/>}></Route>
            </Routes>
        </div>
        </BrowserRouter>
    )
}
export default Header;
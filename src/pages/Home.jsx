import React, { useEffect, useState } from 'react';
import Slide from './Slide';
import Banner from './Banner';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/userHandle';
import ProductsMenu from './customer/components/ProductsMenu';
import { NewtonsCradle } from '@uiball/loaders';
import { Link } from 'react-router-dom';

const Home = () => {

  const dispatch = useDispatch();

  const { productData, responseProducts, error } = useSelector((state) => state.user);

  const [showNetworkError, setShowNetworkError] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setShowNetworkError(true);
      }, 40000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <div id="top">
      <div className="mobile-menu">
        <ProductsMenu dropName="Categories" />
        <ProductsMenu dropName="Products" />
      </div>
      <div className="banner-box">
        <Banner />
      </div>

      {showNetworkError ? (
        <div className="styled-container">
          <h1>Sorry, network error.</h1>
        </div>
      ) : error ? (
        <div className="styled-container">
          <h1>Please Wait A Second</h1>
          <NewtonsCradle size={70} speed={1.4} color="black" />
        </div>
      ) : (
        <>
          {responseProducts ? (
            <>
              <div className="styled-container">No products found right now</div>
              <div className="styled-container">
                Become a seller to add products
                <Link to={"/Sellerregister"}>Join</Link>
              </div>
            </>
          ) : (
            <>
              <div className="component">
              <Slide products={productData} title="Top Selection" />
              <Slide products={productData} title="Deals of the Day" />
              <Slide products={productData} title="Suggested Items" />
              <Slide products={productData} title="Discounts for You" />
              <Slide products={productData} title="Recommended Items" />
              </div>
            </>
             
          )}
        </>
      )}
    </div>
  );
};

export default Home;

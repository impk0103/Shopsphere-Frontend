import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Card,Rating, TextField, Typography } from '@mui/material';
import { addToCart, underControl } from '../../../redux/userSlice';
import { BasicButton, GreenButton } from '../../../utils/buttonStyles';
import {  getProductDetails, addAReview } from '../../../redux/userHandle';
import Popup from '../../../components/Popup';
import { generateRandomColor } from '../../../utils/helperFunctions';

const ViewOrder = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const productID = params.id;

    const { currentUser, currentRole, productDetails, loading, status, error, responseReview, responseDetails } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getProductDetails(productID));
    }, [productID, dispatch]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleRatingChange = (event, newRating) => {
        setRating(newRating);
    };

    const reviewer = currentUser && currentUser.id

    const handleSubmit = (event) => {
        event.preventDefault();

        if (rating === 0) {
            setMessage("Please select a rating.");
            setShowPopup(true);
        } else {
            const fields = { rating, comment, reviewer};
            dispatch(addAReview(fields, productID));
            setRating(0);
            setComment('');
        }
    };

    const StarRating = ({ rating }) => {
        const stars = "⭐".repeat(rating); // Generate star emojis
        return <Typography variant="subtitle1">Rating: {stars}</Typography>;
      };
      

    useEffect(() => {
        if (status === "added") {
            dispatch(getProductDetails(productID));
            dispatch(underControl());
        } else if (responseReview) {
            setMessage("You have already submitted a review for this product.");
            setShowPopup(true);
        } else if (error) {
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [dispatch, responseReview, productID, status, error]);

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {
                        responseDetails ?
                            <div>Product not found</div>
                            :
                            <>
                                <ProductContainer>
                                    <ProductImage src={productDetails && productDetails.productImage} alt={productDetails && productDetails.productName} />
                                    <ProductInfo>
                                        <ProductName>{productDetails && productDetails.productName}</ProductName>
                                        <PriceContainer>
                                            <PriceCost>₹{productDetails && productDetails.price && productDetails.price.cost}</PriceCost>
                                            <PriceMrp>₹{productDetails && productDetails.price && productDetails.price.mrp}</PriceMrp>
                                            <PriceDiscount>{productDetails && productDetails.price && productDetails.price.discountPercent}% off</PriceDiscount>
                                        </PriceContainer>
                                        <Description>{productDetails && productDetails.description}</Description>
                                        <ProductDetails>
                                            <p>Category: {productDetails && productDetails.category}</p>
                                            <p>Subcategory: {productDetails && productDetails.subcategory}</p>
                                            <p>Tagline: {productDetails && productDetails.tagline}</p>
                                        </ProductDetails>
                                    </ProductInfo>
                                </ProductContainer>

                                {
                                    currentRole === "Customer" &&
                                    <>
                                        <ButtonContainer>
                                            <BasicButton
                                                onClick={() => dispatch(addToCart(productDetails))}
                                            >
                                                Add to Cart
                                            </BasicButton>
                                        </ButtonContainer>

                                        <form onSubmit={handleSubmit}>
                                            <ReviewWritingContainer>
                                                <Box>
                                                    <Rating
                                                        name="rating"
                                                        value={rating}
                                                        onChange={handleRatingChange}
                                                        size="large"
                                                    />
                                                </Box>
                                                <TextField
                                                    label="Write a Review"
                                                    variant="standard"
                                                    multiline
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    sx={{ width: "90%" }}
                                                    required
                                                />
                                                <Box sx={{ textAlign: 'right', width: '90%' }}>
                                                    <GreenButton type="submit">
                                                        Submit
                                                    </GreenButton>
                                                </Box>
                                            </ReviewWritingContainer>
                                        </form>
                                    </>
                                }
                                <ReviewWritingContainer>
                                    <Typography variant="h4">Reviews</Typography>
                                </ReviewWritingContainer>

                                {productDetails.reviews && productDetails.reviews.length > 0 ? (
                                    <ReviewContainer>
                                        {productDetails.reviews.map((review, index) => (
                                            <ReviewCard key={index}>
                                                <ReviewCardDivision>
                                                    <Avatar sx={{ width: "60px", height: "60px", marginRight: "1rem", backgroundColor: generateRandomColor(review.reviewer) }}>
                                                        👤
                                                    </Avatar>
                                                    <ReviewDetails>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                                        </div>
                                                        <Typography variant="h6">{review.reviewer.name}</Typography>
                                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                                                            <StarRating rating={review.rating} /> {/* Display stars instead of numeric rating */}
                                                        </div>

                                                        <Typography variant="body1">{review.comment}</Typography>
                                                    </ReviewDetails>
                                                </ReviewCardDivision>
                                            </ReviewCard>
                                        ))}
                                    </ReviewContainer>
                                )
                                    :
                                    <ReviewWritingContainer>
                                        <Typography variant="h6">No Reviews Found. Add a review.</Typography>
                                    </ReviewWritingContainer>
                                }
                            </>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ViewOrder;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    justify-content: center;
    align-items: center;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const ProductImage = styled.img`
    max-width: 300px;
    /* width: 50%; */
    margin-bottom: 20px;
`;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProductName = styled.h1`
    font-size: 24px;
`;

const PriceContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const PriceMrp = styled.p`
    margin-top: 8px;
    text-decoration: line-through;
    color: #525050;
`;

const PriceCost = styled.h3`
    margin-top: 8px;
`;

const PriceDiscount = styled.p`
    margin-top: 8px;
    color: darkgreen;
`;

const Description = styled.p`
    margin-top: 16px;
`;

const ProductDetails = styled.div`
    margin: 16px;
`;

const ButtonContainer = styled.div`
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ReviewWritingContainer = styled.div`
    margin: 6rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction:column;
`;

const ReviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
  && {
    background-color: white;
    margin-bottom: 2rem;
    padding: 1rem;
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewDetails = styled.div`
  flex: 1;
`;
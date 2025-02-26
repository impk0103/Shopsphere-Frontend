import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchSellerOrders } from "../../../redux/userHandle";
import TableTemplate from "../../../components/TableTemplate"

const OrderSection = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const {sellerOrders}= useSelector(state=> state.orders);

    useEffect(() => {
        if (currentUser.id) {
           dispatch(fetchSellerOrders(currentUser.id));
        }
    }, []);

    const columns = [
        { id: "buyer", label: "Buyer ID", minWidth: 150 },
        { id: "product", label: "Product Name", minWidth: 170 },
        { id: "quantity", label: "Quantity", minWidth: 100 },
        { id: "totalPrice", label: "Total Price", minWidth: 100 },
        { id: "status", label: "Order Status", minWidth: 100 },
    ];

    const rows = sellerOrders?.map(order => ({
        buyer: order.BuyerID,
        product: order.OrderedProducts.productName,
        quantity: order.ProductsQuantity,
        totalPrice: order.TotalPrice,
        status: order.OrderStatus,
        id: order.id,
    })) || [];


    return (
        <>
            <Typography variant="h5" gutterBottom>
                Seller Orders
            </Typography>
            <TableTemplate columns={columns} rows={rows}/>
        </>
    );
};

export default OrderSection;
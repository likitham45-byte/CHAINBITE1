// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChainBite {
    enum OrderStatus { Placed, Cooking, OutForDelivery, Delivered, Cancelled }

    struct Order {
        uint256 id;
        address customer;
        address restaurant;
        uint256 amount;
        OrderStatus status;
        bool isPaid;
    }

    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;

    event OrderPlaced(uint256 indexed orderId, address indexed customer, address indexed restaurant, uint256 amount);
    event StatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PaymentReleased(uint256 indexed orderId, address indexed restaurant, uint256 amount);

    function placeOrder(address _restaurant) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 orderId = nextOrderId++;
        orders[orderId] = Order({
            id: orderId,
            customer: msg.sender,
            restaurant: _restaurant,
            amount: msg.value,
            status: OrderStatus.Placed,
            isPaid: false
        });

        userOrders[msg.sender].push(orderId);
        userOrders[_restaurant].push(orderId);

        emit OrderPlaced(orderId, msg.sender, _restaurant, msg.value);
        return orderId;
    }

    function updateStatus(uint256 _orderId, OrderStatus _status) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.restaurant || msg.sender == order.customer, "Not authorized");
        
        // If status is Delivered, release payment to restaurant
        if (_status == OrderStatus.Delivered && !order.isPaid) {
            order.isPaid = true;
            (bool success, ) = order.restaurant.call{value: order.amount}("");
            require(success, "Transfer failed");
            emit PaymentReleased(_orderId, order.restaurant, order.amount);
        }

        order.status = _status;
        emit StatusUpdated(_orderId, _status);
    }
    
    function getOrders(address _user) external view returns (uint256[] memory) {
        return userOrders[_user];
    }
}

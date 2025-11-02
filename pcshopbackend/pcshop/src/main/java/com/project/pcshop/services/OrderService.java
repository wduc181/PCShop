package com.project.pcshop.services;

import com.project.pcshop.dtos.OrderDTO;
import com.project.pcshop.models.entities.*;
import com.project.pcshop.repositories.*;
import com.project.pcshop.services.interfaces.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemsRepository cartItemsRepository;

    @Override
    public Order createOrderFromCart(Long userId, OrderDTO orderDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItems> cartItems = cartItemsRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .fullName(orderDTO.getFullName())
                .email(orderDTO.getEmail())
                .address("")
                .phoneNumber(orderDTO.getPhoneNumber())
                .shippingAddress(orderDTO.getShippingAddress())
                .note(orderDTO.getNote())
                .paymentMethod(orderDTO.getPaymentMethod())
                .shippingMethod(orderDTO.getShippingMethod())
                .trackingNumber(orderDTO.getTrackingNumber())
                .orderDate(LocalDateTime.now())
                .build();

        List<OrderDetail> orderDetails = cartItems.stream().map(item -> {
            Product product = item.getProduct();
            float price = product.getPrice();
            int qty = item.getQuantity();
            float lineTotal = price * qty;

            return OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .price(price)
                    .quantity(qty)
                    .totalPrice(lineTotal)
                    .build();
        }).toList();

        float totalOrderPrice = orderDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(0f, Float::sum);

        order.setTotalPrice(totalOrderPrice);
        order.setOrderDetails(orderDetails);

        Order savedOrder = orderRepository.save(order);
        cartItemsRepository.deleteAll(cartItems);

        return savedOrder;
    }

    @Override
    public Order updateOrder(Long id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setFullName(orderDTO.getFullName());
        order.setEmail(orderDTO.getEmail());
        order.setPhoneNumber(orderDTO.getPhoneNumber());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setNote(orderDTO.getNote());
        order.setStatus(orderDTO.getStatus());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingMethod(orderDTO.getShippingMethod());
        order.setTrackingNumber(orderDTO.getTrackingNumber());
        order.setTotalPrice(order.getTotalPrice());

        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderWithDetails(Long id) {
        return orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public Page<Order> getOrdersByUser(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }
}

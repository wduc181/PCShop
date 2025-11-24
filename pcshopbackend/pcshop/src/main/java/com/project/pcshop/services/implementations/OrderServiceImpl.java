package com.project.pcshop.services.implementations;

import com.project.pcshop.security.components.SecurityUtil;
import com.project.pcshop.dtos.order.OrderCreateDTO;
import com.project.pcshop.dtos.order.OrderUpdateInfoDTO;
import com.project.pcshop.dtos.order.OrderUpdateStatusDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InsufficientStockException;
import com.project.pcshop.exceptions.OrderStatusException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.entities.*;
import com.project.pcshop.models.enums.OrderStatus;
import com.project.pcshop.models.enums.PaymentStatus;
import com.project.pcshop.repositories.*;
import com.project.pcshop.services.interfaces.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemsRepository cartItemsRepository;
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;

    @Transactional
    @Override
    public Order createOrderFromCart(Long userId, OrderCreateDTO orderCreateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!securityUtil.currentUserIsValid(userId)) {
            throw new PermissionDenyException("You don't have permission to create order for another user");
        }

        List<CartItems> cartItems = cartItemsRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        Order order = Order.builder()
                .user(user)
                .fullName(orderCreateDTO.getFullName())
                .email(orderCreateDTO.getEmail())
                .address(orderCreateDTO.getShippingAddress())
                .phoneNumber(orderCreateDTO.getPhoneNumber())
                .shippingAddress(orderCreateDTO.getShippingAddress())
                .note(orderCreateDTO.getNote())
                .paymentMethod(orderCreateDTO.getPaymentMethod())
                .shippingMethod(orderCreateDTO.getShippingMethod())
                .orderDate(LocalDateTime.now())
                .build();

        List<OrderDetail> orderDetails = cartItems.stream().map(item -> {
            Product product = item.getProduct();
            float price = product.getPrice();
            int qty = item.getQuantity();
            int stock = product.getStockQuantity();
            if (qty > stock) {
                throw new InsufficientStockException("Not enough product to make order");
            }
            product.setStockQuantity(stock - qty);
            productRepository.save(product);
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
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Page<Order> getOrdersByUser(Long userId, Pageable pageable) {
        if (!(securityUtil.currentUserIsValid(userId) || securityUtil.currentUserIsAdmin())) {
            throw new PermissionDenyException("You don't have permission to see orders of this user");
        }
        return orderRepository.findByUserId(userId, pageable);
    }

    @Override
    public Order getOrderWithDetails(Long id) {
        return orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    @Override
    public Order updateOrderInfo(Long id, OrderUpdateInfoDTO orderUpdateInfoDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!(securityUtil.currentUserIsValid(orderUpdateInfoDTO.getUserId()) || securityUtil.currentUserIsAdmin())) {
            throw new PermissionDenyException("You don't have permission to update order for another user");
        }
        if (order.getStatus() != OrderStatus.pending) {
            throw new OrderStatusException("Order status didn't allowed to update info");
        }
        order.setFullName(orderUpdateInfoDTO.getFullName());
        order.setEmail(orderUpdateInfoDTO.getEmail());
        order.setPhoneNumber(orderUpdateInfoDTO.getPhoneNumber());
        order.setShippingAddress(orderUpdateInfoDTO.getShippingAddress());
        order.setNote(orderUpdateInfoDTO.getNote());
        order.setPaymentMethod(orderUpdateInfoDTO.getPaymentMethod());
        order.setShippingMethod(orderUpdateInfoDTO.getShippingMethod());

        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order updateOrderStatus(Long id, OrderUpdateStatusDTO orderUpdateStatusDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        existingOrder.setStatus(orderUpdateStatusDTO.getStatus());
        if (orderUpdateStatusDTO.getStatus().equals(OrderStatus.delivered)) {
            existingOrder.setPaymentStatus(PaymentStatus.paid);
        }
        return orderRepository.save(existingOrder);
    }

    @Transactional
    @Override
    public void cancelOrder(Long id) throws DataNotFoundException {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Order not found"));
        if (!(securityUtil.currentUserIsAdmin() || securityUtil.currentUserIsValid(existingOrder.getUser().getId()))) {
            throw new PermissionDenyException("You don't have permission to cancel this order");
        }
        if (!existingOrder.getStatus().equals(OrderStatus.pending)) {
            throw new OrderStatusException("Order status didn't allowed to cancel this order");
        }
        existingOrder.setStatus(OrderStatus.cancelled);
        orderRepository.save(existingOrder);
    }
}
package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.OrderDTO;
import com.project.pcshop.models.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    Order createOrderFromCart(Long userId, OrderDTO orderDTO);
    Order updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    List<Order> getAllOrders();
    Order getOrderWithDetails(Long id);
    Page<Order> getOrdersByUser(Long userId, Pageable pageable);
}

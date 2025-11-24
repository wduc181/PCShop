package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.order.OrderCreateDTO;
import com.project.pcshop.dtos.order.OrderUpdateInfoDTO;
import com.project.pcshop.dtos.order.OrderUpdateStatusDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.models.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    Order createOrderFromCart(Long userId, OrderCreateDTO orderCreateDTO);
    List<Order> getAllOrders();
    Page<Order> getOrdersByUser(Long userId, Pageable pageable);
    Order getOrderWithDetails(Long id);
    Order updateOrderInfo(Long id, OrderUpdateInfoDTO orderUpdateInfoDTO);
    Order updateOrderStatus(Long id, OrderUpdateStatusDTO orderUpdateStatusDTO);
    void cancelOrder(Long id) throws DataNotFoundException;
}
